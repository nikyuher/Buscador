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
    <h1>
      <RouterLink to="/" class="breadcrumb">
        Inicio > Categoria > {{ categoriaNombre }}
      </RouterLink>
    </h1>
    <div class="empresa_container" style="padding: 30px;">
      <div class="empresa-filter">
        <h2>Empresas en {{ categoriaNombre }}:</h2>
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
        <div v-if="empresaFiltradas.length == 0" style="text-align: center;padding: 40px; color: white;">
          <p>No hay empresas con el nombre que buscas</p>
        </div>
      </div>
      <div v-else-if="!error" style="text-align: center;">
        <p style=" color: white;">No hay empresas en esta categoría.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="search"] {
  color: black;
  padding: 9px;
  border: 1px solid #fff;
  margin-right: 12vh;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px black;
  outline: none;
}

.decorador {
  display: flex;
}
.empresa-filter{
  display: flex; 
  justify-content: space-between;
}

.empresa-card {
  background-color: #ffffff;
  margin-bottom: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

h2 {
  color: white;
  margin-bottom: 2vh;
  font-size: 30px;
}

a {
  text-decoration: none;
}

.empresa_container {
  background-color: #387676;
  border-radius: 15px;
}

.category-enterprises-container {
  width: 60%;
  padding: 10px 0 250px 0;
  margin: auto;
  flex-direction: column;
  align-items: center;
}

.breadcrumb {
  font-size: 18px;
  color: #ff9900;
  margin: 2vh;
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
  height: 130px;
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
  margin-left: 3vh;
  width: 80%;
}

.empresa-details h3 {
  font-size: 20px;
  color: #ff4d4f;
  margin-bottom: 10px;
}

.empresa-description,
.empresa-address {
  font-size: 14px;
  color: #000000;
  margin-bottom: 8px;
  word-break: break-word;
}

.empresa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 900px) {
  .category-enterprises-container {
    width: 90%;
    padding: 10px 20px;
    margin-bottom: 5vh;
  }
  .breadcrumb{
        font-size: medium;
  }

  .empresa-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
    margin-bottom: 15px;
  }

  h2{
    text-align: center;
    font-size: 25px;
  }

  .empresa-img {
    max-width: 165px;
    max-height: 110px;
    border-radius: 10px;
  }

  .empresa-filter{
  display: flex; 
  flex-direction: column;
}

  .empresa-details {
    padding: 0;
    margin-top: 10px;
  }

  .empresa-details h3 {
    font-size: 16px;
    color: #ff4d4f;
  }

  .empresa-description,
  .empresa-address {
    font-size: 12px;
    color: #333;
    word-break: break-word;
    margin-bottom: 10px;
  }

  input[type="search"] {
    margin: 10px auto;
    width: 100%;
    padding: 8px;
    font-size: 14px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    border: 1px solid #ccc;
    border-radius: 5px;
  }

}

</style>
