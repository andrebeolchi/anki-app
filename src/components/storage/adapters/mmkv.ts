import { MMKV, MMKVConfiguration } from 'react-native-mmkv'

export const storage = (options: MMKVConfiguration) => {
  const mmkv = new MMKV(options)

  const get = async (key: string) => (mmkv.getString(key) ? JSON.parse(`${mmkv.getString(key)}`) : undefined)

  const getAll = async () => {
    const keys = mmkv.getAllKeys()

    const promises = keys.map(async key => {
      return [key, await get(key)]
    })

    const data = await Promise.all(promises)

    return Object.fromEntries(data)
  }

  const set = async (key: string, value: unknown) => mmkv.set(key, JSON.stringify(value))

  const remove = async (key: string) => mmkv.delete(key)

  const clear = async () => mmkv.clearAll()

  const updateAll = async (data: Record<string, unknown>) => {
    await clear()

    for (const [key, value] of Object.entries(data)) {
      await set(key, value)
    }
  }

  return {
    data: getAll(),
    getAll,
    get,
    set,
    updateAll,
    remove,
    clear,
  }
}
