import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(cleanup);


// Browser APIs used by React Bits / motion / gsap that jsdom lacks.
class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
globalThis.IntersectionObserver ??= ObserverStub;
globalThis.ResizeObserver ??= ObserverStub;

window.matchMedia ??= query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent: () => false,
});

// SplitText waits on document.fonts (FontFaceSet), which jsdom doesn't implement.
if (!document.fonts) {
  Object.defineProperty(document, 'fonts', {
    configurable: true,
    value: { status: 'loaded', ready: Promise.resolve(), addEventListener() {}, removeEventListener() {} },
  });
}
HTMLCanvasElement.prototype.getContext = () => null;
