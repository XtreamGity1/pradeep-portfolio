import { act } from '@testing-library/react';

// Controllable IntersectionObserver for scrollspy tests: tests decide which observed sections
// cross the spy band. Call restore() when done.
export default function mockIntersectionObserver() {
  const instances = [];
  const original = globalThis.IntersectionObserver;
  globalThis.IntersectionObserver = class {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.targets = new Set();
      this.disconnected = false;
      instances.push(this);
    }
    observe(el) {
      this.targets.add(el);
    }
    unobserve(el) {
      this.targets.delete(el);
    }
    disconnect() {
      this.disconnected = true;
      this.targets.clear();
    }
    takeRecords() {
      return [];
    }
  };
  return {
    instances,
    // Report `visible` ids as intersecting and every other observed target as not.
    show(...visible) {
      act(() => {
        for (const io of instances) {
          if (io.disconnected) continue;
          const entries = [...io.targets].map(target => ({ target, isIntersecting: visible.includes(target.id) }));
          io.callback(entries, io);
        }
      });
    },
    restore() {
      globalThis.IntersectionObserver = original;
    },
  };
}
