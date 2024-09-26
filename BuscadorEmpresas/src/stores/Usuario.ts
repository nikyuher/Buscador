import { defineStore } from 'pinia'
import { useLoginStore } from '@/stores/Login'

const loginApi = useLoginStore()

interface Usuario {
  idUsuario: number
  nombre: string
  contrasena: string
  correo: string
  rol: true
  peticionesDTO: []
}

export const useUsuarioStore = defineStore({
  id: 'usuario',

  state: () => ({
    usuarios: [] as Usuario[]
  }),

  actions: {
    async GetAllUsuarios() {
      try {
        const token = loginApi.token

        const response = await fetch(`api/Usuario`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener los usuarios.')
        }

        const data = await response.json()

        this.usuarios = data

        console.log('Usuarios obtenidas correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async RegistrarUsuario(datosCuenta: any) {
      try {
        const token = loginApi.token

        const cuenta = {
          nombre: datosCuenta.nombre,
          contrasena: datosCuenta.contrasena,
          correo: datosCuenta.correo
        }

        const response = await fetch(`api/Usuario/register`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(cuenta)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al crear la cuenta.')
        }

        console.log('Cuenta creada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarUsuarios(idUsuario: number) {
      try {
        const token = loginApi.token

        const response = await fetch(`api/Usuario/${idUsuario}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al eliminar al usuario.')
        }

        console.log('Usuario eliminada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
})
