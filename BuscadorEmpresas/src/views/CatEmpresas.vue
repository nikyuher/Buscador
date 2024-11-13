<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCategoria, fetchEmpresasById } from '../stores/Buscador';

const categoriaNombre = ref('');
const empresas = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; telefono: string; imagen: string }[]>([]);
const error = ref(false);

const recortarTexto = (texto: string, maxLongitud: number) => {
  return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
};

const fetchData = async (idCategoria: number) => {
  try {
    const response = await fetchEmpresasByCategoria(idCategoria);
    if (response && response.empresas && Array.isArray(response.empresas)) {
      categoriaNombre.value = response.categoriaNombre || 'Sin categoría';

      const empresasDetalles = await Promise.all(
        response.empresas.map(async (empresa) => {
          const detalles = await fetchEmpresasById(empresa.idEmpresa);
          return {
            idEmpresa: detalles?.idEmpresa,
            nombre: detalles?.nombre,
            descripcion: detalles?.descripcion,
            direccion: detalles?.direccion,
            telefono: detalles?.telefono,
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

onMounted(async () => {
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

<template>
  <h1 class="breadcrumb">Inicio > Categoria > {{ categoriaNombre }}</h1>
  <div class="category-enterprises-container">

    <p v-if="error" class="error-message">Hubo un error al cargar los datos.</p>

    <div v-if="!error && empresas.length" class="empresa-list">
      <div v-for="empresa in empresas" :key="empresa.idEmpresa" class="empresa-card">
        <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: empresa.idEmpresa } }">
          <div class="empresa-img-container">
            <div class="empresa-contact-info">
              <v-icon>mdi-phone</v-icon>
              <p>{{ empresa.telefono }}</p>
            </div>
            <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
          </div>
          <div class="empresa-details">
            <h3>{{ empresa.nombre }}</h3>
            <p class="empresa-address"><strong>Dirección:</strong> {{ empresa.direccion }}</p>
            <p class="empresa-description"><strong>Descripción:</strong> {{ recortarTexto(empresa.descripcion, 167) }}</p>
          </div>
        </RouterLink>
      </div>
    </div>

    <p v-else-if="!error" class="no-data">No hay empresas en esta categoría.</p>
  </div>
</template>

<style scoped>
.decorador {
  display: flex;
}

.empresa-card {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

a {
  text-decoration: none;
}

.category-enterprises-container {
  padding: 20px;
  background-color: rgb(209, 209, 209);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.breadcrumb {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.error-message,
.no-data {
  font-size: 18px;
  color: #ff4d4f;
  margin-top: 20px;
  text-align: center;
}

.empresa-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.empresa-img-container {
  width: 100%;
  text-align: center;
  margin-bottom: 15px;
}

.empresa-img {
  max-width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
}

.empresa-contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
}

.empresa-details {
  text-align: center;
  padding: 10px;
  color: #333;
}

.empresa-details h3 {
  font-size: 20px;
  color: #404fd4;
  margin-bottom: 10px;
}

.empresa-description,
.empresa-address {
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
}

.empresa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .empresa-card {
    width: 100%;
    max-width: 100%;
    padding: 15px;
  }

  .empresa-img {
    height: 120px;
  }

  .empresa-details h3 {
    font-size: 18px;
  }

  .empresa-description,
  .empresa-address {
    font-size: 13px;
  }
}
</style>
