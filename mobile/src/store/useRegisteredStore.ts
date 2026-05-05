import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type RegisteredStore = {
  registered: string[];
  addRegisteredItems: (items: string[]) => void;
  isItemRegistered: (id: string) => boolean;
};

export const useRegisteredStore = create<RegisteredStore>()(
  persist(
    (set, get) => ({
      registered: [],
      addRegisteredItems: (items) => {
        const uniqueItems = Array.from(
          new Set([...get().registered, ...items])
        );

        set({ registered: uniqueItems });
      },
      isItemRegistered: (id) => get().registered.includes(id),
    }),
    {
      name: 'registered-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
