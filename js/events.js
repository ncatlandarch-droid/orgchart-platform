/* ============================================
 * ORGCHART PLATFORM — Event Bus
 * ============================================ */

OC.Events = (function() {
  const listeners = {};

  return {
    on(event, fn) {
      (listeners[event] = listeners[event] || []).push(fn);
      return () => this.off(event, fn);
    },

    off(event, fn) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(f => f !== fn);
    },

    emit(event, data) {
      (listeners[event] || []).forEach(fn => {
        try { fn(data); }
        catch(e) { console.error(`Event handler error [${event}]:`, e); }
      });
    },

    once(event, fn) {
      const wrapper = (data) => { fn(data); this.off(event, wrapper); };
      this.on(event, wrapper);
    }
  };
})();
