<template>

  <div class="device centered">
    <div class='device-content'>
      <div class="timer centered">{{ time }}</div>
      <div class='main-buttons'>
        <button @click="toggleLofi" :class="{ active: lofiPlaying }" class='main-button-container lofi-button'>
          <div class='main-button-content1'>
            <LofiIcon :active="lofiPlaying" class="svg-icon lofi-icon"/>
            <span class='cute-title lofi-title' v-if='lofiPlaying'>
              lofi off
            </span>
            <span class='cute-title lofi-title' v-else>
              lofi on
            </span>
          </div>
        </button>

        <button @click="skipTimer" class='main-button-container'>
          <div class='main-button-content2'>
            <SkipIcon />
            <span class='cute-title skip-title'>skip</span>
          </div>
        </button>

        <button @click="toggleTimer" :class="{ active: timerRunning }" class='main-button-container'>
          <div class='main-button-content'>
            <PlayIcon class='play-icon' v-if="!timerRunning" />
            <PauseIcon class='pause-icon' v-else />
          </div>
        </button>

       <button @click="openSettings" :class="{ active: settingsOpenModal }" class='main-button-container'>
        <div class='main-button-content2'>
          <SettingsIcon :active="settingsOpenModal" />
          <span class='cute-title settings-title'>settings</span>
        </div>
      </button>

        <button @click="showStat" :class="{ active: statOpenModal }" class='main-button-container'>
          <div class='main-button-content1'>
            <StatIcon :active="statOpenModal" />
            <span class='cute-title stat-title'>stat</span>
          </div>
        </button>
      </div>
      <audio ref="lofiAudio" src="https://ec3.yesstreaming.net:3755/stream" preload="none"></audio>
    </div>
  </div>

  <SettingsModal
    :show="settingsOpenModal"
    :initialSettings="settings"
    @close="closeSettings"
    @save="updateSettings"
  />
  <StatModal :show="statOpenModal" @close="closeStat" />
</template>

<script setup>
import usePomodoro from './script.js';
import SettingsModal from '@/components/SettingsModal.vue';
import StatModal from '@/components/StatModal.vue';
import StatIcon from '@/components/icons/StatIcon.vue'
import LofiIcon from '@/components/icons/LofiIcon.vue';
import PlayIcon from '@/components/icons/PlayIcon.vue';
import PauseIcon from '@/components/icons/PauseIcon.vue';
import SkipIcon from '@/components/icons/SkipIcon.vue';
import SettingsIcon from '@/components/icons/SettingsIcon.vue';

definePageMeta({
  layout: 'centered'
});

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
} = usePomodoro();
</script>

<style scoped>
@import './styles.css';
</style>