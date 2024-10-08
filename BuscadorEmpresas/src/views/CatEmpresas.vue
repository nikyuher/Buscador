<template>
  <h1 class="breadcrumb">Inicio > Categoria > {{ categoriaNombre }}</h1>
  <div class="category-enterprises-container">

    <p v-if="error" class="error-message">Hubo un error al cargar los datos.</p>

    <div v-if="!error && empresas.length" class="empresa-list">
      <div v-for="empresa in empresas" :key="empresa.idEmpresa" class="empresa-card">
        <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
        <div class="empresa-details">
          <h2>{{ empresa.nombre }}</h2>
          <p class="empresa-description"><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
          <p class="empresa-address"><strong>Dirección:</strong> {{ empresa.direccion }}</p>
        </div>
      </div>
    </div>

    <p v-else-if="!error" class="no-data">No hay empresas en esta categoría.</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCategoria, fetchEmpresasById } from '../stores/Buscador';

const categoriaNombre = ref('');
const empresas = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; imagen: string }[]>([]);
const error = ref(false);

// Obtener los detalles de todas las empresas por categoría
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
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 15px;
}


p {
  margin: 5px 0;
  color: rgb(0, 0, 0);
}

.breadcrumb {
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 20px;
}

.category-enterprises-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.error-message,
.no-data {
  font-size: 18px;
  color: #ff4d4f;
  margin-top: 20px;
}

.empresa-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.empresa-card {
  background-color: #682828;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.empresa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.empresa-img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  margin-bottom: 15px;
}

.empresa-details {
  text-align: center;
}

.empresa-details h2 {
  font-size: 22px;
  color: #ffffff;
  margin-bottom: 10px;
}

.empresa-description,
.empresa-address {
  font-size: 16px;
  color: #ffffff;
  margin-bottom: 8px;
}

.empresa-address {
  font-weight: bold;
  color: #ffffff;
}
</style>
