import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ro' | 'hu' | 'de' | 'fr' | 'es';

export const useLanguage = create(
  persist<{
    language: Language;
    setLanguage: (language: Language) => void;
  }>(
    (set) => ({
      language: 'en',
      setLanguage: (language: Language) => set({ language })
    }),
    {
      name: 'language',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
