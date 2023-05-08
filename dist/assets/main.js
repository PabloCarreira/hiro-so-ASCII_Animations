var textRenderer = {
  preferredElementNodeName: "PRE",
  render
};
const backBuffer = [];
let cols$1, rows$1;
function render(context, buffer) {
  const element = context.settings.element;
  if (context.rows != rows$1 || context.cols != cols$1) {
    cols$1 = context.cols;
    rows$1 = context.rows;
    backBuffer.length = 0;
  }
  while (element.childElementCount < rows$1) {
    const span = document.createElement("span");
    span.style.display = "block";
    element.appendChild(span);
  }
  while (element.childElementCount > rows$1) {
    element.removeChild(element.lastChild);
  }
  for (let j = 0; j < rows$1; j++) {
    const offs = j * cols$1;
    let rowNeedsUpdate = false;
    for (let i = 0; i < cols$1; i++) {
      const idx = i + offs;
      const newCell = buffer[idx];
      const oldCell = backBuffer[idx];
      if (!isSameCell(newCell, oldCell)) {
        rowNeedsUpdate = true;
        backBuffer[idx] = { ...newCell };
      }
    }
    if (rowNeedsUpdate == false)
      continue;
    let html = "";
    let prevCell = {};
    let tagIsOpen = false;
    for (let i = 0; i < cols$1; i++) {
      const currCell = buffer[i + offs];
      if (currCell.beginHTML) {
        if (tagIsOpen) {
          html += "</span>";
          prevCell = {};
          tagIsOpen = false;
        }
        html += currCell.beginHTML;
      }
      if (!isSameCellStyle(currCell, prevCell)) {
        if (tagIsOpen)
          html += "</span>";
        const c = currCell.color === context.settings.color ? null : currCell.color;
        const b = currCell.backgroundColor === context.settings.backgroundColor ? null : currCell.backgroundColor;
        const w = currCell.fontWeight === context.settings.fontWeight ? null : currCell.fontWeight;
        let css = "";
        if (c)
          css += "color:" + c + ";";
        if (b)
          css += "background:" + b + ";";
        if (w)
          css += "font-weight:" + w + ";";
        if (css)
          css = ' style="' + css + '"';
        html += "<span" + css + ">";
        tagIsOpen = true;
      }
      html += currCell.char;
      prevCell = currCell;
      if (currCell.endHTML) {
        if (tagIsOpen) {
          html += "</span>";
          prevCell = {};
          tagIsOpen = false;
        }
        html += currCell.endHTML;
      }
    }
    if (tagIsOpen)
      html += "</span>";
    element.childNodes[j].innerHTML = html;
  }
}
function isSameCell(cellA, cellB) {
  if (typeof cellA != "object")
    return false;
  if (typeof cellB != "object")
    return false;
  if (cellA.char !== cellB.char)
    return false;
  if (cellA.fontWeight !== cellB.fontWeight)
    return false;
  if (cellA.color !== cellB.color)
    return false;
  if (cellA.backgroundColor !== cellB.backgroundColor)
    return false;
  return true;
}
function isSameCellStyle(cellA, cellB) {
  if (cellA.fontWeight !== cellB.fontWeight)
    return false;
  if (cellA.color !== cellB.color)
    return false;
  if (cellA.backgroundColor !== cellB.backgroundColor)
    return false;
  return true;
}
class FPS {
  constructor() {
    this.frames = 0;
    this.ptime = 0;
    this.fps = 0;
  }
  update(time) {
    this.frames++;
    if (time >= this.ptime + 1e3) {
      this.fps = this.frames * 1e3 / (time - this.ptime);
      this.ptime = time;
      this.frames = 0;
    }
    return this.fps;
  }
}
var storage = {
  store: function(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
      return true;
    } catch (e) {
      return false;
    }
  },
  restore: function(key, target = {}) {
    const obj = JSON.parse(localStorage.getItem(key));
    Object.assign(target, obj);
    return target;
  },
  clear: function(key) {
    localStorage.removeItem(key);
  }
};
const renderers = {
  text: textRenderer
};
const defaultSettings = {
  element: null,
  cols: 0,
  rows: 0,
  once: false,
  fps: 30,
  renderer: "text",
  allowSelect: false,
  restoreState: false
};
const CSSStyles = [
  "backgroundColor",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "textAlign"
];
function run(program2, runSettings, userData = {}) {
  return new Promise(function(resolve) {
    let pause = false;
    const settings2 = {
      ...defaultSettings,
      ...runSettings,
      ...program2.settings
    };
    const state = {
      time: 0,
      frame: 0,
      cycle: 0
    };
    const LOCAL_STORAGE_KEY_STATE = "currentState";
    if (settings2.restoreState) {
      storage.restore(LOCAL_STORAGE_KEY_STATE, state);
      state.cycle++;
    }
    let renderer;
    if (!settings2.element) {
      renderer = renderers[settings2.renderer] || renderers["text"];
      settings2.element = document.createElement(
        renderer.preferredElementNodeName
      );
      document.body.appendChild(settings2.element);
    } else {
      if (settings2.renderer == "canvas") {
        if (settings2.element.nodeName == "CANVAS") {
          renderer = renderers[settings2.renderer];
        } else {
          console.warn("This renderer expects a canvas target element.");
        }
      } else {
        if (settings2.element.nodeName != "CANVAS") {
          renderer = renderers[settings2.renderer];
        } else {
          console.warn("This renderer expects a text target element.");
        }
      }
    }
    for (const s of CSSStyles) {
      if (settings2[s])
        settings2.element.style[s] = settings2[s];
    }
    const eventQueue = [];
    const pointer = {
      x: 0,
      y: 0,
      pressed: false,
      px: 0,
      py: 0,
      ppressed: false
    };
    settings2.element.addEventListener("pointermove", (e) => {
      const rect = settings2.element.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      eventQueue.push("pointerMove");
    });
    settings2.element.addEventListener("pointerdown", (e) => {
      pointer.pressed = true;
      eventQueue.push("pointerDown");
    });
    settings2.element.addEventListener("pointerup", (e) => {
      pointer.pressed = false;
      eventQueue.push("pointerUp");
    });
    const touchHandler = (e) => {
      const rect = settings2.element.getBoundingClientRect();
      pointer.x = e.touches[0].clientX - rect.left;
      pointer.y = e.touches[0].clientY - rect.top;
      eventQueue.push("pointerMove");
    };
    const pauseHandler = (e) => {
      pause = !pause;
      if (!pause) {
        requestAnimationFrame(loop);
      }
    };
    settings2.element.addEventListener("touchmove", touchHandler);
    settings2.element.addEventListener("touchstart", touchHandler);
    settings2.element.addEventListener("touchstart", touchHandler);
    settings2.element.addEventListener("pause", pauseHandler);
    settings2.element.style.fontStrech = "normal";
    if (!settings2.allowSelect)
      disableSelect(settings2.element);
    document.fonts.ready.then((e) => {
      let count = 3;
      (function __run_thrice__() {
        if (--count > 0) {
          requestAnimationFrame(__run_thrice__);
        } else {
          boot();
        }
      })();
    });
    const fps = new FPS();
    const EMPTY_CELL = " ";
    const DEFAULT_CELL_STYLE = Object.freeze({
      color: settings2.color,
      backgroundColor: settings2.backgroundColor,
      fontWeight: settings2.fontWeight
    });
    const buffer = [];
    let metrics;
    function boot() {
      metrics = calcMetrics(settings2.element);
      const context = getContext(state, settings2, metrics, fps);
      if (typeof program2.boot == "function") {
        program2.boot(context, buffer, userData);
      }
      requestAnimationFrame(loop);
    }
    let timeSample = 0;
    const interval = 1e3 / settings2.fps;
    const timeOffset = state.time;
    let cols2, rows2;
    function loop(t) {
      if (!pause) {
        const delta = t - timeSample;
        if (delta < interval) {
          if (!settings2.once)
            requestAnimationFrame(loop);
          return;
        }
        const context = getContext(state, settings2, metrics, fps);
        fps.update(t);
        timeSample = t - delta % interval;
        state.time = t + timeOffset;
        state.frame++;
        storage.store(LOCAL_STORAGE_KEY_STATE, state);
        const cursor = {
          x: Math.min(context.cols - 1, pointer.x / metrics.cellWidth),
          y: Math.min(context.rows - 1, pointer.y / metrics.lineHeight),
          pressed: pointer.pressed,
          p: {
            x: pointer.px / metrics.cellWidth,
            y: pointer.py / metrics.lineHeight,
            pressed: pointer.ppressed
          }
        };
        pointer.px = pointer.x;
        pointer.py = pointer.y;
        pointer.ppressed = pointer.pressed;
        if (cols2 != context.cols || rows2 != context.rows) {
          cols2 = context.cols;
          rows2 = context.rows;
          buffer.length = context.cols * context.rows;
          for (let i = 0; i < buffer.length; i++) {
            buffer[i] = { ...DEFAULT_CELL_STYLE, char: EMPTY_CELL };
          }
        }
        if (typeof program2.pre == "function") {
          program2.pre(context, cursor, buffer, userData);
        }
        if (typeof program2.main == "function") {
          for (let j = 0; j < context.rows; j++) {
            const offs = j * context.cols;
            for (let i = 0; i < context.cols; i++) {
              const idx = i + offs;
              const out = program2.main(
                { x: i, y: j, index: idx },
                context,
                cursor,
                buffer,
                userData
              );
              if (typeof out == "object" && out !== null) {
                buffer[idx] = { ...buffer[idx], ...out };
              } else {
                buffer[idx] = { ...buffer[idx], char: out };
              }
              if (!Boolean(buffer[idx].char) && buffer[idx].char !== 0) {
                buffer[idx].char = EMPTY_CELL;
              }
            }
          }
        }
        if (typeof program2.post == "function") {
          program2.post(context, cursor, buffer, userData);
        }
        renderer.render(context, buffer, settings2);
        while (eventQueue.length > 0) {
          const type = eventQueue.shift();
          if (type && typeof program2[type] == "function") {
            program2[type](context, cursor, buffer);
          }
        }
        if (!settings2.once)
          requestAnimationFrame(loop);
        resolve(context);
      }
    }
  });
}
function getContext(state, settings2, metrics, fps) {
  const rect = settings2.element.getBoundingClientRect();
  const cols2 = settings2.cols || Math.floor(rect.width / metrics.cellWidth);
  const rows2 = settings2.rows || Math.floor(rect.height / metrics.lineHeight);
  return Object.freeze({
    frame: state.frame,
    time: state.time,
    cols: cols2,
    rows: rows2,
    metrics,
    width: rect.width,
    height: rect.height,
    settings: settings2,
    runtime: Object.freeze({
      cycle: state.cycle,
      fps: fps.fps
    })
  });
}
function disableSelect(el) {
  el.style.userSelect = "none";
  el.style.webkitUserSelect = "none";
  el.style.mozUserSelect = "none";
  el.dataset.selectionEnabled = "false";
}
function calcMetrics(el) {
  const style2 = getComputedStyle(el);
  const fontFamily = style2.getPropertyValue("font-family");
  const fontSize = parseFloat(style2.getPropertyValue("font-size"));
  const lineHeight = parseFloat(style2.getPropertyValue("line-height"));
  let cellWidth;
  if (el.nodeName == "CANVAS") {
    const ctx = el.getContext("2d");
    ctx.font = fontSize + "px " + fontFamily;
    cellWidth = ctx.measureText("".padEnd(50, "X")).width / 50;
  } else {
    const span = document.createElement("span");
    el.appendChild(span);
    span.innerHTML = "".padEnd(50, "X");
    cellWidth = span.getBoundingClientRect().width / 50;
    el.removeChild(span);
  }
  const metrics = {
    aspect: cellWidth / lineHeight,
    cellWidth,
    lineHeight,
    fontFamily,
    fontSize,
    _update: function() {
      const tmp = calcMetrics(el);
      for (var k in tmp) {
        if (typeof tmp[k] == "number" || typeof tmp[k] == "string") {
          m[k] = tmp[k];
        }
      }
    }
  };
  return metrics;
}
var style = "";
function map(v, inA, inB, outA, outB) {
  return outA + (outB - outA) * ((v - inA) / (inB - inA));
}
function clamp(v, min2, max2) {
  if (v < min2)
    return min2;
  if (v > max2)
    return max2;
  return v;
}
function mix(v1, v2, a) {
  return v1 * (1 - a) + v2 * a;
}
function smoothstep(edge0, edge1, t) {
  const x = clamp((t - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}
let programValues = { value01: 12 };
let animationOff = false;
const settings$1 = {};
const { min, max, sin, floor } = Math;
let flame = ' \uFE19\xB7://|*#"\u20BF_hiro#+\u20BF';
let cols, rows;
const noise = valueNoise();
const data = [];
buttonPause.onclick = () => {
  animationOff = !animationOff;
  if (animationOff) {
    document.querySelector("#buttonPause").value = "ASCII:[OFF]";
    gsap.to(programValues, {
      duration: 0.5,
      value01: 0,
      ease: "power4.out"
    });
    document.querySelector("#ASCII-Holder").classList.toggle("deactive");
    setTimeout(callPause, 500);
  } else if (!animationOff) {
    document.querySelector("#buttonPause").value = "ASCII:[ON]";
    document.querySelector("#ASCII-Holder").classList.toggle("deactive");
    document.querySelector("#ASCII-Holder").dispatchEvent(new Event("pause"));
    gsap.to(programValues, {
      duration: 0.5,
      value01: 12,
      ease: "power4.out"
    });
  }
};
function callPause() {
  console.log("PAUSE FUNCTIONA CALLED");
  document.querySelector("#ASCII-Holder").dispatchEvent(new Event("pause"));
}
function pre(context, cursor, buffer) {
  if (cols != context.cols || rows != context.rows) {
    cols = context.cols;
    rows = context.rows;
    data.length = cols * rows;
    data.fill(0);
  }
  if (!cursor.pressed) {
    const t = context.time * 15e-4;
    const last = cols * (rows - 1);
    for (let i = 0; i < cols; i++) {
      const val = floor(map(noise(i * 0.05, t), 0, 1, 5, programValues.value01));
      data[last + i] = min(val, data[last + i] + 2);
    }
  } else {
    const cx = floor(cursor.x);
    const cy = floor(cursor.y);
    data[cx + cy * cols] = rndi(5, 50);
  }
  for (let i = 0; i < data.length; i++) {
    const row = floor(i / cols);
    const col = i % cols;
    const dest = row * cols + clamp(col + rndi(-1, 1), 0, cols - 1);
    const src = min(rows - 1, row + 1) * cols + col;
    data[dest] = max(0, data[src] - rndi(0, 2));
  }
}
function main(coord, context, cursor, buffer) {
  const u = data[coord.index];
  if (u === 0)
    return;
  return {
    char: flame[clamp(u, 0, flame.length - 1)],
    fontWeight: u > 20 ? 700 : 100
  };
}
function rndi(a, b = 0) {
  if (a > b)
    [a, b] = [b, a];
  return Math.floor(a + Math.random() * (b - a + 1));
}
function valueNoise() {
  const tableSize = 256;
  const r = new Array(tableSize);
  const permutationTable = new Array(tableSize * 2);
  for (let k = 0; k < tableSize; k++) {
    r[k] = Math.random();
    permutationTable[k] = k;
  }
  for (let k = 0; k < tableSize; k++) {
    const i = Math.floor(Math.random() * tableSize);
    [permutationTable[k], permutationTable[i]] = [permutationTable[i], permutationTable[k]];
    permutationTable[k + tableSize] = permutationTable[k];
  }
  return function(px, py) {
    const xi = Math.floor(px);
    const yi = Math.floor(py);
    const tx = px - xi;
    const ty = py - yi;
    const rx0 = xi % tableSize;
    const rx1 = (rx0 + 1) % tableSize;
    const ry0 = yi % tableSize;
    const ry1 = (ry0 + 1) % tableSize;
    const c00 = r[permutationTable[permutationTable[rx0] + ry0]];
    const c10 = r[permutationTable[permutationTable[rx1] + ry0]];
    const c01 = r[permutationTable[permutationTable[rx0] + ry1]];
    const c11 = r[permutationTable[permutationTable[rx1] + ry1]];
    const sx = smoothstep(0, 1, tx);
    const sy = smoothstep(0, 1, ty);
    const nx0 = mix(c00, c10, sx);
    const nx1 = mix(c01, c11, sx);
    return mix(nx0, nx1, sy);
  };
}
function post(context, cursor, buffer) {
}
var program = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  settings: settings$1,
  pre,
  main,
  post
}, Symbol.toStringTag, { value: "Module" }));
let fpsValue = 12;
const settings = {
  element: document.querySelector("#ASCII-Holder"),
  backgroundColor: "transparent",
  color: "#ff4800",
  fps: fpsValue
};
run(program, settings).catch(function(e) {
  console.warn(e.message);
  console.log(e.error);
});
