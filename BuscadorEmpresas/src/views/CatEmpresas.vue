<template>
  <h1>Inicio > Categoria > {{ categoriaNombre }}</h1>
  <div class="category-enterprises-container">

    <p v-if="error">Hubo un error al cargar los datos.</p>

    <ul v-if="!error && empresas.length">
      <li v-for="empresa in empresas" :key="empresa.idEmpresa">
        <div class="Datos">
          <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
          <h2>{{ empresa.nombre }}</h2>
          <p><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
          <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
        </div>
      </li>
    </ul>

    <p v-else-if="!error" style="font-size: 20px; color: white;">No hay empresas en esta categoría.</p>
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
            idEmpresa: detalles?.idEmpresa,
            nombre: detalles?.nombre,
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

.Datos{
  background-color: white;
  border-radius: 10px;
  padding: 40px 40px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.Datos p {
  font-size: 17px;
}

.Datos h2{
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
  border-radius: 10px;
}

h1{
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
  color: rgb(0, 0, 0);
}
</style>
