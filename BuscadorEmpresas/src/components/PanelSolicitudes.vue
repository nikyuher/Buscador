<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { usePeticionesStore } from '../stores/Peticiones';
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

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

let map: L.Map;
const marker = ref<L.Marker | null>(null);

const initMap = () => {
  map = L.map('map').setView([40.416775, -3.703790], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // Evento de click en el mapa
  map.on('click', async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    if (marker.value instanceof L.Marker) {
      map.removeLayer(marker.value);
    }

    // Crear y agregar un nuevo marcador en la ubicación seleccionada
    marker.value = L.marker([lat, lng]).addTo(map);

    // Llamada a la API de Nominatim para obtener la dirección
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
      },
    });

    if (response.data && response.data.display_name) {
      direccionEmpresa.value = response.data.display_name;
    } else {
      direccionEmpresa.value = 'Dirección no encontrada';
    }
  });
};

const caracteresDescripcion = computed(() => { return descripcionEmpresa.value.length })
const caracteresNombre = computed(() => { return nombreEmpresa.value.length })
const telefonoLength = computed(() => {
  return telefonoEmpresa.value !== null ? telefonoEmpresa.value.toString().length : 0;
});

const success = ref(false);
const error = ref(false);
const Message = ref('');

const errores = ref({
  nombreEmpresa: '',
  descripcionEmpresa: '',
  telefonoEmpresa: '',
  correoEmpresa: '',
  sitioWebEmpresa: '',
  imagenEmpresaURL: '',
  idCategoriaEmpresa: '',
  idCiudadEmpresa: '',
});

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

