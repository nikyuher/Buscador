<template>
  <h1>Inicio > Ciudad > {{ ciudadNombre }}</h1>
  <div v-if="!error">

    <h2 style="font-size: 30px">Empresas en {{ ciudadNombre }}:</h2>

    <ul v-if="empresas.length > 0">
      <li v-for="empresa in empresas" :key="empresa.idEmpresa">
        <div class="cont">
          <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
          <h2>{{ empresa.nombre }}</h2>
          <p> <strong>Descripción</strong> {{ empresa.descripcion }}</p>
          <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
        </div>
      </li>
    </ul>

    <p v-else>No hay empresas registradas en esta ciudad.</p>
  </div>

  <div v-else-if="error">
    <p style="font-size: 20px; color: white;">Error al cargar los datos de la ciudad y sus empresas.</p>
  </div>

  <div v-else>
    <p>Cargando datos...</p>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCiudad, fetchEmpresasById } from '../stores/Buscador'; // Importamos ambas funciones

// Definir los estados
const ciudadNombre = ref('');
const empresas = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; imagen: string }[]>([]);
const error = ref(false);

// Función para obtener los datos de la ciudad y sus empresas
const fetchCiudadData = async (idCiudad: number) => {
  try {
    const response = await fetchEmpresasByCiudad(idCiudad);

    if (response && response.empresas && Array.isArray(response.empresas)) {
      ciudadNombre.value = response.nombre || 'Sin nombre';

      // Mapear cada empresa y obtener sus detalles
      const empresasDetalles = await Promise.all(
        response.empresas.map(async (empresa) => {
          const detalles = await fetchEmpresasById(empresa.idEmpresa);
          return {
            idEmpresa: empresa.idEmpresa,
            nombre: empresa.nombre,
            descripcion: detalles?.descripcion,
            direccion: detalles?.direccion,
            imagen: detalles?.imagen,
          };
        })
      );

      empresas.value = empresasDetalles;
    } else {
      console.error('Respuesta no válida del servidor');
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos de empresas:', err);
    error.value = true;
  }
};

// Usar el route para obtener el idCiudad
const route = useRoute();

onMounted(() => {
  const idCiudadParam = route.params.idCiudad;
  const idCiudad = Array.isArray(idCiudadParam)
    ? parseInt(idCiudadParam[0], 10)
    : parseInt(idCiudadParam, 10);

  if (!isNaN(idCiudad)) {
    fetchCiudadData(idCiudad);
  } else {
    console.error('El idCiudad no es un número válido');
    error.value = true;
  }
});
</script>


<style scoped>
.cont {
  background-color: white;
  border-radius: 10px;
  padding: 40px 40px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.cont p {
  font-size: 17px;
  color: black;
}

.cont h2 {
  color: rgb(235, 160, 48);
}

.category-enterprises-container {
  padding: 20px;
  
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: rgb(23 6 51 / 88%);
  margin: 30px;
  padding: 10px;
  border-radius: 5px;
}

h2 {
  margin: 0;
  font-size: 20px;
  color: rgb(255, 255, 255);
}

h1 {
  color: rgb(255, 255, 255);
}

.empresa-img {
  max-width: 500px;
  height: auto;
  margin-bottom: 20px;
  margin-left: 8vh;
}

p {
  margin: 5px 0;
  color: rgb(255, 255, 255);
}
</style>