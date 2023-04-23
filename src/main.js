// Import the program runner
import {run} from './run.js'
import '../css/style.css';

let controls = document.querySelector('.controlsHolder')
let input = document.querySelector('#inputValue01')
    
controls.addEventListener('mouseover', () => {controls.style.opacity = '1'})
controls.addEventListener('mouseout', () => {controls.style.opacity = '.25'})

// Import a custom program; with at least a main() function exported
// import * as program from './wireframe_cube.js'
import * as program from './programs/demos/doom_flame_customized.js'
// const p = window.parent;

// Run settings can override the default- and program seetings.
// See the API for details.
const settings = {
  element: document.querySelector('#ASCII-Holder'),
  backgroundColor : 'transparent', 
  color : '#ff4800'
}

// Boot (returns a promise)
run(program, settings).catch(function(e){
  console.warn(e.message)
  console.log(e.error)
})

console.log(program)

