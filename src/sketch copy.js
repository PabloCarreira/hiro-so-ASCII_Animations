import '../css/style.css';
import * as p5 from './p5.js';

let canvas = document.querySelector("#mainCanvas")
console.log(canvas)

let s = (sketch) => {    

  let sizes = {
    width:parent.innerWidth,
    height:parent.innerHeight,
}

let buffer1;
let buffer2;
let cooling;

let ystart = 0.0;

sketch.setup = function(){
    setAttributes('willReadFrequently', true);
    pixelDensity(1)
    createCanvas (sizes.width, sizes.height);
    buffer1 = createGraphics(sizes.width, sizes.height);
    buffer2 = createGraphics(sizes.width, sizes.height);
    cooling = createImage(sizes.width, sizes.height)

}

function cool() {
    cooling.loadPixels();
    let xoff = 0.0; // Start xoff at 0
    let increment = 0.02;
    // For every x,y coordinate in a 2D space, calculate a noise value and produce a brightness value
    for (let x = 0; x < sizes.width; x++) {
      xoff += increment; // Increment xoff
      let yoff = ystart; // For every xoff, start yoff at 0
      for (let y = 0; y < sizes.height; y++) {
        yoff += increment; // Increment yoff
  
        // Calculate noise and scale by 255
        let n = noise(xoff, yoff);
        let bright = pow(n, 3) * 255;
  
        // Try using this line instead
        //float bright = random(0,255);
  
        // Set each pixel onscreen to a grayscale value
        let index = (x + y * sizes.width) * 4;
        cooling.pixels[index] = bright;
        cooling.pixels[index + 1] = bright;
        cooling.pixels[index + 2] = bright;
        cooling.pixels[index + 3] = 255;
      }
    }
  
    cooling.updatePixels();
    ystart += increment;
  }

  function fire(rows) {
    buffer1.loadPixels();
    for (let x = 0; x < sizes.width; x++) {
      for (let j = 0; j < rows; j++) {
        let y = sizes.height - (j + 1);
        let index = (x + y * sizes.width) * 4;
        buffer1.pixels[index] = 255;
        buffer1.pixels[index + 1] = 255;
        buffer1.pixels[index + 2] = 255;
        buffer1.pixels[index + 3] = 255;
      }
    }
    buffer1.updatePixels();
  }

  
sketch.draw= function(){
    fire(1);
    if (mouseIsPressed) {
      buffer1.fill(255);
      buffer1.noStroke();
      buffer1.ellipse(mouseX, mouseY, 10, 10);
    }
    cool();
    background(0);
    buffer1.loadPixels();
    buffer2.loadPixels();
    for (let x = 1; x < sizes.width - 1; x++) {
      for (let y = 1; y < sizes.height - 1; y++) {
        let index0 = (x + y * sizes.width) * 4; // x, y
        let index1 = (x + 1 + y * sizes.width) * 4; // (x + 1), y
        let index2 = (x - 1 + y * sizes.width) * 4; // (x - 1), y
        let index3 = (x + (y + 1) * sizes.width) * 4; // x, (y + 1)
        let index4 = (x + (y - 1) * sizes.width) * 4; // x, (y - 1)
  
        // Because we are using only gray colors, the value of the color
        // components are the same, and we can use that as brightness.
        let c1 = buffer1.pixels[index1];
        let c2 = buffer1.pixels[index2];
        let c3 = buffer1.pixels[index3];
        let c4 = buffer1.pixels[index4];
  
        let c5 = cooling.pixels[index0];
        let newC = c1 + c2 + c3 + c4;
        newC = newC * 0.25 - c5;
  
        buffer2.pixels[index4] = newC;
        buffer2.pixels[index4 + 1] = newC;
        buffer2.pixels[index4 + 2] = newC;
        buffer2.pixels[index4 + 3] = 255;
      }
    }
    buffer2.updatePixels();
  
    // Swap
    let temp = buffer1;
    buffer1 = buffer2;
    buffer2 = temp;
  
    image(buffer2, 0, 0);
    image(cooling, sizes.width, 0);

}

sketch.windowResized = function(){
    sizes.width = parent.innerWidth;
    sizes.height = parent.innerHeight;
    sketch.resizeCanvas(sizes.width,sizes.height)
}

sketch.mousePressed = function(){
  console.log('here');
}
}

const P5 = new p5(s, canvas);

// context = canvas.getContext('2d' [, { [ alpha: true ] [, desynchronized: false ] [, colorSpace: 'srgb'] [, willReadFrequently: false ]} ])
