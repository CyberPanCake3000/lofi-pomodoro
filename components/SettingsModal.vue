<template>
  <transition name="modal fade" tabindex="-1">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <div class="modal-dialog" @click.stop>
        <div class='modal-content p-4'>
          <div class="modal-header mb-3">
            <h5 class="modal-title">Settings</h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div>

          <form @submit.prevent="saveSettings">
            <div class='modal-body'>
              <div class='mb-3'>
                <div class='row g-3 mb-3'>
                  <div class='col'>
                    <label class="form-label d-block mb-1 fs-6" for="pomodoroDuration">Pomodoro</label>
                    <input class="form-control" :class="{ 'is-invalid': !isValidInput(localSettings.pomodoroDuration) }"
                      id="pomodoroDuration" v-model="localSettings.pomodoroDuration"
                      @input="validateInput('pomodoroDuration')" type="text" required>
                  </div>
                  <div class='col'>
                    <label class="form-label d-block mb-1 fs-6" for="shortBreakDuration">Short Break</label>
                    <input class="form-control"
                      :class="{ 'is-invalid': !isValidInput(localSettings.shortBreakDuration) }" id="shortBreakDuration"
                      v-model="localSettings.shortBreakDuration" @input="validateInput('shortBreakDuration')"
                      type="text" required>
                  </div>
                  <div class='col'>
                    <label class="form-label d-block mb-1 fs-6" for="longBreakDuration">Long Break</label>
                    <input class="form-control"
                      :class="{ 'is-invalid': !isValidInput(localSettings.longBreakDuration) }" id="longBreakDuration"
                      v-model="localSettings.longBreakDuration" @input="validateInput('longBreakDuration')" type="text"
                      required>
                  </div>
                </div>

                <div class='row mb-2'>
                  <div class='row col-12 pe-0'>
                    <label class='form-label col-9 mb-0 d-flex align-items-center' for="longBreakInterval">Long Break
                      Interval</label>
                    <input class="form-control col"
                      :class="{ 'is-invalid': !isValidInput(localSettings.longBreakInterval) }" id="longBreakInterval"
                      v-model="localSettings.longBreakInterval" @input="validateInput('longBreakInterval')" type="text"
                      required>
                  </div>
                </div>

                <div class='row mb-2'>
                  <div class='col-12'>
                    <div class="form-check form-switch d-flex align-center">
                      <input class="form-check-input me-2" id="autoStartPomodoro"
                        v-model="localSettings.autoStartPomodoro" type="checkbox" role="switch">
                      <label class="form-check-label mb-0 d-flex align-items-center" for="autoStartPomodoro">Auto Start
                        Pomodoro</label>
                    </div>
                  </div>
                </div>

                <div class='row mb-2'>
                  <div class='col-12'>
                    <div class="form-check form-switch d-flex align-center">
                      <input class="form-check-input me-2" id="autoStartBreak" v-model="localSettings.autoStartBreak"
                        type="checkbox" role="switch">
                      <label class="form-check-label mb-0 d-flex align-items-center" for="autoStartBreak">Auto Start
                        Break</label>
                    </div>
                  </div>
                </div>

                <div class="volume-controls">
                  <h5>Volume</h5>

                  <div class='d-flex'>

                  <div class="volume-control me-2">
                    <label for="radio-volume" class="form-label">Radio</label>
                    <input type="range" class="form-range" id="radio-volume" min="0.2" max="1" step="0.1" v-model.number="localSettings.radioVolume">
                  </div>
                  <div class="volume-control ms-2">
                    <label for="bell-volume" class="form-label">Bell</label>
                    <input type="range" class="form-range" id="bell-volume" min="0.2" max="1" step="0.1" v-model.number="localSettings.bellVolume">
                  </div>

                  </div>
                </div>

                <div class='mb-3'>
                  <label class="form-label d-block mb-1 fs-6" for="streamLink">Stream Link</label>
                  <input class="form-control" id="streamLink" v-model="localSettings.streamLink" type="url" required>
                </div>
              </div>
            </div>
            <div class='modal-footer d-flex justify-content-center'>
              <button type="submit" class="btn btn-primary me-2 btn-primary" :disabled="!isFormValid">Save</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  name: 'SettingsModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    initialSettings: {
      type: Object,
      required: true
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const localSettings = ref({ ...props.initialSettings });

    watch(() => props.initialSettings, (newSettings) => {
      localSettings.value = { ...newSettings };
    }, { deep: true });

    const isValidInput = (value) => {
      return value === '' || /^[1-9]\d*$/.test(value.toString());
    };

    const validateInput = (field) => {
      const currentValue = localSettings.value[field].toString();
      const newValue = currentValue.replace(/^0+/, '').replace(/[^0-9]/g, '');
      localSettings.value[field] = newValue;
    };

    const isFormValid = computed(() => {
      return Object.entries(localSettings.value).every(([key, value]) => {
        if (['pomodoroDuration', 'shortBreakDuration', 'longBreakDuration', 'longBreakInterval'].includes(key)) {
          return isValidInput(value) && value !== '';
        }
        return true;
      });
    });

    const saveSettings = () => {
      if (isFormValid.value) {
        emit('save', { ...localSettings.value });
        emit('close');
      }
    };

    const closeModal = () => {
      localSettings.value = { ...props.initialSettings };
      emit('close');
    };

    return {
      localSettings,
      saveSettings,
      closeModal,
      isValidInput,
      validateInput,
      isFormValid
    };
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
</style>