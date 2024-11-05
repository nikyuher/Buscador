<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { usePeticionesStore } from '../stores/Peticiones';
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';

const peticionesStore = usePeticionesStore();
const loginStore = useLoginStore()
const usuarioStore = useUsuarioStore()

const nombreEmpresa = ref('');
const descripcionEmpresa = ref('');
const direccionEmpresa = ref('');
const telefonoEmpresa = ref<number | null>(null);
const correoEmpresa = ref('')
const sitioWebEmpresa = ref('')
const imagenEmpresaURL = ref('');
const idCategoriaEmpresa = ref(null);
const idCiudadEmpresa = ref(null);

const caracteresDescripcion = computed(() => { return descripcionEmpresa.value.length })
const caracteresNombre = computed(() => { return nombreEmpresa.value.length })
const telefonoLength = computed(() => {
  return telefonoEmpresa.value !== null ? telefonoEmpresa.value.toString().length : 0;
});


const validarForm = ref(false)
const success = ref(false);
const error = ref(false);
const Message = ref('');
const botonEstilo = ref({});

const errores = ref({
  nombreEmpresa: '',
  descripcionEmpresa: '',
  direccionEmpresa: '',
  telefonoEmpresa: '',
  correoEmpresa: '',
  sitioWebEmpresa: '',
  imagenEmpresaURL: '',
  idCategoriaEmpresa: '',
  idCiudadEmpresa: '',
});

const ValidarFormulario = async () => {
  const direccionRegex = /^(.+?),\s*\d{1,5},\s*\d{5},\s*[^,]+$/;
  const correoRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const sitioWebRegex = /^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  const urlImgenRegex = /^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  // Validación nombre
  errores.value.nombreEmpresa =
    caracteresNombre.value < 3 ? 'El nombre no debe exceder los 3 caracteres.' : '';

  // Validación descripción
  errores.value.descripcionEmpresa =
    caracteresDescripcion.value < 500 ? 'La descripción debe exceder los 500 caracteres.' : '';

  // Validación dirección
  errores.value.direccionEmpresa = !direccionRegex.test(direccionEmpresa.value)
    ? 'La dirección debe seguir el formato: Calle, Número, Código Postal, Ciudad, País.'
    : '';

  // Validación teléfono
  errores.value.telefonoEmpresa =
    telefonoLength.value !== 9 ? 'El teléfono debe tener exactamente 9 dígitos.' : '';

  // Validación correo
  errores.value.correoEmpresa = !correoRegex.test(correoEmpresa.value)
    ? 'El correo debe ser un Gmail válido (ejemplo@gmail.com).'
    : '';

  // Validación SitioWeb

  errores.value.sitioWebEmpresa = !sitioWebRegex.test(sitioWebEmpresa.value)
    ? 'El sitio Web debe ser válido (http://MiWeb.com o https://MiWeb.com).'
    : '';

  // Validación SitioWeb

  errores.value.imagenEmpresaURL = !urlImgenRegex.test(imagenEmpresaURL.value)
    ? 'La URL de la imagen debe ser válido (http://ImagenWeb.com o https://ImagenWeb.com).'
    : '';

  // Validación categoría y ciudad
  errores.value.idCategoriaEmpresa = idCategoriaEmpresa.value === null ? 'Selecciona una categoría.' : '';
  errores.value.idCiudadEmpresa = idCiudadEmpresa.value === null ? 'Selecciona una ciudad.' : '';

  // Determinar si el formulario es válido en general
  validarForm.value = Object.values(errores.value).every((msg) => msg === '');
  botonEstilo.value = validarForm.value ? {} : { opacity: 0.5, cursor: 'not-allowed' };
};


const enviarPeticion = async () => {


  try {
    const datosPeticion = {
      nombreEmpresa: nombreEmpresa.value,
      descripcionEmpresa: descripcionEmpresa.value,
      direccionEmpresa: direccionEmpresa.value,
      telefonoEmpresa: telefonoEmpresa.value,
      correoEmpresa: correoEmpresa.value,
      sitioWebEmpresa: sitioWebEmpresa.value,
      imagenEmpresaURL: imagenEmpresaURL.value,
      idCategoriaEmpresa: idCategoriaEmpresa.value,
      idCiudadEmpresa: idCiudadEmpresa.value,
    };

    await peticionesStore.CrearPeticion(datosPeticion);
    success.value = true;
    error.value = false;
    Message.value = 'Peticion enviada correctamente';

    nombreEmpresa.value = ''
    descripcionEmpresa.value = ''
    direccionEmpresa.value = ''
    telefonoEmpresa.value = null
    correoEmpresa.value = ""
    sitioWebEmpresa.value = ""
    imagenEmpresaURL.value = ''
    idCategoriaEmpresa.value = null
    idCiudadEmpresa.value = null
    validarForm.value = false;
    botonEstilo.value = { opacity: 0.5, cursor: 'not-allowed' };

  } catch (err) {
    success.value = false;
    error.value = true;
    Message.value = `${err}`;
  }
};

