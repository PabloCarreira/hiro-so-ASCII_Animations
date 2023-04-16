import '../css/style.css';

let canvasHolder = document.querySelector("#canvasHolder")
console.log(canvasHolder)
console.log(p5)

let s = (p5) => {    
  let sizes = {
    width:parent.innerWidth/4,
    height:parent.innerHeight/4,
  }

  let buffer1;
  let buffer2;
  let cooling;

  let ystart = 0.0;

  p5.setup = () => {
    p5.setAttributes('willReadFrequently', true);
    p5.createCanvas (sizes.width, sizes.height);
    buffer1 = p5.createGraphics(sizes.width, sizes.height);
    buffer2 = p5.createGraphics(sizes.width, sizes.height);
    cooling = p5.createImage(sizes.width, sizes.height)
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
        let n = p5.noise(xoff, yoff);
        let bright = p5.pow(n, 3) * 255;
  
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

  
  p5.draw = () => {
    p5.background(0);
    fire(1);
    if (p5.mouseIsPressed) {
      buffer1.fill(255);
      buffer1.noStroke();
      buffer1.ellipse(p5.mouseX, p5.mouseY, 10, 10);
    }
    cool();
    
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
  
    p5.image(buffer2, 0, 0);
    p5.image(cooling, sizes.width, 0);

  }

  p5.windowResized = function(){
    sizes.width = parent.innerWidth/4;
    sizes.height = parent.innerHeight/4;
    p5.resizeCanvas(sizes.width,sizes.height)
  }
}

new p5(s, canvasHolder);

// context = canvas.getContext('2d' [, { [ alpha: true ] [, desynchronized: false ] [, colorSpace: 'srgb'] [, willReadFrequently: false ]} ])