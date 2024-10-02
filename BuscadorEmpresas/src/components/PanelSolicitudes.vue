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
const error = ref(false);
const Message = ref('');

// Obtener ciudades y categorías cuando el componente se monte
onMounted(() => {
  peticionesStore.obtenerCiudades();
  peticionesStore.obtenerCategorias();
});

// Función para enviar la petición
const enviarPeticion = async () => {
  try {
    const datosPeticion = {
      nombreEmpresa: nombreEmpresa.value,
      descripcionEmpresa: descripcionEmpresa.value,
      direccionEmpresa: direccionEmpresa.value,
      imagenEmpresaURL: imagenEmpresaURL.value,
      idCategoriaEmpresa: idCategoriaEmpresa.value,
      idCiudadEmpresa: idCiudadEmpresa.value,
    };

    await peticionesStore.CrearPeticion(datosPeticion);
    success.value = true;
    error.value = false;
    Message.value = 'Peticion enviada correctamente';

  } catch (err) {
    success.value = false;
    error.value = true;
    Message.value = `${err}`;
  }
};
</script>

<template>
  <div>
    <div class="titulo-soli">
      <h1>Crear Nueva Solicitud de Empresa</h1>
    </div>
    <div class="cont-form-soli">
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
          <label for="idCategoriaEmpresa">Categoría de la Empresa:</label>
          <select v-model="idCategoriaEmpresa" id="idCategoriaEmpresa" required>
            <option v-for="categoria in peticionesStore.categorias" :key="categoria.idCategoria"
              :value="categoria.idCategoria">
              {{ categoria.nombre }}
            </option>
          </select>
        </div>
        <div>
          <label for="idCiudadEmpresa">Ciudad de la Empresa:</label>
          <select v-model="idCiudadEmpresa" id="idCiudadEmpresa" required>
            <option v-for="ciudad in peticionesStore.ciudades" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
              {{ ciudad.nombre }}
            </option>
          </select>
        </div>

        <button type="submit">Enviar Solicitud</button>
        <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
          {{ Message }}
        </v-snackbar>

        <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
          {{ Message }}
        </v-snackbar>
      </form>
    </div>
  </div>
</template>

<style scoped>
.titulo-soli{
  margin-left: 30px;
  color: rgb(255, 255, 255);
  font-size: 20px;
}
.cont-form-soli {
  background-color: rgb(235, 235, 235);
  padding: 20px;
  width: 400px;
  margin:50px auto;
  box-shadow: 10px 10px 20px rgb(52, 8, 61);
  border-radius: 10px;
}

label {
  margin-bottom: 5px;
  font-size: 17px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

input,
textarea {
  margin-bottom: 10px;
  width: 100%;
  padding: 5px;
  border: 1px solid black;
  border-radius: 10px;
}

textarea {
  resize: none; 
  overflow-y: auto; 
  max-height: 150px;
}

select {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 10px;
  border: 1px solid black
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
