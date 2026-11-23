// The figure under the opening line: one synthetic EEG channel, then the same
// channel average-pooled by 4, 16 and 64. A window marks one moment in every
// stage and shows how much signal each pooled value stands for.

(() => {
  const figure = document.querySelector("[data-signal]");
  if (!figure) return;

  const SAMPLES = 1024;
  const RATE = 256; // Hz, so the trace covers four seconds
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Small seeded generator (mulberry32) so the trace is the same on every visit.
  function seeded(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Slow drift, a theta rhythm, alpha that comes in bursts, a little beta,
  // and low-passed noise on top.
  function synthesize() {
    const random = seeded(11);
    const phase = Array.from({ length: 7 }, () => random() * 2 * Math.PI);
    const signal = new Float64Array(SAMPLES);
    let noise = 0;

    for (let i = 0; i < SAMPLES; i++) {
      const t = i / RATE;
      const turn = 2 * Math.PI * t;
      const drift =
        0.75 * Math.sin(0.31 * turn + phase[0]) +
        0.5 * Math.sin(0.83 * turn + phase[1]) +
        0.3 * Math.sin(1.9 * turn + phase[2]);
      const theta = 0.3 * Math.sin(5.5 * turn + phase[3]);
      const burst = Math.max(0, Math.sin(0.42 * turn + phase[4])) ** 2;
      const alpha = 0.85 * burst * Math.sin(10.2 * turn + phase[5]);
      const beta = 0.16 * Math.sin(21 * turn + phase[6]);
      noise = 0.8 * noise + 0.2 * (random() * 2 - 1);
      signal[i] = drift + theta + alpha + beta + 1.1 * noise;
    }
    return signal;
  }

  function averagePool(signal, stride) {
    const pooled = new Float64Array(signal.length / stride);
    for (let i = 0; i < pooled.length; i++) {
      let sum = 0;
      for (let j = 0; j < stride; j++) sum += signal[i * stride + j];
      pooled[i] = sum / stride;
    }
    return pooled;
  }

  const signal = synthesize();
  const peak = signal.reduce((max, v) => Math.max(max, Math.abs(v)), 0);
  const y = (v) => (50 - (v / peak) * 44).toFixed(2);

  function tracePath(values, stride) {
    if (stride === 1) {
      return "M" + Array.from(values, (v, i) => `${i + 0.5},${y(v)}`).join("L");
    }
    // Pooled stages are drawn as steps: one flat segment per value.
    let d = `M0,${y(values[0])}`;
    values.forEach((v, i) => {
      d += `V${y(v)}H${(i + 1) * stride}`;
    });
    return d;
  }

  function element(name, className) {
    const node = document.createElementNS(SVG_NS, name);
    node.setAttribute("class", className);
    return node;
  }

  const stages = Array.from(figure.querySelectorAll(".stage"), (row) => {
    const stride = Number(row.dataset.stride);
    const values = averagePool(signal, stride);
    const svg = row.querySelector("svg");
    const windowRect = element("rect", "window");
    const trace = element("path", "trace");
    const mark = element("path", "mark");

    windowRect.setAttribute("y", 0);
    windowRect.setAttribute("height", 100);
    trace.setAttribute("d", tracePath(values, stride));
    svg.append(windowRect, trace, mark);
    return { stride, values, svg, windowRect, mark };
  });

  const plot = figure.querySelector(".stages");
  let current = 0;

  // Highlight, in every stage, the value that contains sample `index`.
  function follow(index) {
    current = Math.min(SAMPLES - 1, Math.max(0, index));
    for (const { stride, values, windowRect, mark } of stages) {
      const slot = Math.floor(current / stride);
      const level = y(values[slot]);
      if (stride === 1) {
        windowRect.setAttribute("x", current - 1);
        windowRect.setAttribute("width", 3);
        mark.setAttribute("d", `M${current + 0.5},${level}h0`);
      } else {
        windowRect.setAttribute("x", slot * stride);
        windowRect.setAttribute("width", stride);
        mark.setAttribute("d", `M${slot * stride},${level}h${stride}`);
      }
    }
    plot.setAttribute("aria-valuenow", current);
    plot.setAttribute("aria-valuetext", `${(current / RATE).toFixed(2)} seconds`);
  }

  function followPointer(event) {
    const box = stages[0].svg.getBoundingClientRect();
    const fraction = (event.clientX - box.left) / box.width;
    // Ignore the label column and anything past the right edge.
    if (fraction < 0 || fraction > 1) return;
    follow(Math.floor(fraction * SAMPLES));
  }

  const KEY_STEPS = { ArrowLeft: -16, ArrowRight: 16, PageDown: -64, PageUp: 64 };

  function followKey(event) {
    if (event.key === "Home") follow(0);
    else if (event.key === "End") follow(SAMPLES - 1);
    else if (event.key in KEY_STEPS) follow(current + KEY_STEPS[event.key]);
    else return;
    event.preventDefault();
  }

  // The plot behaves as a slider over the four seconds of signal.
  plot.setAttribute("role", "slider");
  plot.setAttribute("tabindex", "0");
  plot.setAttribute("aria-label", "Moment in the recording");
  plot.setAttribute("aria-valuemin", 0);
  plot.setAttribute("aria-valuemax", SAMPLES - 1);
  plot.addEventListener("pointermove", followPointer);
  plot.addEventListener("pointerdown", followPointer);
  plot.addEventListener("keydown", followKey);

  follow(Math.round(SAMPLES * 0.62));
  figure.setAttribute("data-ready", "");
})();
