// Stub for react-native/setup-env
global.window = global.window || {};
global.window.dispatchEvent = jest.fn();
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();

jest.mock('react-native-safe-area-context', () => {
  const dummyProvider = ({ children }: any) => children;
  dummyProvider.displayName = 'SafeAreaProvider';

  const dummyView = ({ children }: any) => children;
  dummyView.displayName = 'SafeAreaView';

  return {
    SafeAreaProvider: dummyProvider,
    SafeAreaView: dummyView,
    SafeAreaConsumer: ({ children }: any) => children({ top: 0, bottom: 0, left: 0, right: 0 }),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
