import { omit } from 'ramda'

export const storage = ({ initialValues = {} }: { initialValues?: Record<string, unknown> } = {}) => ({
  data: initialValues,

  async getAll() {
    return this.data
  },

  async get(key: string) {
    return this.data[key]
  },

  async set(key: string, value: unknown) {
    this.data[key] = value
  },

  async remove(key: string) {
    this.data = omit([key], this.data)
  },

  async clear() {
    this.data = {}
  },

  async updateAll(data: Record<string, unknown>) {
    this.data = data
  },
})
