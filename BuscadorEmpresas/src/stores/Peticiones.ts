import { defineStore } from 'pinia'
import { useLoginStore } from '../stores/Login'

const loginStore = useLoginStore()

interface Peticion {
  idPeticion: number
  idUsuario: number
  nombreEmpresa: string
  datosUsuario: DatosUsuario
  descripcionEmpresa: string
  direccionEmpresa: string
  imagenEmpresaURL: string
  idCategoriaEmpresa: number
  idCiudadEmpresa: number
}

interface DatosUsuario {
  nombre: string
  correo: string
}

export const usePeticionesStore = defineStore({
  id: 'peticion',

  state: () => ({
    peticiones: [] as Peticion[],
    ciudades: [] as any[],
    categorias: [] as any[],
  }),
  actions: {
    async GetAllPeticiones() {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Peticion`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al obtener las peticiones.')
        }

        const data = await response.json()

        this.peticiones = data

        console.log('Peticiones obtenidas correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async AceptarPeticion(idPeticion: number) {
      try {
        const token = loginStore.token

        const response = await fetch(`api/Peticion/validar?peticionId=${idPeticion}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al validar la peticion.')
        }

        console.log('Peticion aceptada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async obtenerCiudades() {
      try {
        const token = loginStore.token;
        const response = await fetch(`api/Ciudad`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener las ciudades.');
        }

        this.ciudades = await response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async obtenerCategorias() {
      try {
        const token = loginStore.token;
        const response = await fetch(`api/Categoria`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener las categorías.');
        }

        this.categorias = await response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async CrearPeticion(datosPeticion: any) {
      try {
        const token = loginStore.token
        const idUsuario = loginStore.usuario?.idUsuario

        const peticion = {
          idUsuario: idUsuario,
          nombreEmpresa: datosPeticion.nombreEmpresa,
          descripcionEmpresa: datosPeticion.descripcionEmpresa,
          direccionEmpresa: datosPeticion.direccionEmpresa,
          imagenEmpresaURL: datosPeticion.imagenEmpresaURL,
          idCategoriaEmpresa: datosPeticion.idCategoriaEmpresa,
          idCiudadEmpresa: datosPeticion.idCiudadEmpresa
        };
    
        const response = await fetch(`api/Peticion`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify(peticion)
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'error al crear la petición.');
        }
    
        console.log('Petición creada correctamente');
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    async EliminarPeticion(idPeticion: number) {
      try {
        const token = loginStore.token
        const idUsuario = loginStore.usuario?.idUsuario

        const response = await fetch(`api/Peticion/${idPeticion}?idUsuario=${idUsuario}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'error al validar la peticion.')
        }

        console.log('Peticion eliminada correctamente')
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  }
})
