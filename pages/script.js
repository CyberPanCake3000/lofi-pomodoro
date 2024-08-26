import { ref, onMounted, onUnmounted } from 'vue';

export default function usePomodoro() {
  const time = ref('25:00');
  let interval = null;
  const timerRunning = ref(false);
  const isPomodoro = ref(true);
  const lofiPlaying = ref(false);
  const lofiAudio = ref(null);

  const startTimer = () => {
    if (interval) return;
    let [minutes, seconds] = time.value.split(':').map(Number);

    interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          interval = null;

          alert(isPomodoro.value ? 'Pomodoro is over!' : 'Break is over!');
          isPomodoro.value = !isPomodoro.value;
          time.value = isPomodoro.value ? '25:00' : '05:00';
          timerRunning.value = false;
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
      time.value = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);

    if (lofiPlaying.value && isPomodoro.value) lofiAudio.value.play();
  };

  const stopTimer = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
      if (lofiPlaying.value && isPomodoro.value) lofiAudio.value.pause();
    }
  };

  const toggleTimer = () => {
    if (timerRunning.value) {
      stopTimer();
    } else {
      startTimer();
    }
    timerRunning.value = !timerRunning.value;
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
    isPomodoro.value = !isPomodoro.value;
    time.value = isPomodoro.value ? '25:00' : '05:00';
    timerRunning.value = false;
    if (lofiPlaying.value && isPomodoro.value) lofiAudio.value.pause();
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


  return {
    lofiPlaying,
    lofiAudio,
    toggleLofi,

    timerRunning,
    time,
    toggleTimer,
    skipTimer,

    settingsOpenModal,
    openSettings,
    closeSettings,

    showStat,
    closeStat,
    statOpenModal,
  };
}