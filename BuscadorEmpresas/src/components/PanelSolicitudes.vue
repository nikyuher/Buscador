<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePeticionesStore } from '../stores/Peticiones';
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';

const peticionesStore = usePeticionesStore();
const loginStore = useLoginStore()
const usuarioStore = useUsuarioStore()

const nombreEmpresa = ref('');
const descripcionEmpresa = ref('');
const direccionEmpresa = ref('');
const imagenEmpresaURL = ref('');
const idCategoriaEmpresa = ref(null);
const idCiudadEmpresa = ref(null);

const success = ref(false);
const error = ref(false);
const Message = ref('');

onMounted(() => {
  peticionesStore.obtenerCiudades();
  peticionesStore.obtenerCategorias();
});

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

    nombreEmpresa.value=''
    descripcionEmpresa.value=''
    direccionEmpresa.value=''
    imagenEmpresaURL.value=''
    idCategoriaEmpresa.value=null
    idCiudadEmpresa.value=null

  } catch (err) {
    success.value = false;
    error.value = true;
    Message.value = `${err}`;
  }
};

const confirmarSesion = async () => {
  try {
    if (loginStore.usuario?.idUsuario) {
      await usuarioStore.GetUsuarioId(loginStore.usuario?.idUsuario)
    }
  } catch (err) {
    error.value = true
    Message.value = `Su sesión a caducado. Vuelva a iniciar sesión`
  }
}


onMounted(() => {
  confirmarSesion()
})
</script>
<template>
  <div class="solicitud-wrapper">
    <div class="titulo-soli">
      <h1>Envia tu Solicitud de Empresa</h1>
    </div>
    <div class="cont-form-soli">
      <form @submit.prevent="enviarPeticion">
        <div class="form-group">
          <label for="nombreEmpresa">Nombre de la Empresa:</label>
          <input v-model="nombreEmpresa" id="nombreEmpresa" type="text" required />
        </div>

        <div class="form-group">
          <label for="descripcionEmpresa">Descripción de la Empresa:</label>
          <textarea v-model="descripcionEmpresa" id="descripcionEmpresa" required></textarea>
        </div>

        <div class="form-group">
          <label for="direccionEmpresa">Dirección de la Empresa:</label>
          <input v-model="direccionEmpresa" id="direccionEmpresa" type="text" required />
        </div>

        <div class="form-group">
          <label for="imagenEmpresaURL">URL de la Imagen de la Empresa:</label>
          <input v-model="imagenEmpresaURL" id="imagenEmpresaURL" type="text" required />
        </div>

        <div class="form-group">
          <label for="idCategoriaEmpresa">Categoría de la Empresa:</label>
          <select v-model="idCategoriaEmpresa" id="idCategoriaEmpresa" required>
            <option v-for="categoria in peticionesStore.categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
              {{ categoria.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="idCiudadEmpresa">Ciudad de la Empresa:</label>
          <select v-model="idCiudadEmpresa" id="idCiudadEmpresa" required>
            <option v-for="ciudad in peticionesStore.ciudades" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
              {{ ciudad.nombre }}
            </option>
          </select>
        </div>

        <button type="submit" class="submit-btn">Enviar Solicitud</button>

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
.solicitud-wrapper {
  background-image: url('../asserts/DALL.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.titulo-soli {
  color: #4153b4;
  text-align: center;
  font-size: 25px;
  padding: 20px;
  margin: 30px;
  box-shadow: 5px 5px 15px 5px black;
  font-family: 'Montserrat', sans-serif;
  backdrop-filter: blur(20px);
  border-radius: 15px; 
}

.cont-form-soli {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

input, textarea, select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #007BFF;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.submit-btn:hover {
  background-color: #0056b3;
}
</style>
