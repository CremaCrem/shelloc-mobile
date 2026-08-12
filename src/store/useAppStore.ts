import { create } from 'zustand';

interface AppState {
  activeRobotId: string;
  setActiveRobotId: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeRobotId: 'R1', // Default robot ID for the prototype
  setActiveRobotId: (id: string) => set({ activeRobotId: id }),
}));
