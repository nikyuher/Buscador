import { defineStore } from 'pinia'
import { useLoginStore } from '../stores/Login'

interface Caterorias {
  idCategoria: number
  nombre: string
  empresaCategorias: EmpresasCategoria[]
}

interface InfoCategoria {
  idCategoria: number
  nombre: string
}

interface EmpresasCategoria {
  idEmpresaCategoria: number
  empresa: Empresa
}

interface Empresa {
  idEmpresa: number
  nombre: string
}

export const useCategoriaStore = defineStore({
  id: 'categoria',

  state: () => ({
    listaCategorias: [] as Caterorias[],
    categoriaInfo: null as InfoCategoria | null,
    listaEmpresasByCategoria: [] as Caterorias[],
    numEmpresas: 0
  }),

  actions: {
    async GetAllCategorias() {
      try {
        const response = await fetch(`api/Categoria`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las categorias.')
        }

        const data = await response.json()

        this.listaCategorias = data

        console.log('Categorias obtenidas correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetCategoriaId(idCategoria: number) {
      try {
        const response = await fetch(`api/Categoria/${idCategoria}`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener la categoria.')
        }

        const data = await response.json()
        console.log(data)

        this.categoriaInfo = data

        console.log('Categoria obtenida correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetEmpresasByCategoria(idCategoria: number) {
      try {
        const response = await fetch(`api/Categoria/${idCategoria}/empresas`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las empresas de categoria.')
        }

        const data = await response.json()

        this.listaEmpresasByCategoria = data

        console.log('Empresas de categoria obtenida correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async GetNumEmpresasByCategoria(idCategoria: number) {
      try {
        const response = await fetch(`api/Categoria/${idCategoria}/NumEmpresas`, {
          method: 'GET'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las empresas de categoria.')
        }

        const data = await response.json()

        this.numEmpresas = data

        console.log('Empresas de categoria obtenida correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async CreateCategoria(nombre: string) {
      try {
        const loginStore = useLoginStore()

        const token = loginStore.token

        const nombreObjet = {
          nombre: nombre
        }

        const response = await fetch(`api/Categoria`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(nombreObjet)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al crear la categoria.')
        }

        console.log('Caracteristica creada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async PutCategoria(infoCategoria: InfoCategoria) {
      try {
        const loginStore = useLoginStore()
        const token = loginStore.token

        const response = await fetch(`api/Categoria`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(infoCategoria)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al modificar datos a la categoria.')
        }

        console.log('Caracteristica modificado correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async EliminarCategoria(idCategoria: number) {
      try {
        const loginStore = useLoginStore()
        const token = loginStore.token

        const response = await fetch(`api/Categoria/${idCategoria}`, {
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
