<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePeticionesStore } from '../stores/Peticiones';

const peticionesStore = usePeticionesStore();

// Variables para los datos del formulario
const nombreEmpresa = ref('');
const descripcionEmpresa = ref('');
const direccionEmpresa = ref('');
const imagenEmpresaURL = ref('');
const idCategoriaEmpresa = ref(null); // Usaremos un select para seleccionar la categoría
const idCiudadEmpresa = ref(null); // Usaremos un select para seleccionar la ciudad

// Bandera de éxito y error
const success = ref(false);
const errorMessage = ref('');

// Obtener ciudades y categorías cuando el componente se monte
onMounted(() => {
  peticionesStore.obtenerCiudades();
  peticionesStore.obtenerCategorias();
});

// Función para enviar la petición
const enviarPeticion = async () => {
  const datosPeticion = {
    nombreEmpresa: nombreEmpresa.value,
    descripcionEmpresa: descripcionEmpresa.value,
    direccionEmpresa: direccionEmpresa.value,
    imagenEmpresaURL: imagenEmpresaURL.value,
    idCategoriaEmpresa: idCategoriaEmpresa.value,
    idCiudadEmpresa: idCiudadEmpresa.value,
  };

  try {
    await peticionesStore.CrearPeticion(datosPeticion);
    success.value = true;
    errorMessage.value = '';
  } catch (error) {
    success.value = false;
    errorMessage.value = 'Error al enviar la petición.';
  }
};
</script>

<template>
  <div>
    <h1>Crear Nueva Solicitud de Empresa</h1>

    <!-- Formulario de creación de solicitud -->
    <form @submit.prevent="enviarPeticion">
      <div>
        <label for="nombreEmpresa">Nombre de la Empresa:</label>
        <input v-model="nombreEmpresa" id="nombreEmpresa" type="text" required />
      </div>

      <div>
        <label for="descripcionEmpresa">Descripción de la Empresa:</label>
        <textarea v-model="descripcionEmpresa" id="descripcionEmpresa" required></textarea>
      </div>

      <div>
        <label for="direccionEmpresa">Dirección de la Empresa:</label>
        <input v-model="direccionEmpresa" id="direccionEmpresa" type="text" required />
      </div>

      <div>
        <label for="imagenEmpresaURL">URL de la Imagen de la Empresa:</label>
        <input v-model="imagenEmpresaURL" id="imagenEmpresaURL" type="text" required />
      </div>

      <!-- Select para las categorías -->
      <div>
        <label for="idCategoriaEmpresa">Categoría de la Empresa:</label>
        <select v-model="idCategoriaEmpresa" id="idCategoriaEmpresa" required>
          <option v-for="categoria in peticionesStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
            {{ categoria.nombre }}
          </option>
        </select>
      </div>

      <!-- Select para las ciudades -->
      <div>
        <label for="idCiudadEmpresa">Ciudad de la Empresa:</label>
        <select v-model="idCiudadEmpresa" id="idCiudadEmpresa" required>
          <option v-for="ciudad in peticionesStore.ciudades" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
            {{ ciudad.nombre }}
          </option>
        </select>
      </div>

      <button type="submit">Enviar Solicitud</button>
    </form>

    <!-- Mensaje de éxito o error -->
    <div v-if="success" class="success-message">¡Solicitud creada con éxito!</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
}

input, textarea, select {
  margin-bottom: 10px;
  padding: 5px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}
</style>