watch(
  [
    nombreEmpresa,
    descripcionEmpresa,
    direccionEmpresa,
    telefonoEmpresa,
    correoEmpresa,
    sitioWebEmpresa,
    imagenEmpresaURL,
    idCategoriaEmpresa,
    idCiudadEmpresa,
  ],
  ValidarFormulario
);

const limitarNombre = () => {
  if (nombreEmpresa.value.length > 60) {
    nombreEmpresa.value = nombreEmpresa.value.slice(0, 60);
  }
};

const limitarDescripcion = () => {
  if (descripcionEmpresa.value.length > 1000) {
    descripcionEmpresa.value = descripcionEmpresa.value.slice(0, 1000);
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

onMounted(async () => {
  await confirmarSesion()
  await peticionesStore.obtenerCiudades();
  await peticionesStore.obtenerCategorias();
  ValidarFormulario()
})
</script>

<template>
  <div class="solicitud-wrapper">
    <h1 class="titulo-soli">Envia tu Solicitud de Empresa</h1>
    <div class="cont-form-soli">
      <form @submit.prevent="enviarPeticion">
        <div class="form-group">
          <label for="nombreEmpresa">Nombre:</label>
          <p style="color: grey;"> Caracteres: {{ caracteresNombre }} / 60</p>
          <input v-model="nombreEmpresa" id="nombreEmpresa" placeholder="Empresa" @input="limitarNombre" type="text"
            required />
          <p class="error-message" v-if="errores.nombreEmpresa">{{ errores.nombreEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="descripcionEmpresa">Descripción:</label>
          <p style="color: grey;"> Caracteres: {{ caracteresDescripcion }} / 1000</p>
          <textarea v-model="descripcionEmpresa" id="descripcionEmpresa" @input="limitarDescripcion"
            placeholder="Descripcion de la empresa" required></textarea>
          <p class="error-message" v-if="errores.descripcionEmpresa">{{ errores.descripcionEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="direccionEmpresa">Dirección:</label>
          <input v-model="direccionEmpresa" id="direccionEmpresa"
            placeholder="Calle, Número, Código Postal, Ciudad, País" />
          <p class="error-message" v-if="errores.direccionEmpresa">{{ errores.direccionEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="telefonoEmpresa">Teléfono:</label>
          <input v-model="telefonoEmpresa" id="telefonoEmpresa" type="number" placeholder="123456789" />
          <p class="error-message" v-if="errores.telefonoEmpresa">{{ errores.telefonoEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="correoEmpresa">Correo:</label>
          <input v-model="correoEmpresa" id="correoEmpresa" type="text" placeholder="ejemplo@gmail.com" />
          <p class="error-message" v-if="errores.correoEmpresa">{{ errores.correoEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="sitioWebEmpresa">Sitio Web:</label>
          <input v-model="sitioWebEmpresa" id="sitioWebEmpresa" placeholder="http://MiSitioWeb.com" type="text"
            required />
          <p class="error-message" v-if="errores.sitioWebEmpresa">{{ errores.sitioWebEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="imagenEmpresaURL">URL de la Imagen:</label>
          <input v-model="imagenEmpresaURL" id="imagenEmpresaURL" placeholder="http://ImagenEmpresa.com" type="text"
            required />
          <p class="error-message" v-if="errores.imagenEmpresaURL">{{ errores.imagenEmpresaURL }}</p>
        </div>

        <div class="form-group">
          <label for="idCategoriaEmpresa">Categoría:</label>
          <select v-model="idCategoriaEmpresa" id="idCategoriaEmpresa" required>
            <option v-for="categoria in peticionesStore.categorias" :key="categoria.idCategoria"
              :value="categoria.idCategoria">
              {{ categoria.nombre }}
            </option>
          </select>
          <p class="error-message" v-if="errores.idCategoriaEmpresa">{{ errores.idCategoriaEmpresa }}</p>
        </div>

        <div class="form-group">
          <label for="idCiudadEmpresa">Ciudad:</label>
          <select v-model="idCiudadEmpresa" id="idCiudadEmpresa" required>
            <option v-for="ciudad in peticionesStore.ciudades" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
              {{ ciudad.nombre }}
            </option>
          </select>
          <p class="error-message" v-if="errores.idCiudadEmpresa">{{ errores.idCiudadEmpresa }}</p>
        </div>

        <button type="submit" class="submit-btn" :style="botonEstilo" :disabled="!validarForm">
          Enviar Solicitud
        </button>
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

input,
textarea,
select {
  width: 90%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  font-family: 'Montserrat', sans-serif;
}

textarea {
  resize: vertical;
  resize: none;
  height: 317px;
}


button.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #007BFF;
  color: #fff;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}

button.submit-btn:disabled {
  background-color: #007BFF;
  /* Mantener el color, pero cambiar la opacidad */
  opacity: 0.5;
  cursor: not-allowed;
}

button.submit-btn:hover:enabled {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 12px;
}
</style>
