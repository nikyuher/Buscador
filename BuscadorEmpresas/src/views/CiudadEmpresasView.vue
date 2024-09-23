<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresaByCiudad } from '../stores/Buscador'; // Importa la función adecuada

// Definir los estados
const ciudad = ref<{ idCiudad: number; ciudadNombre: string; empresa: { idEmpresa: number; nombre: string } | null } | null>(null);
const error = ref(false);

const route = useRoute(); // Obtener los parámetros de la ruta

// Función para obtener los datos de la empresa por ciudad
const fetchEmpresaData = async (idEmpresa: number, idCiudad: number) => {
  try {
    const data = await fetchEmpresaByCiudad(idEmpresa, idCiudad);
    console.log("Datos obtenidos de la API:", data);
    if (data) {
      ciudad.value = data;
    } else {
      error.value = true; // Marca error si no hay datos
    }
  } catch (err: any) {
  console.error('Error al obtener los datos de la empresa por ciudad:', err);

  errorMessage.value = err.message || 'Error desconocido';
  error.value = true;
}
};

const errorMessage = ref('');

// Ejecutar cuando el componente se monte
onMounted(() => {
  const idCiudad = parseInt(route.params.idCiudad as string, 10); // Obtener idCiudad desde la URL
  const idEmpresa = parseInt(route.params.idEmpresa as string, 10); // Obtener idEmpresa desde la URL

  console.log("ID de la ciudad y empresa obtenidas de la URL:", idCiudad, idEmpresa); // Verificar si obtenemos la ID correctamente

  if (!isNaN(idCiudad) && !isNaN(idEmpresa)) {
    fetchEmpresaData(idEmpresa, idCiudad); // Llama a la función para obtener los datos
  } else {
    error.value = true; 
  }
});
</script>

<template>
    <div v-if="ciudad">
      <h1>Ciudad: {{ ciudad.ciudadNombre }}</h1>
      <h2>Empresa: {{ ciudad.empresa?.nombre }}</h2>
    </div>
  
    <div v-else-if="error">
      <p>Error al cargar los datos de la empresa o ciudad.</p>
      <p v-if="errorMessage">{{ errorMessage }}</p> <!-- Mostrar el mensaje de error -->
    </div>
  
    <div v-else>
      <p>Cargando datos...</p>
    </div>
  </template>
  
