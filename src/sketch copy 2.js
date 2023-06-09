import '../css/style.css';

let canvasHolder = document.querySelector("#canvasHolder")
console.log(canvasHolder)
console.log(p5)

let s = (p5) => {    
  let sizes = {
    width:parent.innerWidth,
    height:parent.innerHeight,
  }
  console.log(sizes)
  p5.setup = () => {
    p5.setAttributes('willReadFrequently', true);
    p5.createCanvas(sizes.width, sizes.height)
    p5.frameRate(5)
  }

  p5.draw = () => {
    p5.background('blue')
    p5.circle(30,30,30)



  }

  p5.windowResized = function(){
    sizes.width = parent.innerWidth;
    sizes.height = parent.innerHeight;
    p5.resizeCanvas(sizes.width,sizes.height)
}
}

new p5(s, canvasHolder);

// context = canvas.getContext('2d' [, { [ alpha: true ] [, desynchronized: false ] [, colorSpace: 'srgb'] [, willReadFrequently: false ]} ])