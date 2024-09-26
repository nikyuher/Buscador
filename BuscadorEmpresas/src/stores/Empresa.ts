import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

export const useEmpresaStore = defineStore({
  id: 'empresa',

  state: () => ({}),

  actions: {}
})
