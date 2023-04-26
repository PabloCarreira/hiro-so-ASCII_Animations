// Import the program runner
import {run} from './run.js'
import '../css/style.css';

let controls = document.querySelector('.controlsHolder')
controls.addEventListener('mouseover', () => {controls.style.opacity = '1'})
controls.addEventListener('mouseout', () => {controls.style.opacity = '.25'})

// Import a custom program; with at least a main() function exported
// import * as program from './wireframe_cube.js'
import * as program from './programs/demos/doom_flame_customized.js'
// const p = window.parent;

let fpsValue = 12;

let buttonFPS12 = document.querySelector('#buttonFPS12')
let buttonFPS24 = document.querySelector('#buttonFPS24')
let buttonFPS30 = document.querySelector('#buttonFPS30')

// Run settings can override the default- and program seetings.
// See the API for details.
const settings = {
  element: document.querySelector('#ASCII-Holder'),
  backgroundColor : 'transparent', 
  color : '#ff4800',
  fps: fpsValue
}

buttonFPS12.onclick = () => {
  window.location.replace("https://pablocarreira.github.io/hiro-so-ASCII_Animations/FPS12/");
};

buttonFPS24.onclick = () => {
  window.location.replace("https://pablocarreira.github.io/hiro-so-ASCII_Animations/FPS24/");
};


buttonFPS30.onclick = () => {
  window.location.replace("https://pablocarreira.github.io/hiro-so-ASCII_Animations/FPS30/");
};

// Boot (returns a promise)
run(program, settings).catch(function(e){
  console.warn(e.message)
  console.log(e.error)
})

