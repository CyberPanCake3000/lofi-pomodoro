<template>
  <transition name="modal fade" tabindex="-1">
    <div v-if="show" class="modal-overlay" @click="closeModal">
      <div class="modal-dialog" @click.stop>
        <div class='modal-content p-4'>
          <div class="modal-header mb-3">
            <h5 class="modal-title">Statistics</h5>
            <button type="button" class="btn-close ms-auto" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            We are working on it!
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'StatModal',
  props: {
    show: Boolean,
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closeModal = () => {
      localSettings.value = {...props.initialSettings};
      emit('close');
    };

    return { closeModal };
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