import { ref, onUnmounted, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const time = ref("25:00");
    ref(false);
    ref(true);
    const lofiPlaying = ref(false);
    const lofiAudio = ref(null);
    onUnmounted(() => {
      if (lofiAudio.value) {
        lofiAudio.value.removeEventListener("play", () => console.log("Audio playing"));
        lofiAudio.value.removeEventListener("pause", () => console.log("Audio paused"));
        lofiAudio.value.removeEventListener("error", (e) => console.error("Audio error", e));
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "device centered" }, _attrs))} data-v-21f3fbb9><div class="timer centered" data-v-21f3fbb9>${ssrInterpolate(time.value)}</div><div class="main-buttons" data-v-21f3fbb9><button data-v-21f3fbb9>Stat</button><button data-v-21f3fbb9>${ssrInterpolate(lofiPlaying.value ? "LoFi off" : "LoFi on")}</button><button data-v-21f3fbb9><svg class="play-button" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" data-v-21f3fbb9><polygon points="30,20 30,80 80,50" class="triangle" data-v-21f3fbb9></polygon></svg></button><button data-v-21f3fbb9>Skip</button><button data-v-21f3fbb9>Settings</button><audio src="https://ec3.yesstreaming.net:3755/stream" preload="none" data-v-21f3fbb9></audio></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-21f3fbb9"]]);

export { index as default };
//# sourceMappingURL=index-C_LhL1bR.mjs.map
