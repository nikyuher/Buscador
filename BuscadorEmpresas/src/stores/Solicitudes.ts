import { defineStore } from 'pinia';

interface Peticion {
    idUsuario: number;
    nombreEmpresa: string;
    descripcionEmpresa: string;
    direccionEmpresa: string;
    imagenEmpresaURL: string;
    idCategoriaEmpresa: number;
    idCiudadEmpresa: number;
}

export const usePeticionesStore = defineStore({
  id: 'peticion',

  state: () => ({
    peticiones: [] as Peticion[],
    error: null as string | null,
    success: false
  }),

  actions: {
    // Método para obtener todas las peticiones
    async GetAllPeticiones(token: string) {
      try {
        const response = await fetch(`/api/Peticion`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al obtener las peticiones.');
        }

        const data = await response.json();
        this.peticiones = data;

        console.log('Peticiones obtenidas correctamente');
      } catch (error: any) {
        this.error = error.message;
        console.error(error);
      }
    },

    // Método para crear una nueva petición (POST)
    async createPeticion(token: string, nuevaPeticion: Omit<Peticion, 'id'>) {
      try {
        const response = await fetch(`/api/Peticion`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(nuevaPeticion),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al crear la petición.');
        }

        const createdPeticion = await response.json();
        this.peticiones.push(createdPeticion); // Añadir la petición creada al estado

        this.success = true;
        console.log('Petición creada correctamente');
      } catch (error: any) {
        this.error = error.message;
        this.success = false;
        console.error(error);
      }
    }
  }
});
