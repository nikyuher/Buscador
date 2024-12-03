<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCategoria, fetchEmpresasById } from '../stores/Buscador';

const categoriaNombre = ref('');
const empresas = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; telefono: string; imagen: string }[]>([]);
const error = ref(false);

const nombreBusqueda = ref('')
const empresaFiltradas = computed(() => {
  return empresas.value.filter(empresa => empresa.nombre.toLowerCase().includes(nombreBusqueda.value.toLowerCase()))
})

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
  <div class="category-enterprises-container">
    <h1 class="breadcrumb">Inicio > Categoria > {{ categoriaNombre }}</h1>
    <div style="background-color: rgb(209, 209, 209); padding: 30px;">
      <div style="display: flex; justify-content: space-between">
        <h2 style="font-size: 30px">Empresas en {{ categoriaNombre }}:</h2>
        <div>
          <input v-model="nombreBusqueda" type="search" placeholder="Buscar...">
        </div>
      </div>

      <p v-if="error" class="error-message">Hubo un error al cargar los datos.</p>
      <div v-if="!error && empresas.length" class="empresa-list">
        <div v-for="empresa in empresaFiltradas" :key="empresa.idEmpresa">
          <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: empresa.idEmpresa } }" class="empresa-card">
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
              <p class="empresa-description"><strong>Descripción:</strong> {{ recortarTexto(empresa.descripcion, 167) }}
              </p>
            </div>
          </RouterLink>
        </div>
      </div>

      <p v-else-if="!error" style="margin: auto">No hay empresas en esta categoría.</p>
    </div>
  </div>
</template>

<style scoped>
input[type="search"] {
  color: black;
  padding: 5px;
  border: 1px solid #fff;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px black;
  outline: none;
}

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
  width: 60%;
  padding: 20px;
  margin: 150px auto;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.breadcrumb {
  font-size: 17px;
  color: rgb(245, 167, 51);
  text-shadow:
    -1px -1px 2px black,
    -1px 1px 2px black,
    1px -1px 2px black;
}

.error-message,
.no-data {
  font-size: 18px;
  color: #ff4d4f;
  margin-top: 20px;
  text-align: center;
}

.empresa-list {
  width: 100%;
}

.empresa-img-container {
  width: 190px;
  text-align: center;
}

.empresa-img {
  max-width: 100%;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.empresa-contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000000;
  font-size: 14px;
  margin-bottom: 10px;
}

.empresa-details {
  text-align: left;
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
  color: #000000;
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
