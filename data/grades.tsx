import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Grade {
  subject: string;
  grade: number;
  date: Date;
  assignment?: string;
}

export const useGrades = create(
  persist<{
    grades: Grade[];
    addGrade: (grade: Grade) => void;
  }>(
    (set) => ({
      grades: [],
      addGrade: (grade: Grade) =>
        set((state) => ({ grades: [...state.grades, grade] }))
    }),
    {
      name: 'grades',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
