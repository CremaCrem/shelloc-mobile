const RTR = require('react-test-renderer');

// RNTL v14 calls createRoot(options).render(element).
// React 19 react-test-renderer removed createRoot, so we polyfill it back to create.
module.exports = {
  ...RTR,
  createRoot: (options) => {
    let instance;
    return {
      render: (element) => {
        if (!instance) {
          instance = RTR.create(element, options);
        } else {
          instance.update(element);
        }
      },
      unmount: () => {
        if (instance) instance.unmount();
      },
      get container() {
        return instance ? instance.root : null;
      }
    };
  }
};
