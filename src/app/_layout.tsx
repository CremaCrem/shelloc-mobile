import '../global.css';
import { Stack, ThemeProvider, DarkTheme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../components/core/ToastConfig';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen when ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0F1629',
              },
              headerTintColor: '#F8FAFC',
              contentStyle: {
                backgroundColor: '#080D19',
              },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(modals)/waypoint-setup"
              options={{
                presentation: 'modal',
                title: 'Waypoint Mission Setup',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(modals)/manual-override"
              options={{
                presentation: 'fullScreenModal',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="settings"
              options={{
                presentation: 'modal',
                title: 'Settings & Config',
                headerStyle: { backgroundColor: '#0F1629' },
                headerTintColor: '#F8FAFC',
              }}
            />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </QueryClientProvider>
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  </GestureHandlerRootView>
  );
}
