<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCiudad, fetchEmpresasById } from '@/stores/Buscador'; // Importamos ambas funciones

// Definir los estados
const ciudadNombre = ref('');
const empresas = ref<{ idEmpresa: number; nombre: string; descripcion: string; telefono: string; direccion: string; imagen: string }[]>([]);
const error = ref(false);

const nombreBusqueda = ref('')
const empresaFiltradas = computed(() => {
  return empresas.value.filter(empresa => empresa.nombre.toLowerCase().includes(nombreBusqueda.value.toLowerCase()))
})


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

// Usar el route para obtener el idCiudad
const route = useRoute();

const recortarTexto = (texto: string, maxLongitud: number) => {
  return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
};

onMounted(async () => {
  const idCiudadParam = route.params.idCiudad;
  const idCiudad = Array.isArray(idCiudadParam)
    ? parseInt(idCiudadParam[0], 10)
    : parseInt(idCiudadParam, 10);

  if (!isNaN(idCiudad)) {
    await fetchCiudadData(idCiudad);
  } else {
    console.error('El idCiudad no es un número válido');
    error.value = true;
  }
});
</script>

<template>
  <div class="category-enterprises-container">
    <h1 class="breadcrumb">Inicio > Ciudad > {{ ciudadNombre }}</h1>
    <div style="background-color: #387676; border-radius: 15px; padding: 30px;">
      <div v-if="!error">
        <div v-if="empresas.length > 0" class="empresa-list">

          <div style="display: flex; justify-content: space-between">
            <h2 style="font-size: 30px">Empresas en {{ ciudadNombre }}:</h2>
            <div>
              <input v-model="nombreBusqueda" type="search" placeholder="Buscar...">
            </div>
          </div>

          <div v-for="empresa in empresaFiltradas" :key="empresa.idEmpresa">
            <router-link :to="{ name: 'Empresa', params: { idEmpresa: empresa.idEmpresa } }" class="empresa-card">
              <div class="cont-img-tef">
                <div class="empresa-contact-info ">
                  <v-icon>mdi-phone</v-icon>
                  <p>{{ empresa.telefono }}</p>
                </div>
                <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
              </div>
              <div class="empresa-details">
                <h3>{{ empresa.nombre }}</h3>
                <p class="empresa-address"><strong>Dirección:</strong> {{ empresa.direccion }}</p>
                <p class="empresa-description"> <strong>Descripción</strong> {{ recortarTexto(empresa.descripcion, 167)
                  }}
                </p>
              </div>
            </router-link>
          </div>
          <div v-if="empresaFiltradas.length == 0" style="text-align: center;padding: 40px;">
            <p>No hay empresas con el nombre que buscas</p>
        </div>
        </div>

        <p style="text-align: center;padding: 40px;" v-else>No hay empresas registradas en esta ciudad.</p>
      </div>

      <div v-else-if="error">
        <p style="font-size: 20px; color: white;">Error al cargar los datos de la ciudad y sus empresas.</p>
      </div>

      <div v-else>
        <p>Cargando datos...</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
input[type="search"] {
  color: black;
  padding: 8px;
  margin-right: 5vh;
  border: 1px solid #fff;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 5px black;
  outline: none;
}
h2{
  color: white;
  margin-bottom: 2vh;
  margin-left: 2vh;
}

.decorador {
  display: flex;
}

.cont-img-tef {
  width: 190px;
  text-align: center;
}

.empresa-card {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
  margin: 5px;
  display: flex;
  align-items: center;
  transition: transform 0.2s, box-shadow 0.2s;
}

.empresa-contact-info {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #000000;
  font-size: 14px;
  margin-bottom: 10px;
}

a {
  text-decoration: none;
}

.Datos {
  background-color: rgb(0, 0, 0);
  border-radius: 10px;
  padding: 40px 40px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.Datos p {
  font-size: 17px;
}

.Datos h2 {
  color: rgb(235, 160, 48);
}

.category-enterprises-container {
  width: 60%;
  padding: 20px;
  margin: 50px auto;
  flex-direction: column;
  align-items: center;
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

p {
  margin: 5px 0;
  color: rgb(0, 0, 0);
}

.breadcrumb {
  font-size: 19px;
  margin-bottom: 2vh;
  margin-left: 4vh;
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
}

.empresa-list {
  width: 100%;

}


.empresa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.empresa-img {
  max-width: 200px;
  height: 100px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.empresa-details {
  text-align: justify;
  padding: 20px;
  width: 80%;
  margin-left: 2vh;
}

.empresa-details h3 {
  font-size: 18px;
  color: #404fd4;
  margin-bottom: 10px;
}

.empresa-description,
.empresa-address {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 16px;
  color: #000000;
  margin-bottom: 8px;
}

.empresa-address {
  color: #000000;
}
</style>