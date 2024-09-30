<script setup lang="ts">
import { ref } from 'vue';
import { usePeticionesStore } from '../stores/Peticiones'; // Asegúrate de que el nombre del archivo sea correcto

// Inicializamos el store
const peticionesStore = usePeticionesStore();

// Variables reactivas para los campos del formulario
const nombreEmpresa = ref('');
const descripcionEmpresa = ref('');
const direccionEmpresa = ref('');
const imagenEmpresaURL = ref('');
const idCategoriaEmpresa = ref(0);
const idCiudadEmpresa = ref(0);

// Bandera de éxito y error
const success = ref(false);
const errorMessage = ref('');

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

      <div>
        <label for="idCategoriaEmpresa">ID Categoría de la Empresa:</label>
        <input v-model="idCategoriaEmpresa" id="idCategoriaEmpresa" type="number" required />
      </div>

      <div>
        <label for="idCiudadEmpresa">ID Ciudad de la Empresa:</label>
        <input v-model="idCiudadEmpresa" id="idCiudadEmpresa" type="number" required />
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

input, textarea {
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
