// Section labels are buttons. Opening one gives that section the whole width
// and folds the others down to their labels; opening it again, or pressing
// Escape, brings the overview back. The open section is kept in the URL hash.

(() => {
  const frame = document.querySelector("[data-frame]");
  const body = frame && frame.querySelector(".cols");
  if (!body) return;

  const sections = Array.from(frame.querySelectorAll("[data-section]")).filter(
    (section) => section.id && section.querySelector("h2") && section.querySelector(".items")
  );
  const parts = new Map();

  for (const section of sections) {
    const heading = section.querySelector("h2");
    const panel = section.querySelector(".items");
    const button = document.createElement("button");
    const mark = document.createElement("span");
    // A marker that remembers where the section sits in the overview.
    const slot = document.createComment(section.id);

    section.before(slot);
    panel.id = section.id + "-items";
    button.type = "button";
    button.textContent = heading.textContent.trim() + " ";
    button.setAttribute("aria-controls", panel.id);
    mark.setAttribute("aria-hidden", "true");
    button.append(mark);
    heading.textContent = "";
    heading.append(button);

    button.addEventListener("click", () => {
      open(frame.dataset.focus === section.id ? null : section.id, true);
    });
    parts.set(section.id, { button, mark, slot });
  }

  function open(id, byVisitor) {
    const target = sections.find((section) => section.id === id);
    const previous = frame.dataset.focus;
    const focused = document.activeElement;

    // Put every section back in its overview place, then move the open one
    // to the end of the body, so that reading order matches what is shown.
    for (const section of sections) parts.get(section.id).slot.after(section);
    if (target) {
      body.append(target);
      frame.dataset.focus = target.id;
    } else {
      delete frame.dataset.focus;
    }

    for (const section of sections) {
      const isOpen = section === target;
      const { button, mark } = parts.get(section.id);
      section.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      mark.textContent = isOpen ? "[-]" : "[+]";
    }

    // Moving a section drops keyboard focus from anything inside it.
    if (focused && focused !== document.body && frame.contains(focused)) {
      focused.focus({ preventScroll: true });
    }

    if (byVisitor) {
      const url = target ? "#" + target.id : location.pathname + location.search;
      history.replaceState(null, "", url);
    }

    // The page has just changed height: bring the relevant part into view.
    if (target) {
      const top = body.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) body.scrollIntoView({ block: "start" });
    } else if (previous && parts.has(previous)) {
      parts.get(previous).button.scrollIntoView({ block: "nearest" });
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && frame.dataset.focus) {
      const { button } = parts.get(frame.dataset.focus);
      open(null, true);
      button.focus({ preventScroll: true });
    }
  });

  window.addEventListener("hashchange", () => open(location.hash.slice(1), false));

  open(location.hash.slice(1), false);
})();
