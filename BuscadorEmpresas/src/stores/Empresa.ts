import { defineStore } from 'pinia'
import { useLoginStore } from '../stores/Login'

const loginStore = useLoginStore()


interface Empresa {
  idEmpresa: number
  nombre: string
  descripcion: string
  direccion: string
  imagen: string
  empresaCategorias: null
  empresasCiudades: null
}

interface DatosEmpresa {
  idEmpresa: number
  nombre: string
  descripcion: string
  direccion: string
  imagen: string
}

export const useEmpresaStore = defineStore({
  id: 'empresa',

  state: () => ({
    listaEmpresas: [] as Empresa[],
    empresa: null as Empresa | null,
    listaBuscadorEmpresa: [] as Empresa[]
  }),

  actions: {
    async GetAllEmpresas() {
      try {
        const response = await fetch(`api/Empresa`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las empresas.')
        }

        const data = await response.json()

        this.listaEmpresas = data

        console.log('Empresas obtenidas correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetEmpresaId(idEmpresa: number) {
      try {
        const response = await fetch(`api/Empresa/${idEmpresa}`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener la empresa.')
        }

        const data = await response.json()

        this.empresa = data

        console.log('Empresa obtenida correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async BuscadorEmpresa(nombreEmpresa: string) {
      try {
        const response = await fetch(`api/Empresa/buscar?nombre=${nombreEmpresa}`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las empresas buscadas.')
        }

        const data = await response.json()

        this.listaBuscadorEmpresa = data

        console.log('Empresas obtenidas correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async CreateEmpresa(DatosEmpresa: DatosEmpresa) {
      try {
        const token = loginStore.token

        const objectCrear = {
          idEmpresa: (DatosEmpresa.idEmpresa = 0),
          nombre: DatosEmpresa.nombre,
          descripcion: DatosEmpresa.descripcion,
          direccion: DatosEmpresa.direccion,
          imagen: DatosEmpresa.imagen
        }

        const response = await fetch(`api/Empresa`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(objectCrear)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al crear la empresa.')
        }

        console.log('Empresa creada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async AddCategoriaToEmpresa(idCategoria: number, idEmpresa: number) {
      try {
        const token = loginStore.token

        const objetoAñadir = {
          idCategoria: idCategoria,
          idEmpresa: idEmpresa
        }

        const response = await fetch(`api/Empresa/categoria`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(objetoAñadir)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al añadir la categoria a la empresa.')
        }

        console.log('Categoria añadida correctamente a la Empresa')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async AddCiudadToEmpresa(idCiudad: number, idEmpresa: number) {
      try {
        const token = loginStore.token

        const objetoAñadir = {
          idCiudad: idCiudad,
          idEmpresa: idEmpresa
        }

        const response = await fetch(`api/Empresa/ciudad`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(objetoAñadir)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al añadir la ciudad a la empresa.')
        }

        console.log('Ciudad añadida correctamente a la Empresa')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async PutDatosEmpresa(DatosEmpresa: DatosEmpresa) {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Empresa/${DatosEmpresa.idEmpresa}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(DatosEmpresa)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al modificar la empresa.')
        }

        console.log('Empresa modificada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarEmpresa(idEmpresa: number) {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Empresa/${idEmpresa}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al eliminar la empresa.')
        }

        console.log('Empresa eliminada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarCategoriaByEmpresa(idCategoriaEmpresa: number) {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Empresa/categoria?IdempresaCategoria=${idCategoriaEmpresa}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al eliminar la categoria de la empresa.')
        }

        console.log('Categoria eliminada correctamente de la Empresa')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarCiudadByEmpresa(idCiudadEmpresa: number) {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Empresa/ciudad?IdempresaCiudad=${idCiudadEmpresa}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al eliminar la ciudad de la empresa.')
        }

        console.log('Ciudad eliminada correctamente de la Empresa')
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
})
