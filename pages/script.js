import { ref, onMounted, onUnmounted } from 'vue';

export default function usePomodoro() {
  const time = ref('25:00');
  const settings = reactive({
    pomodoroDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartPomodoro: false,
    autoStartBreak: false
  });

  const timerRunning = ref(false);
  const isPomodoro = ref(true);
  const lofiPlaying = ref(false);
  const lofiAudio = ref(null);
  const settingsOpen = ref(false);
  const pomodoroCount = ref(0);

  let interval = null;

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

  const startTimer = () => {
    if (interval) return;
    let [minutes, seconds] = time.value.split(':').map(Number);

    interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          interval = null;
          if (isPomodoro.value) {
            pomodoroCount.value++;
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
      time.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    timerRunning.value = true;
    if (lofiPlaying.value && isPomodoro.value) lofiAudio.value.play();
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

  const updateSettings = (newSettings) => {
    Object.assign(settings, newSettings);
    resetTimer();
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
    openSettings,
    closeSettings,
    updateSettings,

    showStat,
    closeStat,
    statOpenModal,
  };
}