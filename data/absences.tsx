import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Absence {
  subject: string;
  excused: boolean;
  date: Date;
}

export const useAbsences = create(
  persist<{
    absences: Absence[];
    addAbsence: (absence: Absence) => void;
    setAbsenceExcused: (absence: Absence, excused: boolean) => void;
  }>(
    (set) => ({
      absences: [],
      addAbsence: (absence: Absence) =>
        set((state) => ({ absences: [...state.absences, absence] })),
      setAbsenceExcused: (absence: Absence, excused: boolean) =>
        set((state) => ({
          absences: state.absences.map((a) =>
            a === absence ? { ...a, excused } : a
          )
        }))
    }),
    {
      name: 'absences',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
