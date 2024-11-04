<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useEmpresaStore } from '../stores/Empresa';
import L from 'leaflet';
import type { Empresa } from '@/stores/Empresa';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const empresa = ref<Empresa>();
const storeEmpresa = useEmpresaStore();
const error = ref(false);
const route = useRoute();
let map: L.Map;
const loadingMap = ref(false);

const fetchEmpresaData = async (idEmpresa: number) => {
  try {
    await storeEmpresa.GetEmpresaId(idEmpresa);
    if (storeEmpresa.empresa) {
      empresa.value = storeEmpresa.empresa;
      await fetchCoordinates(empresa.value.direccion);
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener los datos de la empresa:', err);
    error.value = true;
  }
};

const fetchCoordinates = async (address: string) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      initMap(parseFloat(lat), parseFloat(lon));
    } else {
      console.error('No se encontraron coordenadas para la dirección proporcionada.');
      error.value = true;
    }
  } catch (err) {
    console.error('Error al obtener las coordenadas:', err);
    error.value = true;
  }
};

const initMap = (lat: number, lon: number) => {
  if (map) {
    map.off();
    map.remove();
  }

  map = L.map('map').setView([lat, lon], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  })
    .on('tileerror', (error) => {
      console.error('Error cargando el tile:', error);
    })
    .addTo(map);
    if (empresa.value) {
      L.marker([lat, lon])
      .addTo(map)
      .bindPopup(empresa.value.nombre)
      .openPopup();
    }
    map.invalidateSize();
    loadingMap.value = true;
};

// Ejecutar cuando el componente se monte
onMounted(async () => {
  const idEmpresa = parseInt(route.params.idEmpresa as string);
  if (idEmpresa) {
    await fetchEmpresaData(idEmpresa);
  } else {
    error.value = true;
  }
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 500);
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
        <p>Categoria: Categoria</p>

        <p>Datos de contacto de {{ empresa.nombre }}</p>
        <div class="cont-datos">
          <div class="div-1">
            <p>Teléfono:</p>
            <p>Email:</p>
            <p>Sitio Web:</p>
            <p>Dirección</p>
          </div>
          <div>
            <p>{{ empresa.telefono }}</p>
            <p>{{ empresa.correoEmpresa }}</p>
            <a :href="empresa.sitioWeb" target="_blank">{{ empresa.sitioWeb }}</a>
            <p>{{ empresa.direccion }}</p>
          </div>
        </div>
        <div id="map" v-if="loadingMap"></div>
        <div v-else="!loadingMap"
          style="height: 400px;width: 100%;align-items: center;text-align: center;padding-top: 30%;">
          <v-progress-circular indeterminate color="primary" style="margin: 20px auto;" />
        </div>
        <div class="box">
          <p>Descripción</p>
        </div>
        <p>{{ empresa.descripcion }}</p>
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
#map {
  height: 400px;
  width: 100%;
  background-color: #e0e0e0;
}

.cont-datos {
  display: flex;
}

.div-1 {
  width: 160px;
}

.box {
  width: 120px;
  text-align: center;
  color: rgb(0, 0, 0);
  background-color: rgb(215, 216, 205);
}

h1 {
  color: rgb(27, 19, 19);
  font-size: 17px;
}

.cont {
  border-radius: 10px;
  color: black;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.cont-empresa,
.cont-publicidad {
  background-color: white;
  padding: 10px;
  width: 98%;
  margin-top: 20px;
}

.category-enterprises-container {
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

.empresa {
  background-color: rgba(240, 240, 240, 0.88);
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