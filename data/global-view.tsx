import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type GlobalView = 'parent' | 'student' | 'teacher';

export const useGlobalView = create(
  persist<{
    view: GlobalView;
    setView: (view: GlobalView) => void;
  }>(
    (set) => ({
      view: 'student',
      setView: (view: GlobalView) => set({ view })
    }),
    {
      name: 'global-view',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
