import { a as buildAssetsURL } from '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import 'node:fs';
import 'node:url';
import 'devalue';
import 'vue/server-renderer';
import '@unhead/ssr';
import 'vue';
import 'unhead';
import '@unhead/shared';

const main = "body,html{height:100%;margin:0;padding:0}body{align-items:center;background:#f0f0f0;display:flex;font-family:Arial,sans-serif;justify-content:center}#__nuxt,.centered-layout{height:100%;width:100%}.centered-layout{align-items:center;display:flex;justify-content:center}button{background-color:transparent;border:none;cursor:pointer}";

const fonts = "@font-face{font-family:DS-DIGI;font-style:normal;font-weight:400;src:url(" + buildAssetsURL("DS-DIGI.dG6DdXEc.TTF") + ') format("truetype")}';

const entryStyles_C8q5Vb9 = [main, fonts];

export { entryStyles_C8q5Vb9 as default };
//# sourceMappingURL=entry-styles.C-8q5Vb9.mjs.map
