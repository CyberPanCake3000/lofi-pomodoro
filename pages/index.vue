<template>
  <div class="device centered">
    <div class='device-content'>
      <div class="timer centered">{{ state.time }}</div>
      <div class='main-buttons'>
        <MainButton @click="toggleRadio" :active="state.radioPlaying" class-name="lofi-button"
          content-class="main-button-content1" icon-name="lofi" :icon="LofiIcon" :icon-props="{ active: state.radioPlaying }">
          {{ state.radioPlaying ? 'radio on' : 'radio off' }}
        </MainButton>

        <MainButton @click="skipTimer" content-class="main-button-content2" icon-name="skip" :icon="SkipIcon">
          <span class='cute-title skip-title'>skip</span>
        </MainButton>

        <MainButton @click="toggleTimer" :active="state.timerRunning" content-class="main-button-content"
          :icon-name="state.timerRunning ? 'pause' : 'play'" :icon="state.timerRunning ? PauseIcon : PlayIcon"
          :show-title="false" />

        <MainButton @click="openSettings" :active="state.settingsOpenModal" content-class="main-button-content2"
          icon-name="settings" :icon="SettingsIcon" :icon-props="{ active: state.settingsOpenModal }">
          settings
        </MainButton>

        <MainButton @click="showStat" :active="state.statOpenModal" content-class="main-button-content1" icon-name="stat"
          :icon="StatIcon" :icon-props="{ active: state.statOpenModal }">
          stat
        </MainButton>
      </div>
      <audio ref="radioAudio" :src="settings.streamLink" preload="none"></audio>
    </div>
  </div>

  <SettingsModal :show="state.settingsOpenModal" :initialSettings="settings" @close="closeSettings" @save="updateSettings" />
  <StatModal :show="state.statOpenModal" @close="closeStat" />
</template>

<script setup>
import usePomodoro from '@/composables/usePomodoro.js';
import SettingsModal from '@/components/SettingsModal.vue';
import StatModal from '@/components/StatModal.vue';
import StatIcon from '@/components/icons/StatIcon.vue'
import LofiIcon from '@/components/icons/LofiIcon.vue';
import PlayIcon from '@/components/icons/PlayIcon.vue';
import PauseIcon from '@/components/icons/PauseIcon.vue';
import SkipIcon from '@/components/icons/SkipIcon.vue';
import SettingsIcon from '@/components/icons/SettingsIcon.vue';
import MainButton from '@/components/MainButton.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const {
  state,
  settings,
  toggleRadio,
  toggleTimer,
  skipTimer,
  openSettings,
  closeSettings,
  updateSettings,
  showStat,
  closeStat,
  DEFAULT_STREAM_LINK,
  restartRadioStream,
  updateRadioPlayback,
  setRadioVolume,
  setBellVolume,
} = usePomodoro();
</script>

<style scoped>
@import '@/assets/styles/pages/index.css';
</style>