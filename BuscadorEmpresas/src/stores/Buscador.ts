interface Empresa {
  idEmpresa: number
  nombre: string
}

interface Ciudad {
  idCiudad: number
  nombre: string
}

interface Categoria {
  idCategoria: number
  nombre: string
}

export const fetchCategorias = async (): Promise<Categoria[]> => {
  try {
    const response = await fetch('/api/Categoria')
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Función para obtener sugerencias de empresas
export const fetchSuggestions = async (keyword: string): Promise<Empresa[]> => {
  try {
    const response = await fetch(`/api/Empresa/buscar?nombre=${encodeURIComponent(keyword)}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }
}

// Función para obtener sugerencias de ciudades
export const fetchCitySuggestions = async (cityName: string): Promise<Ciudad[]> => {
  try {
    const response = await fetch(`/api/Ciudad/buscar?nombre=${encodeURIComponent(cityName)}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching city suggestions:', error)
    return []
  }
}

// Función para buscar empresas
export const searchEmpresas = async (keyword: string, city: string): Promise<Empresa[]> => {
  try {
    const response = await fetch(
      `/api/Empresa/buscar?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching empresas:', error)
    return []
  }
}

export const fetchEmpresasByCategoria = async (idCategoria: number): Promise<{ categoriaNombre: string, empresas: { idEmpresa: number; nombre: string }[] }> => {
  try {
    const response = await fetch(`/api/Categoria/${idCategoria}/empresas`);
    if (!response.ok) {
      throw new Error(`Error al obtener empresas por categoría: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Respuesta completa del servidor:', data);

    // Mapea los datos según la estructura que esperas
    return {
      categoriaNombre: data.nombre,  // Ajusta el nombre de la categoría
      empresas: data.empresaCategorias.map((empresaCategoria: any) => ({
        idEmpresa: empresaCategoria.empresa.idEmpresa,
        nombre: empresaCategoria.empresa.nombre
      }))
    };
  } catch (error) {
    console.error('Error fetching empresas by category:', error);
    return { categoriaNombre: '', empresas: [] }; 
  }
};

export const fetchEmpresasById = async (idEmpresa: number) => {
  try{
    const response = await fetch(`/api/Empresa/${idEmpresa}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el id de las empresas: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Respuesta completa del servidor:', data);
    return {
      idEmpresa: data.idEmpresa,
      nombre: data.nombre,
      descripcion: data.descripcion,
      direccion: data.direccion,
      imagen: data.imagen,
      //telefono: data.telefono || 'No disponible',
      //email: data.email || 'No disponible'
    };
  } catch (error) {
    console.error('Error fetching empresa:', error);
    return null; 
  }
};

export const fetchCiudadById = async (idCiudad: number) => {
  try {
    const response = await fetch(`/api/Ciudad/${idCiudad}`);
    if (!response.ok) {
      throw new Error(`Error al obtener los detalles de la ciudad: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('Respuesta completa del servidor (Ciudad):', data);
    return {
      idCiudad: data.idCiudad,
      nombre: data.nombre,
    };
  } catch (error) {
    console.error('Error fetching city:', error);
    return null;
  }
};

// Función para obtener las empresas por ID de ciudad
export const fetchEmpresasByCiudad = async (idCiudad: number) => {
  try {
      const response = await fetch(`/api/Ciudad/${idCiudad}/empresas`);
      if (!response.ok) {
          throw new Error(`Error al obtener empresas por ciudad: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Respuesta completa del servidor (Empresas por Ciudad):', data);
      
      return {
          idCiudad: data.idCiudad,
          nombre: data.nombre,
          empresas: data.empresasCiudades.map((empresaCiudad: any) => ({
              idEmpresa: empresaCiudad.empresa.idEmpresa,
              nombre: empresaCiudad.empresa.nombre,
          })) || [] // Manejar el caso donde 'empresasCiudades' podría ser undefined
      };
  } catch (error) {
      console.error('Error fetching empresas by ciudad:', error);
      return null; 
  }
};


