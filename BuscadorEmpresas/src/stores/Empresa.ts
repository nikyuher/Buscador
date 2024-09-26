import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

interface Empresa{
    idEmpresa: 1,
    nombre: string;
    descripcion: string;
    direccion: string;
    imagen: string;
    empresaCategorias: null,
    empresasCiudades: null
}

export const useEmpresaStore = defineStore({
  id: 'empresa',

  state: () => ({}),

  actions: {}
})
