import { run } from './run.js';
import '../css/style.css';

import * as program from './programs/demos/doom_flame_hiro.js';

let fpsValue = 12;
const settings = {
  element: document.querySelector('#ASCII-Holder'),
  backgroundColor: 'transparent',
  color: '#ff4800',
  fps: fpsValue,
};



// Boot (returns a promise)
run(program, settings).catch(function (e) {
  console.warn(e.message);
  console.log(e.error);
});
