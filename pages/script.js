import { ref, onMounted, onUnmounted } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default function usePomodoro() {
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
  const lofiPlaying = ref(false);
  const lofiAudio = ref(null);
  const settingsOpen = ref(false);
  const pomodoroCount = ref(0);
  const streamError = ref(false);
  const notificationAudio = ref(null);

  let interval = null;

  const initAudio = async () => {
    if (typeof window !== 'undefined') {
      const bellDingModule = await import('@/assets/sounds/bell-ding.mp3');
      notificationAudio.value = new Audio(bellDingModule.default);
    }
  };

  const formatTime = (minutes) => {
    return `${String(minutes).padStart(2, '0')}:00`;
  };

  const getTimerDuration = () => {
    if (isPomodoro.value) {
      return settings.pomodoroDuration;
    } else {
      return (pomodoroCount.value % settings.longBreakInterval === 0)
        ? settings.longBreakDuration
        : settings.shortBreakDuration;
    }
  };

  const resetTimer = () => {
    time.value = formatTime(getTimerDuration());
  };

  const fadeOutLofi = (duration) => {
    if (!lofiAudio.value) return;

    const fadeOutInterval = 50;
    const volumeStep = lofiAudio.value.volume / (duration * 1000 / fadeOutInterval);

    const fade = setInterval(() => {
      lofiAudio.value.volume = Math.max(0, lofiAudio.value.volume - volumeStep);
      if (lofiAudio.value.volume <= 0) {
        clearInterval(fade);
        lofiAudio.value.pause();
        lofiAudio.value.volume = 1; // Reset volume for next play
      }
    }, fadeOutInterval);
  };

  const playBellSound = () => {
    if (notificationAudio.value) {
      notificationAudio.value.play();
    }
  };

  const startTimer = () => {
    if (interval) return;
    let [minutes, seconds] = time.value.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          interval = null;
          if (isPomodoro.value) {
            pomodoroCount.value++;
            fadeOutLofi(5);
            setTimeout(playBellSound, 5000);
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
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }

      if (isPomodoro.value && lofiPlaying.value && totalSeconds - (minutes * 60 + seconds) === 30) {
        fadeOutLofi(30);
      }

      time.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    timerRunning.value = true;
    if (lofiPlaying.value && isPomodoro.value) {
      lofiAudio.value.play();
    }
  };

  const stopTimer = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      timerRunning.value = false;
      if (lofiPlaying.value && isPomodoro.value) lofiAudio.value.pause();
    }
  };

  const toggleTimer = () => {
    if (timerRunning.value) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const toggleLofi = () => {
    lofiPlaying.value = !lofiPlaying.value;
    if (lofiPlaying.value && isPomodoro.value && timerRunning.value) {
      lofiAudio.value.play();
    } else {
      lofiAudio.value.pause();
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


  onMounted(() => {
    if (lofiAudio.value) {
      lofiAudio.value.addEventListener('play', () => console.log('Audio playing'));
      lofiAudio.value.addEventListener('pause', () => console.log('Audio paused'));
      lofiAudio.value.addEventListener('error', (e) => console.error('Audio error', e));
    }
    initAudio();
  });

  onUnmounted(() => {
    stopTimer();
    if (lofiAudio.value) {
      lofiAudio.value.removeEventListener('play', () => console.log('Audio playing'));
      lofiAudio.value.removeEventListener('pause', () => console.log('Audio paused'));
      lofiAudio.value.removeEventListener('error', (e) => console.error('Audio error', e));
    }
  });

  const settingsOpenModal = ref(false);

  const openSettings = () => {
    settingsOpenModal.value = true;
  };

  const closeSettings = () => {
    settingsOpenModal.value = false;
  };

  const statOpenModal = ref(false);

  const showStat = () => {
    statOpenModal.value = true;
  }

  const closeStat = () => {
    statOpenModal.value = false;
  }

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
      checkStreamValidity(newSettings.streamLink).then((isValid) => {
        if (!isValid) {
          toast.error('Invalid stream URL. Reverting to default stream.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          });
          settings.streamLink = defaultStreamLink;
          if (lofiAudio.value) {
            lofiAudio.value.src = defaultStreamLink;
          }
        }
      });
    }

    return true;
  };

  watch(settings, () => {
    resetTimer();
  });


  return {
    pomodoroCount,
    lofiPlaying,
    lofiAudio,
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
    showStat,
    closeStat,
    statOpenModal,
    streamError,
    defaultStreamLink,
    notificationAudio,
  };
}