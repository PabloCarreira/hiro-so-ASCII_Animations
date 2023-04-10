import '../css/style.css';
import {sketch} from 'p5js-wrapper';

let sizes = {
    width:parent.innerWidth,
    height:parent.innerHeight,
}

console.log(sizes)

sketch.setup = function(){
  createCanvas (sizes.width, sizes.height);
}

sketch.draw= function(){
  background(100);
  fill(255, 0, 0);
  noStroke();
  rectMode(CENTER);
  rect(mouseX, mouseY, 50, 50);
}

sketch.windowResized = function(){
    sizes.width = parent.innerWidth;
    sizes.height = parent.innerHeight;
    sketch.resizeCanvas(sizes.width,sizes.height)
}

sketch.mousePressed = function(){
  console.log('here');
}