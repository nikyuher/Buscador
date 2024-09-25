<template>
  <h1>Inicio > Categoria > {{ categoriaNombre }}</h1>
  <div class="category-enterprises-container">
    <h1 v-if="!error">{{ categoriaNombre }}</h1>

    <p v-if="error">Hubo un error al cargar los datos.</p>

    <ul v-if="!error && empresas.length">
      <li 
        v-for="empresa in empresas" 
        :key="empresa.idEmpresa">
        <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img"/>
        <h2>{{ empresa.nombre }}</h2>
        <p>Descripción: {{ empresa.descripcion }}</p>
        <p>Dirección: {{ empresa.direccion }}</p>
      </li>
    </ul>

    <p v-else-if="!error">No hay empresas en esta categoría.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCategoria, fetchEmpresasById } from '../stores/Buscador';


const categoriaNombre = ref(''); 
const empresas = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; imagen: string }[]>([]);
const error = ref(false);

//  obtener los detalles de todas las empresas por categoría
const fetchData = async (idCategoria: number) => {
  try {
    const response = await fetchEmpresasByCategoria(idCategoria);

    if (response && response.empresas && Array.isArray(response.empresas)) {
      categoriaNombre.value = response.categoriaNombre || 'Sin categoría';

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
const route = useRoute();

onMounted(() => {
  const idCategoriaParam = route.params.idCategoria;
  const idCategoria = Array.isArray(idCategoriaParam)
    ? parseInt(idCategoriaParam[0], 10)
    : parseInt(idCategoriaParam, 10);

  if (!isNaN(idCategoria)) {
    fetchData(idCategoria); 
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
  background-color: rgb(23 6 51 / 88%);
  margin: 5px 0;
  padding: 10px;
  border-radius: 10px;
}

h2 {
  margin: 0;
  font-size: 25px;
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
