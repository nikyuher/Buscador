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
  const idEmpresa = parseInt(route.params.idEmpresa as string, 10);
  if (idEmpresa) {
    fetchEmpresaData(idEmpresa);
  } else {
    error.value = true;
  }
});
</script>


<template>
  <h1>Inicio > Empresa > {{ empresa?.nombre }}</h1>
  <div class="empresa" v-if="empresa">
    <div  class="cont">
      <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img"/>
      <h2>{{ empresa.nombre }}</h2>
      <p><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
      <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
    </div>
  </div>

  <div v-else-if="error">
    <p style="font-size: 20px; color: white;">Error al cargar los datos de la empresa.</p>
  </div>

  <div v-else>
    <p>Cargando datos...</p>
  </div>
</template>


<style scoped>
h1{
  color: rgb(255, 255, 255);
}

.cont{
  background-color: white;
  border-radius: 10px;
  color: black;
  padding: 40px 40px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.category-enterprises-container {
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.empresa {
  background-color: rgb(23 6 51 / 88%);
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
  margin: 40px 0;
}

li {
  background-color: rgb(23 6 51 / 88%);
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}

h2 {
  margin: 0;
  font-size: 20px;
  color: rgb(235, 160, 48);
}

.empresa-img {
  max-width: 500px;
  height: auto;
  margin-bottom: 20px;
  margin-left: 8vh;
}

</style>