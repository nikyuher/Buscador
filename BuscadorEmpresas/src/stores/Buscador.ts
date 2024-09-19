interface Empresa {
  idEmpresa: number;
  nombre: string;

}

interface Ciudad {
  idCiudad: number;
  nombre: string;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
}

export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await fetch('/api/Categoria');
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Función para obtener sugerencias de empresas
export const fetchSuggestions = async (keyword: string): Promise<Empresa[]> => {
  try {
    const response = await fetch(`/api/Empresa/buscar?nombre=${encodeURIComponent(keyword)}`);
    return await response.json(); 
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

// Función para obtener sugerencias de ciudades
export const fetchCitySuggestions = async (cityName: string): Promise<Ciudad[]> => {
  try {
    const response = await fetch(`/api/Ciudad/buscar?nombre=${encodeURIComponent(cityName)}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    return [];
  }
};

// Función para buscar empresas
 export const searchEmpresas = async (keyword: string, city: string): Promise<Empresa[]> => {
   try {
     const response = await fetch(`/api/Empresa/buscar?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}`);
     return await response.json(); 
   } catch (error) {
     console.error('Error fetching empresas:', error);
     return [];   
    }
     };

     export const fetchEmpresasByCategoria = async (idCategoria: number): Promise<{ categoriaNombre: string, empresas: { idEmpresa: number; nombre: string; direccion: string; telefono: string; email: string }[] }> => {
      try {
        const response = await fetch(`/api/Categoria/${idCategoria}/empresas`);
        return await response.json(); 
      } catch (error) {
        console.error('Error fetching empresas by category:', error);
        return { categoriaNombre: '', empresas: [] }; 
      }
    };
    
