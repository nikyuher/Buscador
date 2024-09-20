<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'; // Importa useRoute para acceder a los parámetros de la URL
import { fetchEmpresasById } from '../stores/Buscador';

const empresa = ref<{
  idEmpresa: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  imagen: string;
} | null>(null);

const error = ref(false);

const route = useRoute(); // Accede a la ruta actual para obtener los parámetros

// Función para obtener detalles de una empresa por su ID
const fetchEmpresaData = async (idEmpresa: number) => {
  try {
    const data = await fetchEmpresasById(idEmpresa);
    if (data) {
      empresa.value = data;
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos de la empresa:', err);
    error.value = true;
  }
};

// Ejecutar cuando el componente se monte
onMounted(() => {
  const idEmpresa = parseInt(route.params.idEmpresa as string, 10); // Extraer idEmpresa de la ruta
  if (idEmpresa) {
    fetchEmpresaData(idEmpresa);
  } else {
    error.value = true;
  }
});
</script>


<template>
    <div v-if="empresa">
      <h1>{{ empresa.nombre }}</h1>
      <img :src="empresa.imagen" alt="Imagen de la empresa" />
      <p><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
      <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
    </div>
  
    <div v-else-if="error">
      <p>Error al cargar los datos de la empresa.</p>
    </div>
  
    <div v-else>
      <p>Cargando datos...</p>
    </div>
  </template>
  

<style scoped>

</style>