<template>
  <transition name="modal fade" tabindex="-1">
    <div v-if="show" class="modal-overlay" @click="$emit('close')">
      <div class="modal-dialog" @click.stop>

        <div class='modal-content'>
          <div class="modal-header">
            <h5 class="modal-title">Settings</h5>
            <button type="button" class="btn-close ms-auto" @click="$emit('close')" aria-label="Close"></button>
          </div>

          <form @submit.prevent="saveSettings">
            <div class='modal-body'>

              <div class='mb-3'>
                <div class='row g-3 mb-3'>
                  <div class='col'>
                    <label class="form-label d-block mb-1 fs-6" for="pomodoroDuration">Pomodoro</label>
                    <input class="form-control" id="pomodoroDuration" v-model.number="settings.pomodoroDuration"
                      type="number" min="1" required>
                  </div>
                  <div class='col'>
                    <label class="form-label d-block mb-1 fs-6" for="shortBreakDuration">Short Break</label>
                    <input class="form-control" id="shortBreakDuration" v-model.number="settings.shortBreakDuration"
                      type="number" min="1" required>
                  </div>
                  <div class='col'>
                    <label class="form-label d-block mb-1 fs-6" for="longBreakDuration">Long Break</label>
                    <input class="form-control" id="longBreakDuration" v-model.number="settings.longBreakDuration"
                      type="number" min="1" required>
                  </div>
                </div>

                <div class='row mb-3'>
                  <div class='row col-12 pe-0'>
                    <label class='form-label col-10 mb-0 d-flex align-items-center' for="longBreakInterval">Long Break
                      Interval</label>
                    <input class="form-control col" id="longBreakInterval" v-model.number="settings.longBreakInterval"
                      type="number" min="1" required>
                  </div>
                </div>

                <div class='row mb-2'>
                  <div class='col-12'>
                    <div class="form-check form-switch">
                      <input class="form-check-input" id="autoStartPomodoro" v-model="settings.autoStartPomodoro"
                        type="checkbox" role="switch">
                      <label class="form-check-label" for="autoStartPomodoro">Auto Start Pomodoro</label>
                    </div>
                  </div>
                </div>

                <div class='row'>
                  <div class='col-12'>
                    <div class="form-check form-switch">
                      <input class="form-check-input" id="autoStartBreak" v-model="settings.autoStartBreak"
                        type="checkbox" role="switch">
                      <label class="form-check-label" for="autoStartBreak">Auto Start Break</label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div class='modal-footer'>
              <button type="submit" class="btn btn-primary me-2">Save</button>
              <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
            </div>
          </form>

        </div>

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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-dialog {
  margin: 1.75rem auto;
  min-width: 325px;
  max-width: 350px;
}

.modal-content {
  border-radius: 0.3rem;
}
</style>