<template>
  <transition name="modal">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <h2>Settings</h2>
        <form @submit.prevent="saveSettings">
          <div>
            <label for="pomodoroDuration">Pomodoro Duration (minutes):</label>
            <input id="pomodoroDuration" v-model.number="settings.pomodoroDuration" type="number" min="1" required>
          </div>
          <div>
            <label for="shortBreakDuration">Short Break Duration (minutes):</label>
            <input id="shortBreakDuration" v-model.number="settings.shortBreakDuration" type="number" min="1" required>
          </div>
          <div>
            <label for="longBreakDuration">Long Break Duration (minutes):</label>
            <input id="longBreakDuration" v-model.number="settings.longBreakDuration" type="number" min="1" required>
          </div>
          <div>
            <label for="longBreakInterval">Long Break Interval:</label>
            <input id="longBreakInterval" v-model.number="settings.longBreakInterval" type="number" min="1" required>
          </div>
          <div>
            <label for="autoStartPomodoro">Auto Start Pomodoro:</label>
            <input id="autoStartPomodoro" v-model="settings.autoStartPomodoro" type="checkbox">
          </div>
          <div>
            <label for="autoStartBreak">Auto Start Break:</label>
            <input id="autoStartBreak" v-model="settings.autoStartBreak" type="checkbox">
          </div>
          <button type="submit">Save</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SettingsModal',
  props: {
    show: Boolean,
    initialSettings: Object
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const settings = ref({ ...props.initialSettings });

    const saveSettings = () => {
      emit('save', settings.value);
      emit('close');
    };

    return { settings, saveSettings };
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>