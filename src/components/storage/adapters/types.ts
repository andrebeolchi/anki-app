export type StorageAdapter = {
  getAll: () => Promise<Record<string, unknown>>
  get: (_key: string) => Promise<unknown>
  set: (_key: string, _value: unknown) => Promise<void>
  remove: (_key: string) => Promise<void>
  clear: () => Promise<void>
  updateAll: (_data: Record<string, unknown>) => Promise<void>
}
