import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useIntervalFn } from '@vueuse/core';

import bellDingSound from '@/assets/sounds/bell-ding.mp3';

export default function usePomodoro() {
  const DEFAULT_STREAM_LINK = 'https://ec3.yesstreaming.net:3755/stream';

  const state = reactive({
    time: '25:00',
    timerRunning: false,
    isPomodoro: true,
    radioPlaying: false,
    pomodoroCount: 0,
    streamError: false,
    settingsOpenModal: false,
    statOpenModal: false,
  });

  const settings = reactive({
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartPomodoro: false,
    autoStartBreak: false,
    streamLink: DEFAULT_STREAM_LINK,
    radioVolume: 1,
    bellVolume: 1,
  });

  const radioAudio = ref(null);
  const notificationAudio = ref(null);

  let interval = null;

  const formatTime = (minutes) => `${String(minutes).padStart(2, '0')}:00`;

  const getTimerDuration = () => {
    if (state.isPomodoro) return settings.pomodoroDuration;
    return (state.pomodoroCount % settings.longBreakInterval === 0)
      ? settings.longBreakDuration
      : settings.shortBreakDuration;
  };

  const resetTimer = () => {
    state.time = formatTime(getTimerDuration());
  };

  const initAudio = () => {
    if (typeof window !== 'undefined') {
      notificationAudio.value = new Audio(bellDingSound);
      notificationAudio.value.volume = settings.bellVolume;
    }
  };

  const fadeOutLofi = (duration) => {
    if (!radioAudio.value) return;

    const fadeOutInterval = 10;
    const volumeStep = radioAudio.value.volume / (duration * 1000 / fadeOutInterval);

    const fade = setInterval(() => {
      radioAudio.value.volume = Math.max(0, radioAudio.value.volume - volumeStep);
      if (radioAudio.value.volume <= 0) {
        clearInterval(fade);
        radioAudio.value.pause();
        radioAudio.value.volume = settings.radioVolume;
      }
    }, fadeOutInterval);
  };

  const playBellSound = () => {
    if (notificationAudio.value) {
      notificationAudio.value.play().catch(error => console.error('Failed to play notification sound:', error));
    }
  };

  const startTimer = () => {
    if (interval) return;
    let [minutes, seconds] = state.time.split(':').map(Number);
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

      if (state.isPomodoro && state.radioPlaying && remainingSeconds === 30) {
        fadeOutLofi(30);
      }

      state.time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    state.timerRunning = true;
    updateRadioPlayback();
  };

  const stopTimer = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      state.timerRunning = false;
      if (state.radioPlaying && state.isPomodoro) {
        radioAudio.value.pause();
      }
    }
  };

  const handleTimerEnd = () => {
    clearInterval(interval);
    interval = null;
    if (state.isPomodoro) {
      state.pomodoroCount++;
      if (state.radioPlaying) {
        fadeOutLofi(5);
      }
      playBellSound();
    } else {
      playBellSound();
    }
    state.isPomodoro = !state.isPomodoro;
    resetTimer();
    if ((state.isPomodoro && settings.autoStartPomodoro) || (!state.isPomodoro && settings.autoStartBreak)) {
      startTimer();
    } else {
      state.timerRunning = false;
    }
    updateRadioPlayback();
  };

  const toggleTimer = () => {
    if (state.timerRunning) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const skipTimer = () => {
    stopTimer();
    if (state.isPomodoro) {
      state.pomodoroCount++;
    }
    state.isPomodoro = !state.isPomodoro;
    resetTimer();
    if ((state.isPomodoro && settings.autoStartPomodoro) || (!state.isPomodoro && settings.autoStartBreak)) {
      startTimer();
    }
  };

  const toggleRadio = () => {
    state.radioPlaying = !state.radioPlaying;
    updateRadioPlayback();
  };

  const setRadioVolume = (volume) => {
    settings.radioVolume = volume;
    if (radioAudio.value) {
      radioAudio.value.volume = volume;
    }
  };

  const setBellVolume = (volume) => {
    settings.bellVolume = volume;
    if (notificationAudio.value) {
      notificationAudio.value.volume = volume;
    }
  };

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
    setRadioVolume(newSettings.radioVolume);
    setBellVolume(newSettings.bellVolume);
    resetTimer();

    if (newSettings.streamLink !== oldStreamLink) {
      const isValid = await checkStreamValidity(newSettings.streamLink);
      if (!isValid) {
        toast.error('Invalid stream URL. Reverting to default stream.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        });
        settings.streamLink = DEFAULT_STREAM_LINK;
        if (radioAudio.value) {
          radioAudio.value.src = DEFAULT_STREAM_LINK;
        }
      }
    }

    return true;
  };

  const updateRadioPlayback = () => {
    if (state.radioPlaying && state.isPomodoro && state.timerRunning) {
      if (!radioAudio.value.src) {
        radioAudio.value.src = settings.streamLink;
      }
      radioAudio.value.play().catch(error => {
        console.error('Failed to play audio:', error);
        state.streamError = true;
      });
      radioAudio.value.volume = settings.radioVolume;
    } else {
      radioAudio.value.pause();
    }
  };

  const initRadioAudio = () => {
    if (typeof window !== 'undefined') {
      radioAudio.value = new Audio();
      radioAudio.value.preload = 'none';
      radioAudio.value.loop = true;
      radioAudio.value.volume = settings.radioVolume;

      radioAudio.value.addEventListener('play', () => console.log('Radio audio playing'));
      radioAudio.value.addEventListener('pause', () => console.log('Radio audio paused'));
      radioAudio.value.addEventListener('error', (e) => {
        console.error('Radio audio error', e);
        state.streamError = true;
        restartRadioStream();
      });
    }
  };

  const restartRadioStream = () => {
    if (radioAudio.value) {
      radioAudio.value.src = settings.streamLink;
      if (state.radioPlaying) {
        radioAudio.value.volume = settings.radioVolume;
        radioAudio.value.play().catch(error => {
          console.error('Failed to restart radio stream:', error);
          state.streamError = true;
        });
      }
    }
  };

  const handleVisibilityChange = () => {
    if (!document.hidden && state.radioPlaying && state.isPomodoro && state.timerRunning) {
      radioAudio.value.play().catch(error => {
        console.error('Failed to play audio on visibility change:', error);
        state.streamError = true;
      });
    }
  };

  const { pause: pauseAudioCheck, resume: resumeAudioCheck } = useIntervalFn(() => {
    if (state.radioPlaying && radioAudio.value && radioAudio.value.paused && state.isPomodoro && state.timerRunning) {
      radioAudio.value.play().catch(error => {
        console.error('Failed to restart audio:', error);
        state.streamError = true;
      });
      radioAudio.value.volume = settings.radioVolume;
    }
  }, 5000);

  onMounted(() => {
    initRadioAudio();
    initAudio();
    window.addEventListener('online', restartRadioStream);
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onUnmounted(() => {
    stopTimer();
    if (radioAudio.value) {
      radioAudio.value.pause();
      radioAudio.value.src = '';
    }
    pauseAudioCheck();
    window.removeEventListener('online', restartRadioStream);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  watch(() => [state.isPomodoro, state.timerRunning, state.radioPlaying], updateRadioPlayback);

  return {
    state,
    settings,
    toggleRadio,
    toggleTimer,
    skipTimer,
    openSettings: () => state.settingsOpenModal = true,
    closeSettings: () => state.settingsOpenModal = false,
    updateSettings,
    showStat: () => state.statOpenModal = true,
    closeStat: () => state.statOpenModal = false,
    DEFAULT_STREAM_LINK,
    restartRadioStream,
    updateRadioPlayback,
    setRadioVolume,
    setBellVolume,
  };
}