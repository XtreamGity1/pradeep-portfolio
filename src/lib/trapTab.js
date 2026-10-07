// Moves Tab focus through a modal's own focusable elements, wrapping at either end.
//
// Every Tab is handled here rather than left to the browser: a <video controls> is one stop, never
// its built-in buttons. Once focus is inside those native controls, Chrome stops passing key
// presses to the page, so Escape could no longer close the dialog. With the <video> itself focused,
// Escape still reaches the page and Space still plays and pauses.
export default function trapTab(event, container, selector) {
  const items = [...container.querySelectorAll(selector)];
  if (items.length === 0) return;
  event.preventDefault();
  const current = items.findIndex(el => el === document.activeElement);
  const step = event.shiftKey ? -1 : 1;
  // From outside the list (or nowhere), Tab enters at the first item and Shift+Tab at the last.
  const next = current === -1 ? (event.shiftKey ? items.length - 1 : 0) : (current + step + items.length) % items.length;
  items[next].focus();
}
