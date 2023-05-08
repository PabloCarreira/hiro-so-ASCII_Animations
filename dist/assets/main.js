const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var textRenderer = {
  preferredElementNodeName: "PRE",
  render: render$1
};
const backBuffer = [];
let cols$1, rows$1;
function render$1(context, buffer) {
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
var canvasRenderer = {
  preferredElementNodeName: "CANVAS",
  render
};
function render(context, buffer) {
  const canvas = context.settings.element;
  const scale = devicePixelRatio;
  const c = context.cols;
  const r = context.rows;
  const m2 = context.metrics;
  const cw = m2.cellWidth;
  const ch = Math.round(m2.lineHeight);
  const settings2 = context.settings;
  if (settings2.canvasSize) {
    canvas.width = settings2.canvasSize.width * scale;
    canvas.height = settings2.canvasSize.height * scale;
    canvas.style.width = settings2.canvasSize.width + "px";
    canvas.style.height = settings2.canvasSize.height + "px";
  } else {
    canvas.width = context.width * scale;
    canvas.height = context.height * scale;
  }
  const ff = " " + m2.fontSize + "px " + m2.fontFamily;
  const bg = settings2 && settings2.backgroundColor ? settings2.backgroundColor : "white";
  const fg = settings2 && settings2.color ? settings2.color : "black";
  const fontWeight = settings2 && settings2.fontWeight ? settings2.color : "400";
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.fillStyle = fg;
  ctx.textBaseline = "top";
  if (settings2.canvasOffset) {
    const offs = settings2.canvasOffset;
    const ox = Math.round(offs.x == "auto" ? (canvas.width / scale - c * cw) / 2 : offs.x);
    const oy = Math.round(offs.y == "auto" ? (canvas.height / scale - r * ch) / 2 : offs.y);
    ctx.translate(ox, oy);
  }
  if (settings2.textAlign == "center") {
    for (let j = 0; j < r; j++) {
      const offs = j * c;
      const widths = [];
      let totalWidth = 0;
      for (let i = 0; i < c; i++) {
        const cell = buffer[offs + i];
        ctx.font = (cell.fontWeight || fontWeight) + ff;
        const w = ctx.measureText(cell.char).width;
        totalWidth += w;
        widths[i] = w;
      }
      let ox = (canvas.width / scale - totalWidth) * 0.5;
      const y = j * ch;
      for (let i = 0; i < c; i++) {
        const cell = buffer[offs + i];
        const x = ox;
        if (cell.backgroundColor && cell.backgroundColor != bg) {
          ctx.fillStyle = cell.backgroundColor || bg;
          ctx.fillRect(Math.round(x), y, Math.ceil(widths[i]), ch);
        }
        ctx.font = (cell.fontWeight || fontWeight) + ff;
        ctx.fillStyle = cell.color || fg;
        ctx.fillText(cell.char, ox, y);
        ox += widths[i];
      }
    }
  } else {
    for (let j = 0; j < r; j++) {
      for (let i = 0; i < c; i++) {
        const cell = buffer[j * c + i];
        const x = i * cw;
        const y = j * ch;
        if (cell.backgroundColor && cell.backgroundColor != bg) {
          ctx.fillStyle = cell.backgroundColor || bg;
          ctx.fillRect(Math.round(x), y, Math.ceil(cw), ch);
        }
        ctx.font = (cell.fontWeight || fontWeight) + ff;
        ctx.fillStyle = cell.color || fg;
        ctx.fillText(cell.char, x, y);
      }
    }
  }
  ctx.restore();
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
  canvas: canvasRenderer,
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
function rgb2css(rgb) {
  if (rgb.a === void 0 || rgb.a === 1) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }
  return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
}
function rgb2hex(rgb) {
  let r = Math.round(rgb.r).toString(16).padStart(2, "0");
  let g = Math.round(rgb.g).toString(16).padStart(2, "0");
  let b = Math.round(rgb.b).toString(16).padStart(2, "0");
  if (rgb.a === void 0) {
    return "#" + r + g + b;
  }
  let a = Math.round(rgb.a * 255).toString(16).padStart(2, "0");
  return "#" + r + g + b + a;
}
function rgb2gray(rgb) {
  return Math.round(rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 255;
}
function int2rgb(int) {
  return {
    a: 1,
    r: int >> 16 & 255,
    g: int >> 8 & 255,
    b: int & 255
  };
}
const _C64 = [
  { int: 0, name: "black" },
  { int: 16777215, name: "white" },
  { int: 8912896, name: "red" },
  { int: 11206638, name: "cyan" },
  { int: 13386956, name: "violet" },
  { int: 52309, name: "green" },
  { int: 170, name: "blue" },
  { int: 15658615, name: "yellow" },
  { int: 14518357, name: "orange" },
  { int: 6702080, name: "brown" },
  { int: 16742263, name: "lightred" },
  { int: 3355443, name: "darkgrey" },
  { int: 7829367, name: "grey" },
  { int: 11206502, name: "lightgreen" },
  { int: 35071, name: "lightblue" },
  { int: 12303291, name: "lightgrey" }
];
const _CGA = [
  { int: 0, name: "black" },
  { int: 170, name: "blue" },
  { int: 43520, name: "green" },
  { int: 43690, name: "cyan" },
  { int: 11141120, name: "red" },
  { int: 11141290, name: "magenta" },
  { int: 11162880, name: "brown" },
  { int: 11184810, name: "lightgray" },
  { int: 5592405, name: "darkgray" },
  { int: 5592575, name: "lightblue" },
  { int: 5635925, name: "lightgreen" },
  { int: 5636095, name: "lightcyan" },
  { int: 16733525, name: "lightred" },
  { int: 16733695, name: "lightmagenta" },
  { int: 16777045, name: "yellow" },
  { int: 16777215, name: "white" }
];
const _CSS1 = [
  { int: 0, name: "black" },
  { int: 12632256, name: "silver" },
  { int: 8421504, name: "gray" },
  { int: 16777215, name: "white" },
  { int: 8388608, name: "maroon" },
  { int: 16711680, name: "red" },
  { int: 8388736, name: "purple" },
  { int: 16711935, name: "fuchsia" },
  { int: 32768, name: "green" },
  { int: 65280, name: "lime" },
  { int: 8421376, name: "olive" },
  { int: 16776960, name: "yellow" },
  { int: 128, name: "navy" },
  { int: 255, name: "blue" },
  { int: 32896, name: "teal" },
  { int: 65535, name: "aqua" }
];
const _CSS2 = [
  ..._CSS1,
  { int: 16753920, name: "orange" }
];
const _CSS3 = [
  ..._CSS2,
  { int: 15792383, name: "aliceblue" },
  { int: 16444375, name: "antiquewhite" },
  { int: 8388564, name: "aquamarine" },
  { int: 15794175, name: "azure" },
  { int: 16119260, name: "beige" },
  { int: 16770244, name: "bisque" },
  { int: 16772045, name: "blanchedalmond" },
  { int: 9055202, name: "blueviolet" },
  { int: 10824234, name: "brown" },
  { int: 14596231, name: "burlywood" },
  { int: 6266528, name: "cadetblue" },
  { int: 8388352, name: "chartreuse" },
  { int: 13789470, name: "chocolate" },
  { int: 16744272, name: "coral" },
  { int: 6591981, name: "cornflowerblue" },
  { int: 16775388, name: "cornsilk" },
  { int: 14423100, name: "crimson" },
  { int: 65535, name: "aqua" },
  { int: 139, name: "darkblue" },
  { int: 35723, name: "darkcyan" },
  { int: 12092939, name: "darkgoldenrod" },
  { int: 11119017, name: "darkgray" },
  { int: 25600, name: "darkgreen" },
  { int: 11119017, name: "darkgrey" },
  { int: 12433259, name: "darkkhaki" },
  { int: 9109643, name: "darkmagenta" },
  { int: 5597999, name: "darkolivegreen" },
  { int: 16747520, name: "darkorange" },
  { int: 10040012, name: "darkorchid" },
  { int: 9109504, name: "darkred" },
  { int: 15308410, name: "darksalmon" },
  { int: 9419919, name: "darkseagreen" },
  { int: 4734347, name: "darkslateblue" },
  { int: 3100495, name: "darkslategray" },
  { int: 3100495, name: "darkslategrey" },
  { int: 52945, name: "darkturquoise" },
  { int: 9699539, name: "darkviolet" },
  { int: 16716947, name: "deeppink" },
  { int: 49151, name: "deepskyblue" },
  { int: 6908265, name: "dimgray" },
  { int: 6908265, name: "dimgrey" },
  { int: 2003199, name: "dodgerblue" },
  { int: 11674146, name: "firebrick" },
  { int: 16775920, name: "floralwhite" },
  { int: 2263842, name: "forestgreen" },
  { int: 14474460, name: "gainsboro" },
  { int: 16316671, name: "ghostwhite" },
  { int: 16766720, name: "gold" },
  { int: 14329120, name: "goldenrod" },
  { int: 11403055, name: "greenyellow" },
  { int: 8421504, name: "grey" },
  { int: 15794160, name: "honeydew" },
  { int: 16738740, name: "hotpink" },
  { int: 13458524, name: "indianred" },
  { int: 4915330, name: "indigo" },
  { int: 16777200, name: "ivory" },
  { int: 15787660, name: "khaki" },
  { int: 15132410, name: "lavender" },
  { int: 16773365, name: "lavenderblush" },
  { int: 8190976, name: "lawngreen" },
  { int: 16775885, name: "lemonchiffon" },
  { int: 11393254, name: "lightblue" },
  { int: 15761536, name: "lightcoral" },
  { int: 14745599, name: "lightcyan" },
  { int: 16448210, name: "lightgoldenrodyellow" },
  { int: 13882323, name: "lightgray" },
  { int: 9498256, name: "lightgreen" },
  { int: 13882323, name: "lightgrey" },
  { int: 16758465, name: "lightpink" },
  { int: 16752762, name: "lightsalmon" },
  { int: 2142890, name: "lightseagreen" },
  { int: 8900346, name: "lightskyblue" },
  { int: 7833753, name: "lightslategray" },
  { int: 7833753, name: "lightslategrey" },
  { int: 11584734, name: "lightsteelblue" },
  { int: 16777184, name: "lightyellow" },
  { int: 3329330, name: "limegreen" },
  { int: 16445670, name: "linen" },
  { int: 16711935, name: "fuchsia" },
  { int: 6737322, name: "mediumaquamarine" },
  { int: 205, name: "mediumblue" },
  { int: 12211667, name: "mediumorchid" },
  { int: 9662683, name: "mediumpurple" },
  { int: 3978097, name: "mediumseagreen" },
  { int: 8087790, name: "mediumslateblue" },
  { int: 64154, name: "mediumspringgreen" },
  { int: 4772300, name: "mediumturquoise" },
  { int: 13047173, name: "mediumvioletred" },
  { int: 1644912, name: "midnightblue" },
  { int: 16121850, name: "mintcream" },
  { int: 16770273, name: "mistyrose" },
  { int: 16770229, name: "moccasin" },
  { int: 16768685, name: "navajowhite" },
  { int: 16643558, name: "oldlace" },
  { int: 7048739, name: "olivedrab" },
  { int: 16729344, name: "orangered" },
  { int: 14315734, name: "orchid" },
  { int: 15657130, name: "palegoldenrod" },
  { int: 10025880, name: "palegreen" },
  { int: 11529966, name: "paleturquoise" },
  { int: 14381203, name: "palevioletred" },
  { int: 16773077, name: "papayawhip" },
  { int: 16767673, name: "peachpuff" },
  { int: 13468991, name: "peru" },
  { int: 16761035, name: "pink" },
  { int: 14524637, name: "plum" },
  { int: 11591910, name: "powderblue" },
  { int: 12357519, name: "rosybrown" },
  { int: 4286945, name: "royalblue" },
  { int: 9127187, name: "saddlebrown" },
  { int: 16416882, name: "salmon" },
  { int: 16032864, name: "sandybrown" },
  { int: 3050327, name: "seagreen" },
  { int: 16774638, name: "seashell" },
  { int: 10506797, name: "sienna" },
  { int: 8900331, name: "skyblue" },
  { int: 6970061, name: "slateblue" },
  { int: 7372944, name: "slategray" },
  { int: 7372944, name: "slategrey" },
  { int: 16775930, name: "snow" },
  { int: 65407, name: "springgreen" },
  { int: 4620980, name: "steelblue" },
  { int: 13808780, name: "tan" },
  { int: 14204888, name: "thistle" },
  { int: 16737095, name: "tomato" },
  { int: 4251856, name: "turquoise" },
  { int: 15631086, name: "violet" },
  { int: 16113331, name: "wheat" },
  { int: 16119285, name: "whitesmoke" },
  { int: 10145074, name: "yellowgreen" }
];
const _CSS4 = [
  ..._CSS3,
  { int: 6697881, name: "rebeccapurple" }
];
function augment(pal) {
  return pal.map((el) => {
    const rgb = int2rgb(el.int);
    const hex = rgb2hex(rgb);
    const css = rgb2css(rgb);
    const v = rgb2gray(rgb);
    return { ...el, ...rgb, v, hex, css };
  });
}
function toMap(pal) {
  const out = {};
  pal.forEach((el) => {
    out[el.name] = el;
  });
  return out;
}
toMap(augment(_CSS4));
toMap(augment(_CSS3));
toMap(augment(_CSS2));
toMap(augment(_CSS1));
augment(_C64);
augment(_CGA);
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
