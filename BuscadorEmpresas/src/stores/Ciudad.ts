import { defineStore } from 'pinia'
import { useLoginStore } from '../stores/Login'

const loginStore = useLoginStore()


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

  state: () => ({
    listaCiudades: [] as CiudadeEmpresas[],
    ciudadInfo: null as InfoCiudad | null,
    listaBuscadorCiudades: [] as InfoCiudad[],
    ciudadExistente: null as CiudadeEmpresas | null,
    empresasByCiudad: null as CiudadeEmpresas | null
  }),

  actions: {
    async GetAllCiudades() {
      try {
        const response = await fetch(`api/Ciudad`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las ciudades.')
        }

        const data = await response.json()

        this.listaCiudades = data

        console.log('Ciudades obtenidas correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetCiudadId(idCiudad: number) {
      try {
        const response = await fetch(`api/Ciudad/${idCiudad}`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener la ciudad.')
        }

        const data = await response.json()

        this.ciudadInfo = data

        console.log('Ciudad obtenida correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async BuscadorCiudad(nombreCiudad: string) {
      try {
        const response = await fetch(`api/Ciudad/buscar?nombre=${nombreCiudad}`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las ciudades.')
        }

        const data = await response.json()

        this.listaBuscadorCiudades = data

        console.log('Ciudades obtenidas correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetEmpresasByCiudad(idCiudad: number) {
      try {
        const response = await fetch(`api/Ciudad/${idCiudad}/empresas`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las empresas de la ciudad.')
        }

        const data = await response.json()

        this.empresasByCiudad = data

        console.log('Empresas de la ciudad obtenidas correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetEmpresaExistente(idCiudad: number, idEmpresa: number) {
      try {
        const response = await fetch(
          `api/Ciudad/empresa?idEmpresa=${idEmpresa}&idCiudad=${idCiudad}`,
          {
            method: 'GET'
          }
        )

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al hacer la peticion de la Api.')
        }

        const data = await response.json()

        this.ciudadExistente = data

        console.log('Comprobar existencia mandada correctamente.')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async CreateCiudad(DatosCiudad: InfoCiudad) {
      try {
        const token = loginStore.token

        const objetoMandar = {
          idCiudad: 0,
          nombre: DatosCiudad.nombre
        }

        const response = await fetch(`api/Ciudad`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(objetoMandar)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al crear la ciudad.')
        }

        console.log('Categoria crear correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async ModificarCiudad(DatosCiudad: InfoCiudad) {
      try {
        const token = loginStore.token

        const objetoMandar = {
          idCiudad: DatosCiudad.idCiudad,
          nombre: DatosCiudad.nombre
        }

        const response = await fetch(`api/Ciudad`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(objetoMandar)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al modificar la ciudad.')
        }

        console.log('Categoria modificar correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarCiudad(idCategoria: number) {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Ciudad/${idCategoria}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al eliminar la categoria.')
        }

        console.log('Categoria eliminada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
})
