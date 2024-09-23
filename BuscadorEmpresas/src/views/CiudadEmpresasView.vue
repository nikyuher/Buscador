<template>
  <div class="empresa-container">
    <div class="empresa" v-if="empresa">
      <h1>Ciudad: {{ ciudadNombre }}</h1>
      <h2>Empresa: {{ empresa.nombre }}</h2>
      <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
      <p>Descripción: {{ empresa.descripcion }}</p>
      <p>Dirección: {{ empresa.direccion }}</p>
    </div>

    <div v-else-if="error">
      <p>Error al cargar los datos de la empresa o ciudad.</p>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </div>

    <div v-else>
      <p>Cargando datos...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasById } from '../stores/Buscador'; // Asegúrate de que la ruta es correcta

const empresa = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; imagen: string } | null>(null);
const ciudadNombre = ref(''); // Suponiendo que tendrás el nombre de la ciudad de alguna manera
const error = ref(false);
const errorMessage = ref('');
const route = useRoute();

const fetchEmpresaData = async (idEmpresa: number) => {
  try {
    const data = await fetchEmpresasById(idEmpresa);
    if (data) {
      empresa.value = data;
    } else {
      error.value = true; 
    }
  } catch (err: any) {
    console.error('Error al obtener los datos de la empresa:', err);
    errorMessage.value = err.message || 'Error desconocido';
    error.value = true;
  }
};

onMounted(() => {
  const idEmpresa = parseInt(route.params.idEmpresa as string, 10);

  if (!isNaN(idEmpresa)) {
    fetchEmpresaData(idEmpresa);
  } else {
    error.value = true; 
  }
});
</script>

<style scoped>
.empresa-container {
  padding: 20px;
}
.empresa-img {
  max-width: 100%;
  height: auto;
}
.category-enterprises-container {
    padding: 20px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  .empresa{
    background-color: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
  }
  
  li {
    background-color: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
  }
  
  h2 {
    margin: 0;
    font-size: 30px;
    margin-bottom: 3vh;
    color: black;
  }
  
  .empresa-img {
    max-width: 500px;
      height: auto;
      margin-bottom: 20px;
      margin-left: 8vh;
  }
  
  p {
    margin: 5px 0;
    font-size: 17px;
    color: black;
  }
</style>
