// Import the program runner
import {run} from './run.js'
    
// Import a custom program; with at least a main() function exported
import * as program from './doom_flame.js'

// Run settings can override the default- and program seetings.
// See the API for details.
const settings = {
  fps : 30,
  element : document.querySelector('pre')
}

// Boot (returns a promise)
run(program, settings).catch(function(e){
  console.warn(e.message)
  console.log(e.error)
})