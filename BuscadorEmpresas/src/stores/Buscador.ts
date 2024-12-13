import BaseUrl from '@/stores/BaseUrl'

const UrlApi = BaseUrl.baseUrl

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
    const response = await fetch(`${UrlApi}/Categoria`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Función para obtener sugerencias de empresas
export const fetchSuggestions = async (keyword: string): Promise<Empresa[]> => {
  try {
    const response = await fetch(`${UrlApi}/Empresa/buscar?nombre=${encodeURIComponent(keyword)}`)
    return await response.json()
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return []
  }
}

// Función para obtener sugerencias de ciudades
export const fetchCitySuggestions = async (cityName: string): Promise<Ciudad[]> => {
  try {
    const response = await fetch(`${UrlApi}/Ciudad/buscar?nombre=${encodeURIComponent(cityName)}`)
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
      `${UrlApi}/Empresa/buscar?keyword=${encodeURIComponent(keyword)}&city=${encodeURIComponent(city)}`
    )
    return await response.json()
  } catch (error) {
    console.error('Error fetching empresas:', error)
    return []
  }
}

export const fetchEmpresasByCategoria = async (
  idCategoria: number
): Promise<{ categoriaNombre: string; empresas: { idEmpresa: number; nombre: string }[] }> => {
  try {
    const response = await fetch(`${UrlApi}/Categoria/${idCategoria}/empresas`)
    if (!response.ok) {
      throw new Error(`Error al obtener empresas por categoría: ${response.statusText}`)
    }

    const data = await response.json()

    // Mapea los datos según la estructura que esperas
    return {
      categoriaNombre: data.nombre,
      empresas: data.empresaCategorias.map((empresaCategoria: any) => ({
        idEmpresa: empresaCategoria.empresa.idEmpresa,
        nombre: empresaCategoria.empresa.nombre
      }))
    }
  } catch (error) {
    console.error('Error fetching empresas by category:', error)
    return { categoriaNombre: '', empresas: [] }
  }
}

export const fetchEmpresasById = async (idEmpresa: number) => {
  try {
    const response = await fetch(`${UrlApi}/Empresa/${idEmpresa}`)
    if (!response.ok) {
      throw new Error(`Error al obtener el id de las empresas: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      idEmpresa: data.idEmpresa,
      nombre: data.nombre,
      descripcion: data.descripcion,
      direccion: data.direccion,
      telefono: data.telefono,
      imagen: data.imagen
    }
  } catch (error) {
    console.error('Error fetching empresa:', error)
    return null
  }
}

export const fetchCiudadById = async (idCiudad: number) => {
  try {
    const response = await fetch(`${UrlApi}/Ciudad/${idCiudad}`)
    if (!response.ok) {
      throw new Error(`Error al obtener los detalles de la ciudad: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      idCiudad: data.idCiudad,
      nombre: data.nombre
    }
  } catch (error) {
    console.error('Error fetching city:', error)
    return null
  }
}

// Función para obtener las empresas por ID de ciudad
export const fetchEmpresasByCiudad = async (idCiudad: number) => {
  try {
    const response = await fetch(`${UrlApi}/Ciudad/${idCiudad}/empresas`)
    if (!response.ok) {
      throw new Error(`Error al obtener empresas por ciudad: ${response.statusText}`)
    }
    const data = await response.json()

    return {
      idCiudad: data.idCiudad,
      nombre: data.nombre,
      empresas:
        data.empresasCiudades.map((empresaCiudad: any) => ({
          idEmpresa: empresaCiudad.empresa.idEmpresa,
          nombre: empresaCiudad.empresa.nombre
        })) || [] // Manejar el caso donde 'empresasCiudades' podría ser undefined
    }
  } catch (error) {
    console.error('Error fetching empresas by ciudad:', error)
    return null
  }
}

// Función para obtener la empresa por ID de ciudad y empresa
export const fetchEmpresaByCiudad = async (idEmpresa: number, idCiudad: number) => {
  try {
    const response = await fetch(`${UrlApi}/Ciudad/empresa?idEmpresa=${idEmpresa}&idCiudad=${idCiudad}`)
    if (!response.ok) {
      const errorData = await response.json() // Obtener el mensaje de error de la respuesta
      throw new Error(errorData.message || 'Error desconocido') // Usa el mensaje de error o un mensaje genérico
    }

    const data = await response.json()

    return {
      idCiudad: data.idCiudad,
      ciudadNombre: data.nombre,
      empresa:
        data.empresasCiudades.length > 0
          ? {
              idEmpresa: data.empresasCiudades[0].empresa.idEmpresa,
              nombre: data.empresasCiudades[0].empresa.nombre
            }
          : null // Manejar el caso donde no haya empresas en esa ciudad
    }
  } catch (error) {
    console.error('Error fetching empresa by ciudad:', error)
    throw error // Propagar el error para manejarlo en el componente
  }
}
