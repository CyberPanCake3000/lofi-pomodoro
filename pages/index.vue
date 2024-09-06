<template>
  <div class="device centered">
    <div class='device-content'>
      <div class="timer centered">{{ time }}</div>
      <div class='main-buttons'>
        <MainButton @click="toggleLofi" :active="lofiPlaying" class-name="lofi-button"
          content-class="main-button-content1" icon-name="lofi" :icon="LofiIcon" :icon-props="{ active: lofiPlaying }">
          {{ lofiPlaying ? 'lofi on' : 'lofi off' }}
        </MainButton>

        <MainButton @click="skipTimer" content-class="main-button-content2" icon-name="skip" :icon="SkipIcon">
          <span class='cute-title skip-title'>skip</span>
        </MainButton>

        <MainButton @click="toggleTimer" :active="timerRunning" content-class="main-button-content"
          :icon-name="timerRunning ? 'pause' : 'play'" :icon="timerRunning ? PauseIcon : PlayIcon"
          :show-title="false" />

        <MainButton @click="openSettings" :active="settingsOpenModal" content-class="main-button-content2"
          icon-name="settings" :icon="SettingsIcon" :icon-props="{ active: settingsOpenModal }">
          settings
        </MainButton>

        <MainButton @click="showStat" :active="statOpenModal" content-class="main-button-content1" icon-name="stat"
          :icon="StatIcon" :icon-props="{ active: statOpenModal }">
          stat
        </MainButton>
      </div>
      <audio ref="lofiAudio" :src="settings.streamLink" preload="none"></audio>
    </div>
  </div>

  <SettingsModal :show="settingsOpenModal" :initialSettings="settings" @close="closeSettings" @save="updateSettings" />
  <StatModal :show="statOpenModal" @close="closeStat" />
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
  defaultStreamLink,
} = usePomodoro();
</script>

<style scoped>
@import '@/assets/styles/pages/index.css';
</style>