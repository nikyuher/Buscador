import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

export const useCiudadStore = defineStore({
  id: 'ciudad',

  state: () => ({}),

  actions: {}
})
