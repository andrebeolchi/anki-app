import React from 'react'

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { MMKV } from "react-native-mmkv"

export const storage = new MMKV();

const clientStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const clientPersister = createAsyncStoragePersister({ storage: clientStorage });

export const queryClient = new QueryClient()

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  if (!children) {
    console.warn('QueryProvider requires children to be passed');
    return 
  }

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: clientPersister }}>
      {children}
    </PersistQueryClientProvider>
  )
}