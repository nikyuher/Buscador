<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router'; // Importa useRoute para acceder a los parámetros de la URL
import { useEmpresaStore } from '../stores/Empresa';
import type { Empresa } from '@/stores/Empresa';

const empresa = ref<Empresa>()

const storeEmpresa = useEmpresaStore();

const error = ref(false);

const route = useRoute();

const fetchEmpresaData = async (idEmpresa: number) => {
  try {
    await storeEmpresa.GetEmpresaId(idEmpresa);

    if (storeEmpresa.empresa) {
      empresa.value = storeEmpresa.empresa;
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos de la empresa:', err);
    error.value = true;
  }
};

// Ejecutar cuando el componente se monte
onMounted(async () => {
  const idEmpresa = parseInt(route.params.idEmpresa as string);
  if (idEmpresa) {
    fetchEmpresaData(idEmpresa);
  } else {
    error.value = true;
  }
});
</script>


<template>
  <h1>Inicio > Empresa > {{ empresa?.nombre }}</h1>
  <div class="empresa" v-if="empresa">
    <div>
      <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
    </div>
    <div class="cont">
      <div class="cont-empresa">
        <h2>{{ empresa.nombre }}</h2>
        <p><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
        <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
        <p><strong>Telefono:</strong> {{ empresa.telefono }}</p>
        <p><strong>Correo:</strong> {{ empresa.correoEmpresa }}</p>
        <p><strong>Sitio Web:</strong> {{ empresa.sitioWeb }}</p>
      </div>
      <div class="cont-publicidad">
        <p>Publicidad</p>
      </div>
    </div>

  </div>

  <div v-else-if="error">
    <p style="font-size: 20px; color: white;">Error al cargar los datos de la empresa.</p>
  </div>

  <div v-else>
    <p>Cargando datos...</p>
  </div>
</template>


<style scoped>
h1 {
  color: rgb(27, 19, 19);
  font-size: 17px;
}

.cont {
  border-radius: 10px;
  color: black;
  padding: 10px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.cont-empresa,
.cont-publicidad {
  margin: 10px;
  background-color: white;
}

.category-enterprises-container {
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.empresa {
  background-color: rgba(186, 147, 250, 0.88);
  margin: auto;
  max-width: 1140px;
}

li {
  background-color: rgb(23 6 51 / 88%);
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}

h2 {
  margin: 0;
  font-size: 20px;
  color: rgb(235, 160, 48);
}

.empresa-img {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}
</style>