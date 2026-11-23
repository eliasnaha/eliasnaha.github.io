// Section labels are buttons. Opening one gives that section the whole width
// and folds the others down to their labels; opening it again, or pressing
// Escape, brings the overview back. The open section is kept in the URL hash.

(() => {
  const frame = document.querySelector("[data-frame]");
  if (!frame) return;

  const sections = Array.from(frame.querySelectorAll("[data-section]"));
  const buttons = new Map();

  for (const section of sections) {
    const heading = section.querySelector("h2");
    const button = document.createElement("button");
    const mark = document.createElement("span");

    button.type = "button";
    button.textContent = heading.textContent.trim() + " ";
    mark.setAttribute("aria-hidden", "true");
    button.append(mark);
    heading.textContent = "";
    heading.append(button);

    button.addEventListener("click", () => {
      open(frame.dataset.focus === section.id ? null : section.id, true);
    });
    buttons.set(section.id, { button, mark });
  }

  function open(id, record) {
    const target = sections.find((section) => section.id === id);

    if (target) frame.dataset.focus = target.id;
    else delete frame.dataset.focus;

    for (const section of sections) {
      const isOpen = section === target;
      const { button, mark } = buttons.get(section.id);
      section.classList.toggle("is-open", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
      mark.textContent = isOpen ? "[-]" : "[+]";
    }

    if (record) {
      const url = target ? "#" + target.id : location.pathname + location.search;
      history.replaceState(null, "", url);
    }
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && frame.dataset.focus) {
      const { button } = buttons.get(frame.dataset.focus);
      open(null, true);
      button.focus();
    }
  });

  window.addEventListener("hashchange", () => open(location.hash.slice(1), false));

  open(location.hash.slice(1), false);
})();
