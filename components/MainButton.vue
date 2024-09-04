<template>
  <button @click="$emit('click')" :class="['main-button-container', className, { active: active }]">
    <div :class="contentClass">
      <component :is="icon" v-bind="iconProps" :class="['svg-icon', `${iconName}-icon`]" />
      <span v-if="showTitle" :class="['cute-title', `${iconName}-title`]">
        <slot></slot>
      </span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'MainButton',
  props: {
    icon: {
      type: [Object, Function],
      required: true
    },
    iconProps: {
      type: Object,
      default: () => ({})
    },
    active: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    },
    contentClass: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.lofi-button.active svg {
  fill: #FFF961;
}

.lofi-button svg {
  fill: #aaaaaa;
}

.skip-icon {
  height: 50px;
}

.settings-icon {
  height: 50px;
}

.stat-icon {
  height: 40px;
  transform: rotate(15deg);
}

.cute-title {
  font-family: 'Itim';
}

.main-button-content {
  width: 70px;
}

.main-button-content2 {
  margin-bottom: -60px;
}

.main-button-content {
  margin-bottom: -70px;
}

.main-button-container {
  padding: 0 !important;
}

.play-icon {
  height: 60px;
}

.pause-icon {
  height: 60px;
}
</style>