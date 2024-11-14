<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresaByCiudad, fetchCiudadById, fetchEmpresasById } from '../stores/Buscador';

// Definir los estados
const ciudad = ref<{ idCiudad: number; ciudadNombre: string; empresa: { idEmpresa: number; nombre: string } | null } | null>(null);
const empresa = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; telefono: string; imagen: string; } | null>(null);
const error = ref(false);
const nombreCiudadError = ref('');
const mensajeError = ref('');
const route = useRoute();

const recortarTexto = (texto: string, maxLongitud: number) => {
    return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
};

// Función para obtener los datos de la empresa por ciudad
const fetchEmpresaCiudadData = async (idEmpresa: number, idCiudad: number) => {
    try {
        const data = await fetchEmpresaByCiudad(idEmpresa, idCiudad);
        if (data) {
            ciudad.value = data;
            fetchEmpresaData(idEmpresa);
        } else {
            error.value = true;
        }
    } catch (err: any) {
        console.error('Error al obtener los datos de la empresa por ciudad:', err);
        fetchEmpresaData(idEmpresa);
        fetchCiudadData(idCiudad);
        mensajeError.value = `No hay ninguna empresa de ${empresa.value?.nombre} en ${ciudad.value?.ciudadNombre}</p>`;
        error.value = true;
    }
};

// Función para obtener los detalles de la empresa por su ID
const fetchEmpresaData = async (idEmpresa: number) => {
    try {
        const data = await fetchEmpresasById(idEmpresa);
        if (data) {
            empresa.value = data;
        } else {
            error.value = true;
        }
    } catch (err) {
        console.error('Error al obtener los datos de la empresa:', err);
        error.value = true;
    }
};

const fetchCiudadData = async (idCiudad: number) => {
    try {
        const data = await fetchCiudadById(idCiudad);
        if (data) {
            nombreCiudadError.value = data.nombre;
        } else {
            error.value = true;
        }
    } catch (err) {
        console.error('Error al obtener los datos de la ciudad:', err);
        error.value = true;
    }
};

// Ejecutar cuando el componente se monte
onMounted(() => {
    const idCiudad = parseInt(route.params.idCiudad as string, 10);
    const idEmpresa = parseInt(route.params.idEmpresa as string, 10);

    console.log("ID de la ciudad y empresa obtenidas de la URL:", idCiudad, idEmpresa);

    if (!isNaN(idCiudad) && !isNaN(idEmpresa)) {
        fetchEmpresaCiudadData(idEmpresa, idCiudad);
    } else {
        error.value = true;
    }
});
</script>

<template>
    <div class="breadcrumb">
      <h1>Inicio > Empresa > {{ empresa?.nombre }}</h1>
    </div>
  
    <div class="category-enterprises-container">
      <div v-if="ciudad" class="empresa-card">
        <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: empresa?.idEmpresa } }" class="empresa-link">
          <div class="empresa-card-content">
            <div class="cont-img-tef">
              <img :src="empresa?.imagen" alt="Imagen de la empresa" class="empresa-img" />
              <div class="empresa-contact">
                <v-icon>mdi-phone</v-icon>
                <span>{{ empresa?.telefono }}</span>
              </div>
            </div>
  
            <div class="empresa-details">
              <h3 class="empresa-title">{{ empresa?.nombre }}</h3>
              <h4 class="empresa-city">Ciudad: {{ ciudad?.ciudadNombre }}</h4>
              <p class="empresa-address"><strong>Dirección:</strong> {{ empresa?.direccion }}</p>
              <p class="empresa-description"><strong>Descripción:</strong> {{ empresa?.descripcion }}</p>
            </div>
          </div>
        </RouterLink>
      </div>
  
      <div v-else-if="mensajeError" class="no-data">
        <p>No hay ninguna empresa de {{ empresa?.nombre }} en {{ nombreCiudadError }}</p>
      </div>
  
      <div v-else class="loading">
        <p>Cargando datos...</p>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .breadcrumb h1 {
  font-size: 20px;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.category-enterprises-container {
  max-width: 100%;
  margin: 0 auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empresa-card {
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  margin-bottom: 20px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.empresa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.empresa-link {
  text-decoration: none;
  color: inherit;
  display: flex;
}

.empresa-card-content {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
}

.cont-img-tef {
  text-align: center;
  flex-shrink: 0;
  margin-right: 20px;
  margin-bottom: 20px;
}

.empresa-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 10px;
}

.empresa-contact {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #555;
  font-size: 14px;
}

.empresa-details {
  flex: 1;
  text-align: left;
}

.empresa-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 700;
}

.empresa-city {
  font-size: 18px;
  color: #ff5e42;
  margin-bottom: 12px;
  font-weight: 500;
}

.empresa-address,
.empresa-description {
  font-size: 15px;
  color: #666;
  margin-bottom: 6px;
}

.no-data,
.loading {
  font-size: 18px;
  color: #ff4d4f;
  text-align: center;
  margin-top: 20px;
}

.no-data p,
.loading p {
  font-weight: 500;
}

/* Media Queries para responsividad */
@media (max-width: 768px) {
  .empresa-card-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .cont-img-tef {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .empresa-img {
    width: 110px;
    height: 110px;
  }

  .empresa-title {
    font-size: 20px;
  }

  .empresa-city {
    font-size: 16px;
  }

  .empresa-details {
    margin-top: 15px;
  }
}
  </style>
