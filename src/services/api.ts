import axios from 'axios';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAppStore } from '../store/useAppStore';

// Android emulator cannot reach the host via `localhost` — use 10.0.2.2 instead.
// iOS Simulator shares the Mac's network stack so localhost works fine.
const resolveLocalUrl = (url: string) => {
  if (Platform.OS === 'android') {
    return url.replace('localhost', '10.0.2.2');
  }
  return url;
};

const rawUrl = process.env.EXPO_PUBLIC_API_URL || 'https://shelloc-backend.onrender.com/api';
export const API_BASE_URL = resolveLocalUrl(rawUrl);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sync axios baseURL with zustand store
useAppStore.subscribe((state) => {
  if (apiClient.defaults.baseURL !== state.apiBaseUrl) {
    apiClient.defaults.baseURL = state.apiBaseUrl;
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If it's a 404 Not Found, don't trigger the global error toast
    // (e.g., initial state where robot hasn't checked in yet)
    if (error.response && error.response.status === 404) {
      return Promise.reject(error);
    }
    
    const message = error.response?.data?.detail || error.message || 'An unexpected network error occurred.';
    
    Toast.show({
      type: 'error',
      text1: 'API Error',
      text2: message,
      position: 'top',
      visibilityTime: 4000,
    });
    
    return Promise.reject(error);
  }
);
