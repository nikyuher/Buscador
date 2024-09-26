import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

interface Caterorias {
  idCategoria: number
  nombre: string
  empresaCategorias: EmpresasCategoria[]
}

interface InfoCategoria {
  idCategoria: number
  nombre: string
}

interface EmpresasCategoria{
    idEmpresaCategoria: number
  empresa: Empresa
}

interface Empresa{
    idEmpresa:number;
    nombre: string
}

export const useCategoriaStore = defineStore({
  id: 'categoria',

  state: () => ({
categorias: [] as Caterorias[]

  }),

  actions: {}
})
