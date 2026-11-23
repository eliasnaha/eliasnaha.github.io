// The strip under the header: a slow, EEG-like trace drawn in characters.
// Each text row holds three heights ( .  -  ' ), so three rows give nine.

(() => {
  const pre = document.querySelector("[data-wave]");
  if (!pre) return;

  const ROWS = 3;
  const MARKS = [".", "-", "'"]; // low, middle and high within one text row
  const LEVELS = ROWS * MARKS.length;
  const FRAME_MS = 100;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

  let columns = 0;
  let lastFrame = 0;

  function countColumns() {
    const probe = document.createElement("span");
    probe.textContent = "0".repeat(40);
    pre.textContent = "";
    pre.append(probe);
    const characterWidth = probe.getBoundingClientRect().width / 40 || 8;
    probe.remove();
    columns = Math.max(1, Math.floor(pre.clientWidth / characterWidth));
  }

  // Two rhythms travelling at different speeds under a slow envelope, so the
  // trace drifts across the page and its shape keeps changing a little.
  function heightAt(x, t) {
    const envelope = 0.62 + 0.38 * Math.sin(0.023 * x - 0.09 * t);
    const rhythm = 0.62 * Math.sin(0.17 * x - 0.7 * t) + 0.3 * Math.sin(0.41 * x - 1.3 * t + 1.3);
    return envelope * rhythm + 0.08 * Math.sin(0.05 * x + 0.2 * t);
  }

  function draw(t) {
    const rows = Array.from({ length: ROWS }, () => new Array(columns).fill(" "));
    for (let x = 0; x < columns; x++) {
      const scaled = Math.round(((heightAt(x, t) + 1) / 2) * (LEVELS - 1));
      const level = Math.min(LEVELS - 1, Math.max(0, scaled));
      const row = ROWS - 1 - Math.floor(level / MARKS.length);
      rows[row][x] = MARKS[level % MARKS.length];
    }
    pre.textContent = rows.map((row) => row.join("")).join("\n");
  }

  function tick(now) {
    if (now - lastFrame >= FRAME_MS) {
      lastFrame = now;
      draw(now / 1000);
    }
    if (!calm.matches) requestAnimationFrame(tick);
  }

  let knownWidth = 0;

  function restart() {
    if (pre.clientWidth === knownWidth) return;
    knownWidth = pre.clientWidth;
    countColumns();
    draw(performance.now() / 1000);
  }

  new ResizeObserver(restart).observe(pre);
  calm.addEventListener("change", () => {
    if (!calm.matches) requestAnimationFrame(tick);
  });

  restart();
  if (!calm.matches) requestAnimationFrame(tick);

  // Characters change width when the web font arrives: count them again.
  if (document.fonts) {
    document.fonts.ready.then(() => {
      knownWidth = 0;
      restart();
    });
  }
})();
