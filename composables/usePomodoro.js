import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useIntervalFn } from '@vueuse/core';

export default function usePomodoro() {
  // State
  const time = ref('25:00');
  const defaultStreamLink = 'https://ec3.yesstreaming.net:3755/stream';
  const settings = reactive({
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartPomodoro: false,
    autoStartBreak: false,
    streamLink: defaultStreamLink,
  });

  const timerRunning = ref(false);
  const isPomodoro = ref(true);
  const radioPlaying = ref(false);
  const radioAudio = ref(null);
  const settingsOpenModal = ref(false);
  const statOpenModal = ref(false);
  const pomodoroCount = ref(0);
  const streamError = ref(false);
  const notificationAudio = ref(null);

  let interval = null;

  // Helper functions
  const formatTime = (minutes) => `${String(minutes).padStart(2, '0')}:00`;

  const getTimerDuration = () => {
    if (isPomodoro.value) return settings.pomodoroDuration;
    return (pomodoroCount.value % settings.longBreakInterval === 0)
      ? settings.longBreakDuration
      : settings.shortBreakDuration;
  };

  const resetTimer = () => {
    time.value = formatTime(getTimerDuration());
  };

  // Audio functions
  const initAudio = async () => {
    if (typeof window !== 'undefined') {
      const bellDingModule = await import('@/assets/sounds/bell-ding.mp3');
      notificationAudio.value = new Audio(bellDingModule.default);
    }
  };

  const fadeOutLofi = (duration) => {
    if (!radioAudio.value) return;

    const fadeOutInterval = 50;
    const volumeStep = radioAudio.value.volume / (duration * 1000 / fadeOutInterval);

    const fade = setInterval(() => {
      radioAudio.value.volume = Math.max(0, radioAudio.value.volume - volumeStep);
      if (radioAudio.value.volume <= 0) {
        clearInterval(fade);
        radioAudio.value.pause();
        radioAudio.value.volume = 1; // Reset volume for next play
      }
    }, fadeOutInterval);
  };

  const playBellSound = () => {
    if (notificationAudio.value) {
      notificationAudio.value.play();
    }
  };

  // Timer functions
  const startTimer = () => {
    if (interval) return;
    let [minutes, seconds] = time.value.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    const startTime = Date.now();

    interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remainingSeconds = totalSeconds - elapsedSeconds;

      if (remainingSeconds <= 0) {
        handleTimerEnd();
        return;
      }

      minutes = Math.floor(remainingSeconds / 60);
      seconds = remainingSeconds % 60;

      if (isPomodoro.value && radioPlaying.value && remainingSeconds === 30) {
        fadeOutLofi(30);
      }

      time.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    timerRunning.value = true;
    if (radioPlaying.value && isPomodoro.value) {
      radioAudio.value.play();
    }
  };

  const stopTimer = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      timerRunning.value = false;
      if (radioPlaying.value && isPomodoro.value) radioAudio.value.pause();
    }
  };

  const handleTimerEnd = () => {
    clearInterval(interval);
    interval = null;
    if (isPomodoro.value) {
      pomodoroCount.value++;
      if (radioPlaying.value) {
        fadeOutLofi(5);
        setTimeout(playBellSound, 5000);
      } else {
        playBellSound();
      }
    } else {
      playBellSound();
    }
    isPomodoro.value = !isPomodoro.value;
    resetTimer();
    if ((isPomodoro.value && settings.autoStartPomodoro) || (!isPomodoro.value && settings.autoStartBreak)) {
      startTimer();
    } else {
      timerRunning.value = false;
    }
  };

  const toggleTimer = () => {
    if (timerRunning.value) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const skipTimer = () => {
    stopTimer();
    if (isPomodoro.value) {
      pomodoroCount.value++;
    }
    isPomodoro.value = !isPomodoro.value;
    resetTimer();
    if ((isPomodoro.value && settings.autoStartPomodoro) || (!isPomodoro.value && settings.autoStartBreak)) {
      startTimer();
    }
  };

  // Lofi functions
  const toggleLofi = () => {
    radioPlaying.value = !radioPlaying.value;
    if (radioPlaying.value) {
      if (!radioAudio.value.src) {
        radioAudio.value.src = settings.streamLink;
      }
      radioAudio.value.play().catch(error => {
        console.error('Failed to play audio:', error);
        streamError.value = true;
      });
      resumeAudioCheck();
    } else {
      radioAudio.value.pause();
      pauseAudioCheck();
    }
  };

  // Settings functions
  const checkStreamValidity = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking stream:', error);
      return false;
    }
  };

  const updateSettings = async (newSettings) => {
    const oldStreamLink = settings.streamLink;
    Object.assign(settings, newSettings);
    resetTimer();

    if (newSettings.streamLink !== oldStreamLink) {
      const isValid = await checkStreamValidity(newSettings.streamLink);
      if (!isValid) {
        toast.error('Invalid stream URL. Reverting to default stream.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
        settings.streamLink = defaultStreamLink;
        if (radioAudio.value) {
          radioAudio.value.src = defaultStreamLink;
        }
      }
    }

    return true;
  };

  // Lifecycle hooks
  const initRadioAudio = () => {
    if (typeof window !== 'undefined') {
      radioAudio.value = new Audio();
      radioAudio.value.preload = 'none';
      radioAudio.value.loop = true;

      radioAudio.value.addEventListener('play', () => console.log('Radio audio playing'));
      radioAudio.value.addEventListener('pause', () => console.log('Radio audio paused'));
      radioAudio.value.addEventListener('error', (e) => {
        console.error('Radio audio error', e);
        streamError.value = true;
        restartRadioStream();
      });
    }
  };

  const restartRadioStream = () => {
    if (radioAudio.value) {
      radioAudio.value.src = settings.streamLink;
      if (radioPlaying.value) {
        radioAudio.value.play().catch(error => {
          console.error('Failed to restart radio stream:', error);
          streamError.value = true;
        });
      }
    }
  };

  const { pause: pauseAudioCheck, resume: resumeAudioCheck } = useIntervalFn(() => {
    if (radioPlaying.value && radioAudio.value && radioAudio.value.paused) {
      console.log('Attempting to restart paused audio');
      radioAudio.value.play().catch(error => {
        console.error('Failed to restart audio:', error);
        streamError.value = true;
      });
    }
  }, 5000);

  onMounted(() => {
    initRadioAudio();
    initAudio();
    window.addEventListener('online', restartRadioStream);
  });

  onUnmounted(() => {
    stopTimer();
    if (radioAudio.value) {
      radioAudio.value.pause();
      radioAudio.value.src = '';
    }
    pauseAudioCheck();
    window.removeEventListener('online', restartRadioStream);
  });

  // Watchers
  watch(settings, resetTimer);

  return {
    pomodoroCount,
    radioPlaying,
    radioAudio,
    toggleLofi,
    timerRunning,
    time,
    toggleTimer,
    skipTimer,
    settings,
    settingsOpenModal,
    openSettings: () => settingsOpenModal.value = true,
    closeSettings: () => settingsOpenModal.value = false,
    updateSettings,
    showStat: () => statOpenModal.value = true,
    closeStat: () => statOpenModal.value = false,
    statOpenModal,
    streamError,
    defaultStreamLink,
    notificationAudio,
    restartRadioStream,
  };
}