import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Organization } from '@/data/organizations';

export interface Account {
  name: string;
  surname: string;
  email: string;
  organizations: string[];
  classes: string[];
}

export const useAccount = create(
  persist<{
    loggedIn: Account | null;
    accounts: Account[];
    addAccount: (account: Account) => void;
    addOrganization: (email: string, organization: string) => void;
    deleteOrganization: (email: string, organization: string) => void;
    addClass: (email: string, class_: string) => void;
    deleteClass: (email: string, class_: string) => void;
    setLoggedIn: (account: Account | null) => void;
    getAccount: (email: string) => Account | null;
  }>(
    (set, get) => ({
      loggedIn: null,
      accounts: [],
      addAccount: (account: Account) =>
        set((state) => ({ accounts: [...state.accounts, account] })),
      addOrganization: (email: string, organization: string) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email === email
              ? { ...a, organizations: [...a.organizations, organization] }
              : a
          )
        })),
      addClass: (email: string, class_: string) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email === email ? { ...a, classes: [...a.classes, class_] } : a
          )
        })),
      setLoggedIn: (account: Account | null) => set({ loggedIn: account }),
      getAccount: (email: string) =>
        get().accounts.find((account) => account.email === email) || null,
      deleteOrganization: (email: string, organization: string) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email === email
              ? {
                  ...a,
                  organizations: a.organizations.filter(
                    (org) => org !== organization
                  )
                }
              : a
          )
        })),
      deleteClass: (email: string, class_: string) =>
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.email === email
              ? { ...a, classes: a.classes.filter((cls) => cls !== class_) }
              : a
          )
        }))
    }),
    {
      name: 'accounts',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
