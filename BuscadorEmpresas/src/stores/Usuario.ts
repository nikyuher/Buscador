import { defineStore } from 'pinia'

interface Usuario {
  idUsuario: number
  nombre: string
  contrasena: string
  correo: string
  rol: boolean
  peticionesDTO: PeticionesDTO[]
}

interface PeticionesDTO {
  idPeticion: number
  idUsuario: number
  datosUsuario: null
  nombreEmpresa: string
  descripcionEmpresa: string
  direccionEmpresa: string
  imagenEmpresaURL: string
  idCategoriaEmpresa: number
  idCiudadEmpresa: number
}

interface infoUsuario {
  idUsuario: number
  nombre: string
  correo: string
  contrasena: string
}

export const useUsuarioStore = defineStore({
  id: 'usuario',

  state: () => ({
    ListUsuarios: [] as Usuario[],
    usuario: null as Usuario | null
  }),

  actions: {
    async GetAllUsuarios(token: string) {
      try {
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

        this.ListUsuarios = data

        console.log('Usuarios obtenidas correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetUsuarioId(idUsuario: number, token: string) {
      try {
        const response = await fetch(`api/Usuario/${idUsuario}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener al usuario.')
        }

        const data = await response.json()

        this.usuario = data

        console.log('Usuario obtenido correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async PutDatosUsuarioId(infoUser: infoUsuario, token: string) {
      try {
        const response = await fetch(`api/Usuario/${infoUser.idUsuario}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(infoUser)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al modificar datos al usuario.')
        }

        console.log('Usuario modificado correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarUsuarios(idUsuario: number, token: string) {
      try {
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
