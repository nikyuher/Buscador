<template>
  <div class="category-enterprises-container">
    <h1 v-if="!error">Empresas de la categoría: {{ categoriaNombre }}</h1>

    <p v-if="error">Hubo un error al cargar los datos.</p>

    <!-- Lista de empresas -->
    <ul v-if="!error && empresas.length">
      <li v-for="empresa in empresas" :key="empresa.idEmpresa">
        <h2>{{ empresa.nombre }}</h2>
        <p>ID Empresa: {{ empresa.idEmpresa }}</p>
      </li>
    </ul>

    <p v-else-if="!error">No hay empresas para esta categoría.</p>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCategoria } from '../stores/Buscador';

// Declaración de variables reactivas
const categoriaNombre = ref(''); // Usamos ref para variables reactivas
const empresas = ref<{ idEmpresa: number; nombre: string }[]>([]); // Datos de empresas
const error = ref(false); // Manejo de error

// Obtenemos la ruta actual para acceder a los parámetros
const route = useRoute();

const fetchData = async (idCategoria: number) => {
  try {
    const response = await fetchEmpresasByCategoria(idCategoria);

    console.log('Respuesta completa del servidor:', response);

    // Verificar si la respuesta contiene datos de empresas
    if (response && response.empresas && Array.isArray(response.empresas)) {
      categoriaNombre.value = response.categoriaNombre || 'Sin categoría';
      empresas.value = response.empresas;
    } else {
      console.error('Respuesta no válida del servidor');
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos:', err);
    error.value = true;
  }
};

// `onMounted` para ejecutar la función cuando el componente se monta
onMounted(() => {
  const idCategoriaParam = route.params.idCategoria;

  const idCategoria = Array.isArray(idCategoriaParam)
    ? parseInt(idCategoriaParam[0], 10)
    : parseInt(idCategoriaParam, 10);

  if (isNaN(idCategoria)) {
    console.error('El idCategoria no es un número válido');
    error.value = true;
    return;
  }

  fetchData(idCategoria); // Llamada a la función fetch cuando el componente se monta
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

p {
  margin: 5px 0;
  color: black;
}
</style>