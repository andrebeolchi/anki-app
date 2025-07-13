import { omit } from 'ramda'
import { createContext, useContext, useEffect, useState } from 'react'

import { StorageAdapter } from '~/components/storage/adapters/types'

type StorageContext = [
  {
    isRehydrated: boolean
    data?: Record<string, unknown>
  },
  {
    setItem: (_key: string, _value: unknown) => Promise<void>
    removeItem: (_key: string) => Promise<void>
  },
]

const Context = createContext<StorageContext>([
  {
    isRehydrated: false,
  },
  {
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  },
])

export const StorageLoader = ({ children }: { children: React.ReactNode }) => {
  const [{ isRehydrated }] = useContext(Context)
  return !isRehydrated && children
}

export const StorageChildren = ({ children }: { children: React.ReactNode }) => {
  const [{ isRehydrated }] = useContext(Context)
  return isRehydrated && children
}

export const StorageProvider = ({
  initialValues = {},
  adapter,
  children,
  onLoadPersistedData,
  onRehydrate,
}: {
  initialValues?: Record<string, unknown>
  adapter: StorageAdapter
  children: React.ReactNode
  onLoadPersistedData?: (_data: Record<string, any>) => Promise<Record<string, any>>
  onRehydrate?: (_data: Record<string, any>) => Promise<void>
}) => {
  const [state, setState] = useState({
    isRehydrated: false,
    data: initialValues,
  })

  const rehydrate = async () => {
    const data = (await adapter.getAll()) || initialValues
    const transformedData = onLoadPersistedData ? await onLoadPersistedData?.(data) : data

    onLoadPersistedData && (await adapter.updateAll(transformedData))

    setState({
      isRehydrated: true,
      data,
    })
  }

  useEffect(() => {
    rehydrate()
  }, [])

  useEffect(() => {
    state.isRehydrated && onRehydrate?.(state.data)
  }, [state.isRehydrated])

  const setItem = async (key: string, value: unknown) => {
    await adapter.set(key, value)

    setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [key]: value,
      },
    }))
  }

  const removeItem = async (key: string) => {
    await adapter.remove(key)

    setState(prevState => ({
      ...prevState,
      data: omit([key], prevState.data),
    }))
  }

  return <Context.Provider value={[state, { setItem, removeItem }]}>{children}</Context.Provider>
}

type SetValue<T> = T | ((_value?: T) => Partial<T>)

type UseStorageReturn<T> = [
  T,
  {
    set: (_value: SetValue<T>) => Promise<void>
    remove: () => Promise<void>
  },
]

export const useStorage = <T extends unknown>(key: string, defaultValue: T): UseStorageReturn<T> => {
  const [{ data }, actions] = useContext(Context)

  const set = (value: SetValue<T>) => actions.setItem(key, value instanceof Function ? value(data?.[key] as T) : value)
  const remove = () => actions.removeItem(key)

  return [(data?.[key] as T) ?? defaultValue, { set, remove }]
}
