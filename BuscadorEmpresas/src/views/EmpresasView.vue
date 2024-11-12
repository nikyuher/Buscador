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
      loadingMap.value=true
      setTimeout(() => initMap(parseFloat(lat), parseFloat(lon)), 100);
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
  <div class="container">
    <h1 class="breadcrumb">Inicio &gt; Empresa &gt; {{ empresa?.nombre }}</h1>

    <div class="empresa" v-if="empresa">
      <div class="empresa-header">
        <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
        <div class="empresa-info">
          <h2>{{ empresa.nombre }}</h2>
          <p class="empresa-category">Categoría: {{  }}</p>
        </div>
      </div>

      <div class="cont">
        <div class="cont-empresa">
          <h3>Contacto</h3>
          <div class="contact-info">
            <div>
              <p><strong>Teléfono:</strong> {{ empresa.telefono }}</p>
              <p><strong>Email:</strong> {{ empresa.correoEmpresa }}</p>
              <p><strong>Sitio Web:</strong> <a :href="empresa.sitioWeb" target="_blank">{{ empresa.sitioWeb }}</a></p>
              <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
            </div>
          </div>

          <h3>Ubicación</h3>
          <div id="map" v-if="loadingMap" class="map"></div>
          <div v-else class="loading-map">
            <v-progress-circular indeterminate color="primary" class="progress-spinner" />
            <p>Cargando...</p>
          </div>

          <h3>Descripción</h3>
          <p>{{ empresa.descripcion }}</p>
        </div>

        <div class="cont-publicidad">
          <h3>Publicidad</h3>
          <!-- Espacio para publicidad -->
        </div>
      </div>
    </div>

    <div v-else-if="error" class="error-message">
      <p>Error al cargar los datos de la empresa.</p>
    </div>

    <div v-else class="loading-message">
      <p>Cargando datos...</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  color: #333;
  font-family: Arial, sans-serif;
}

.breadcrumb {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.empresa {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.empresa-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: #fff;
}

.empresa-img {
  width: 100%;
  max-height: 250px;
  object-fit: cover;
  border-radius: 8px;
}

.empresa-info {
  text-align: center;
  margin-top: 16px;
}

.empresa-category {
  font-size: 14px;
  color: #888;
}

.cont {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 16px;
}

.cont-empresa,
.cont-publicidad {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.contact-info p {
  margin: 0;
  padding: 4px 0;
}

.map {
  height: 300px;
  width: 100%;
  border-radius: 8px;
  background-color: #e0e0e0;
  margin-top: 10px;
}

.loading-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30%;
}

.progress-spinner {
  margin: 20px auto;
}

@media (min-width: 768px) {
  .cont {
    grid-template-columns: 2fr 1fr;
  }

  .empresa-header {
    flex-direction: row;
    align-items: flex-start;
    padding: 16px;
  }

  .empresa-info {
    margin-left: 20px;
    text-align: left;
  }
}

@media (max-width: 767px) {
  .container {
    padding: 10px;
  }

  .cont {
    grid-template-columns: 1fr;
  }

  .empresa-header {
    padding: 10px;
  }

  .empresa-info h2 {
    font-size: 18px;
  }
}
</style>