const categoriasOrdenadas = computed(() => {
  return [...peticionesStore.categorias].sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const ciudadesOrdenadas = computed(() => {
  return [...peticionesStore.ciudades].sort((a, b) => a.nombre.localeCompare(b.nombre));
});

const subirTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
const validarNombre = async () => {

  if (caracteresNombre.value < 3) {
    errores.value.nombreEmpresa = 'El nombre debe tener más de 3 caracteres.'
    return false
  } else {
    errores.value.nombreEmpresa = ''
    return true
  }
};

const validarDescripcion = async () => {

  if (caracteresDescripcion.value < 500) {
    errores.value.descripcionEmpresa = 'La descripción debe ser mayor de 500 caracteres.'
    return false
  } else {
    errores.value.descripcionEmpresa = ''
    return true
  }
};

const validarTelefono = async () => {
  errores.value.telefonoEmpresa =
    telefonoLength.value !== 9 ? 'El teléfono debe tener exactamente 9 dígitos.' : '';
  if (telefonoLength.value !== 9) {
    errores.value.telefonoEmpresa = 'El teléfono debe tener exactamente 9 dígitos.'
    return false
  } else {
    errores.value.telefonoEmpresa = ''
    return true
  }
};

const validarCorreo = async () => {
  const correoRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!correoRegex.test(correoEmpresa.value)) {
    errores.value.correoEmpresa = 'El correo debe ser un Gmail válido (ejemplo@gmail.com).'
    return false
  } else {
    errores.value.correoEmpresa = ''
    return true
  }
};

const validarSitioWeb = async () => {
  const sitioWebRegex = /^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;

  if (!sitioWebRegex.test(sitioWebEmpresa.value)) {
    errores.value.sitioWebEmpresa = 'El sitio Web debe ser válido (http://MiWeb.com o https://MiWeb.com).'
    return false
  } else {
    errores.value.sitioWebEmpresa = ''
    return true
  }

};

const validarImagenURL = async () => {
  const urlImgenRegex = /^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;

  if (!urlImgenRegex.test(imagenEmpresaURL.value)) {
    errores.value.imagenEmpresaURL = 'La URL de la imagen debe ser válida (http://ImagenWeb.com o https://ImagenWeb.com).'
    return false
  } else {
    errores.value.imagenEmpresaURL = ''
    return true
  }

};

const validarCategoria = async () => {

  if (idCategoriaEmpresa.value === null) {
    errores.value.idCategoriaEmpresa = 'Selecciona una categoría.'
    return false
  } else {
    errores.value.idCategoriaEmpresa = ''
    return true
  }

};

const validarCiudad = async () => {

  if (idCiudadEmpresa.value === null) {
    errores.value.idCiudadEmpresa = 'Selecciona una ciudad.'
    return false
  } else {
    errores.value.idCiudadEmpresa = ''
    return true
  }
};

const enviarPeticion = async () => {

  try {

    await validarNombre()
    await validarDescripcion()
    await validarTelefono()
    await validarCorreo()
    await validarSitioWeb()
    await validarImagenURL()
    await validarCategoria()
    await validarCiudad()

    if (await validarNombre() &&
      await validarDescripcion() &&
      await validarTelefono() &&
      await validarCorreo() &&
      await validarSitioWeb() &&
      await validarImagenURL() &&
      await validarCategoria() &&
      await validarCiudad()) {

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
      subirTop();

      nombreEmpresa.value = '';
      descripcionEmpresa.value = '';
      direccionEmpresa.value = '';
      telefonoEmpresa.value = null;
      correoEmpresa.value = '';
      sitioWebEmpresa.value = '';
      imagenEmpresaURL.value = '';
      idCategoriaEmpresa.value = null;
      idCiudadEmpresa.value = null;
    }
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

onMounted(async () => {
  await confirmarSesion()
  await peticionesStore.obtenerCiudades();
  await peticionesStore.obtenerCategorias();
  initMap();
})
</script>

<template>
  <div class="solicitud-wrapper">
    <div class="cont-form-soli">
      <h1 class="titulo-soli">Envía tu Solicitud de Empresa</h1>
      <form @submit.prevent="enviarPeticion">
        <!-- Nombre -->
        <div class="form-group">
          <label for="nombreEmpresa">Nombre:</label>
          <input
            v-model="nombreEmpresa"
            id="nombreEmpresa"
            placeholder="Nombre de la empresa"
            @input="limitarNombre"
            maxlength="60"
            type="text"
            required
          />
          <small>Caracteres: {{ caracteresNombre }} / 60</small>
          <p class="error-message" v-if="errores.nombreEmpresa">{{ errores.nombreEmpresa }}</p>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="descripcionEmpresa">Descripción:</label>
          <textarea
            v-model="descripcionEmpresa"
            id="descripcionEmpresa"
            placeholder="Descripción de la empresa"
            @input="limitarDescripcion"
            maxlength="1000"
            required
          ></textarea>
          <small>Caracteres: {{ caracteresDescripcion }} / 1000</small>
          <p class="error-message" v-if="errores.descripcionEmpresa">{{ errores.descripcionEmpresa }}</p>
        </div>

        <!-- Dirección -->
        <div class="form-group">
          <label for="direccionEmpresa">Dirección:</label>
          <input
            v-model="direccionEmpresa"
            id="direccionEmpresa"
            placeholder="Calle, Número, Código Postal, Ciudad, País"
            readonly
            required
          />
          <div id="map" style="height: 300px; border-radius: 8px; margin-top: 10px;"></div>
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label for="telefonoEmpresa">Teléfono:</label>
          <input
            v-model="telefonoEmpresa"
            id="telefonoEmpresa"
            type="number"
            placeholder="123456789"
            required
          />
          <p class="error-message" v-if="errores.telefonoEmpresa">{{ errores.telefonoEmpresa }}</p>
        </div>

        <!-- Correo -->
        <div class="form-group">
          <label for="correoEmpresa">Correo:</label>
          <input
            v-model="correoEmpresa"
            id="correoEmpresa"
            type="email"
            placeholder="ejemplo@gmail.com"
            required
          />
          <p class="error-message" v-if="errores.correoEmpresa">{{ errores.correoEmpresa }}</p>
        </div>

        <!-- Sitio Web -->
        <div class="form-group">
          <label for="sitioWebEmpresa">Sitio Web:</label>
          <input
            v-model="sitioWebEmpresa"
            id="sitioWebEmpresa"
            type="url"
            placeholder="http://MiSitioWeb.com"
            required
          />
          <p class="error-message" v-if="errores.sitioWebEmpresa">{{ errores.sitioWebEmpresa }}</p>
        </div>

        <!-- Imagen -->
        <div class="form-group">
          <label for="imagenEmpresaURL">URL de la Imagen:</label>
          <input
            v-model="imagenEmpresaURL"
            id="imagenEmpresaURL"
            type="url"
            placeholder="http://ImagenEmpresa.com"
            required
          />
          <p class="error-message" v-if="errores.imagenEmpresaURL">{{ errores.imagenEmpresaURL }}</p>
        </div>

        <!-- Categoría -->
        <div class="form-group">
          <label for="idCategoriaEmpresa">Categoría:</label>
          <select v-model="idCategoriaEmpresa" id="idCategoriaEmpresa" required>
            <option v-for="categoria in categoriasOrdenadas" :key="categoria.idCategoria" :value="categoria.idCategoria">
              {{ categoria.nombre }}
            </option>
          </select>
          <p class="error-message" v-if="errores.idCategoriaEmpresa">{{ errores.idCategoriaEmpresa }}</p>
        </div>

        <!-- Ciudad -->
        <div class="form-group">
          <label for="idCiudadEmpresa">Ciudad:</label>
          <select v-model="idCiudadEmpresa" id="idCiudadEmpresa" required>
            <option v-for="ciudad in ciudadesOrdenadas" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
              {{ ciudad.nombre }}
            </option>
          </select>
          <p class="error-message" v-if="errores.idCiudadEmpresa">{{ errores.idCiudadEmpresa }}</p>
        </div>

        <!-- Botón de envío -->
        <button type="submit" class="submit-btn">Enviar Solicitud</button>

        <!-- Snackbars -->
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
  background: #f3f4f6;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.titulo-soli {
  text-align: center;
  font-size: 24px;
  color: #342bb6;
  margin-bottom: 20px;
  font-weight: bold;
}

.error-message{
  color:red;
}
.cont-form-soli {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

textarea {
  resize: vertical;
  height: 120px;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  background-color: #342bb6;
  color: white;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #281d93;
}
</style>
