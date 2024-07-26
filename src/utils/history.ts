export const historyState = {
  preventBack: (e: PopStateEvent) => {
    e.preventDefault();
  },
  push: function (callback: () => void) {
    if (!window) return;
    window.history.pushState(null, "", window.location.href);

    this.preventBack = (e: PopStateEvent) => {
      e.preventDefault();
      callback?.();
      window.removeEventListener("popstate", this.preventBack);
    };

    window.addEventListener("popstate", this.preventBack);
  },
  pop: function () {
    if (!window) return;
    window.removeEventListener("popstate", this.preventBack);
    window.history.back();
  },
};
