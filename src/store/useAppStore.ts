import { create } from 'zustand';
// Removed circular dependency with api.ts

interface AppState {
  activeRobotId: string;
  setActiveRobotId: (id: string) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (isDemo: boolean) => void;
  geofenceRadiusMeters: number;
  setGeofenceRadiusMeters: (radius: number) => void;
  flocculantCapacityMl: number;
  setFlocculantCapacityMl: (capacity: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeRobotId: 'SHELLOC-01',
  setActiveRobotId: (id: string) => set({ activeRobotId: id }),
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://shelloc-backend.onrender.com/api',
  setApiBaseUrl: (url: string) => set({ apiBaseUrl: url }),
  isDemoMode: false,
  setIsDemoMode: (isDemo: boolean) => set({ isDemoMode: isDemo }),
  geofenceRadiusMeters: 2.0,
  setGeofenceRadiusMeters: (radius: number) => set({ geofenceRadiusMeters: radius }),
  flocculantCapacityMl: 500, // standard cartridge size
  setFlocculantCapacityMl: (capacity: number) => set({ flocculantCapacityMl: capacity }),
}));
