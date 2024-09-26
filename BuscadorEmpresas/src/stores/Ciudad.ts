import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

interface CiudadeEmpresas {
  idCiudad: number
  nombre: string
  empresasCiudades: EmpresasCiudade[]
}

interface EmpresaCiudad {
  idCiudad: number
  nombre: string
  empresasCiudades: EmpresasCiudade
}

interface InfoCiudad {
  idCiudad: number
  nombre: string
}

interface EmpresasCiudade {
  idEmpresaCiudad: number
  empresa: Empresa
}

interface Empresa {
  idEmpresa: number
  nombre: string
}

export const useCiudadStore = defineStore({
  id: 'ciudad',

  state: () => ({}),

  actions: {}
})
