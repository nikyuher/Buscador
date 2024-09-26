import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

export const useCategoriaStore = defineStore({
  id: 'categoria',

  state: () => ({}),

  actions: {}
})
