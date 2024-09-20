<template>
  <div class="category-enterprises-container">
    <h1 v-if="!error">Empresas de la categoría: {{ categoriaNombre }}</h1>

    <p v-if="error">Hubo un error al cargar los datos.</p>

    <!-- Lista de empresas -->
    <ul v-if="!error && empresas.length">
      <li 
        v-for="empresa in empresas" 
        :key="empresa.idEmpresa" 
        @click="verDetallesEmpresa(empresa.idEmpresa)">
        <h2>{{ empresa.nombre }}</h2>
        <p>ID Empresa: {{ empresa.idEmpresa }}</p>
      </li>
    </ul>

    <p v-else-if="!error">No hay empresas para esta categoría.</p>
  </div>

  <div class="empresa-details-container" v-if="empresa">
    <h1 v-if="!error">Detalles de la Empresa: {{ empresa.nombre }}</h1>
    <p v-if="error">Hubo un error al cargar los datos.</p>

    <div v-if="empresa">
      <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img"/>
      <p><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
      <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
      <!-- <p><strong>Teléfono:</strong> {{ empresa.telefono }}</p>
      <p><strong>Email:</strong> {{ empresa.email }}</p> -->
    </div>

    <p v-else-if="!error">No se encontraron detalles de la empresa.</p>
  </div>
</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCategoria, fetchEmpresasById } from '../stores/Buscador';

// Variables reactivas
const categoriaNombre = ref(''); 
const empresas = ref<{ idEmpresa: number; nombre: string }[]>([]);
const error = ref(false);

// Detalles de una empresa seleccionada
const empresa = ref<{
  idEmpresa: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  imagen: string;
} | null>(null);

// Función para obtener detalles de una empresa por su ID
const fetchEmpresaData = async (idEmpresa: number) => {
  try {
    const data = await fetchEmpresasById(idEmpresa);
    if (data) {
      empresa.value = data;
      console.log(idEmpresa)
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos de la empresa:', err);
    error.value = true;
  }
};

// Función para cargar empresas de una categoría
const fetchData = async (idCategoria: number) => {
  try {
    const response = await fetchEmpresasByCategoria(idCategoria);

    if (response && response.empresas && Array.isArray(response.empresas)) {
      categoriaNombre.value = response.categoriaNombre || 'Sin categoría';
      empresas.value = response.empresas;
    } else {
      console.error('Respuesta no válida del servidor');
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos de empresas:', err);
    error.value = true;
  }
};

// Función para ver los detalles de una empresa específica
const verDetallesEmpresa = (idEmpresa: number) => {
  fetchEmpresaData(idEmpresa);  // Llama a la función para obtener los detalles de la empresa
  console.log(idEmpresa)
};

// Obtener parámetros de la ruta
const route = useRoute();

onMounted(() => {
  const idCategoriaParam = route.params.idCategoria;
  const idCategoria = Array.isArray(idCategoriaParam)
    ? parseInt(idCategoriaParam[0], 10)
    : parseInt(idCategoriaParam, 10);

  if (!isNaN(idCategoria)) {
    fetchData(idCategoria); // Cargar las empresas de la categoría al montar el componente
  } else {
    console.error('El idCategoria no es un número válido');
    error.value = true;
  }
});
</script>




<style scoped>
.category-enterprises-container {
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f0f0f0;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}

h2 {
  margin: 0;
  font-size: 18px;
  color: black;
}
.empresa-details-container {
  padding: 20px;
}

.empresa-img {
  max-width: 200px;
  height: auto;
  margin-bottom: 20px;
}

p {
  margin: 5px 0;
  color: black;
}
</style>