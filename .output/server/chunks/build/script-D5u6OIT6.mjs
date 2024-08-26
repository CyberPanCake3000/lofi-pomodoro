import { ref, onUnmounted } from 'vue';

ref("25:00");
ref(false);
ref(true);
ref(false);
const lofiAudio = ref(null);
onUnmounted(() => {
  if (lofiAudio.value) {
    lofiAudio.value.removeEventListener("play", () => console.log("Audio playing"));
    lofiAudio.value.removeEventListener("pause", () => console.log("Audio paused"));
    lofiAudio.value.removeEventListener("error", (e) => console.error("Audio error", e));
  }
});
//# sourceMappingURL=script-D5u6OIT6.mjs.map
