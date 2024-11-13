<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';

import { useEmpresaStore } from '@/stores/Empresa';
import { usePeticionesStore } from '@/stores/Peticiones';
import { useCategoriaStore } from '@/stores/Categoria';
import { useCiudadStore } from '@/stores/Ciudad';

import type { DatosEmpresa } from '@/stores/Empresa'
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const peticionesStore = usePeticionesStore();
const empresaStore = useEmpresaStore();
const categoriaStore = useCategoriaStore()
const ciudadStore = useCiudadStore()

const listaEmpresas = computed(() => empresaStore.listaEmpresas);
const categorias = computed(() => categoriaStore.listaCategorias);
const ciudades = computed(() => ciudadStore.listaCiudades)

const idCategoriaEmpresa = ref(0)
const idCiudadEmpresa = ref(0)

const nuevaEmpresa = ref<DatosEmpresa>();
const editMode = ref(false);
const dialogosVisibles = reactive<{ [key: string]: boolean }>({});

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const idEmpresa = ref(0)
const nombre = ref('')
const descripcion = ref('')
const direccion = ref('')
const telefono = ref()
const correoEmpresa = ref('')
const sitioWeb = ref('')
const imagen = ref('')

const filtroNombre = ref('');
const filtroCategoria = ref(0);
const filtroCiudad = ref(0);


let map: L.Map;

const marker = ref<L.Marker | null>(null);

const initMap = (lat = 40.416775, lng = -3.703790) => {
  map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // Añade un marcador en la ubicación inicial
  marker.value = L.marker([lat, lng]).addTo(map);

  // Evento de click en el mapa para actualizar la dirección
  map.on('click', async (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;

    // Si existe un marcador previo, se elimina
    if (marker.value) {
      map.removeLayer(marker.value);
    }

    // Crear y agregar un nuevo marcador en la ubicación seleccionada
    marker.value = L.marker([lat, lng]).addTo(map);

    // Obtener la dirección desde Nominatim usando las nuevas coordenadas
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: lat,
        lon: lng,
        format: 'json',
      },
    });

    if (response.data && response.data.display_name) {
      direccion.value = response.data.display_name;
    } else {
      direccion.value = 'Dirección no encontrada';
    }
  });
};

const empresasFiltradas = computed(() => {
  return listaEmpresas.value.filter((empresa) => {
    const coincideNombre = empresa.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase());
    const coincideCategoria = filtroCategoria.value == 0 || empresa.empresaCategorias.some(c => c.idCategoria === filtroCategoria.value);
    const coincideCiudad = filtroCiudad.value == 0 || empresa.empresasCiudades.some(c => c.idCiudad === filtroCiudad.value);

    return coincideNombre && coincideCategoria && coincideCiudad;
  });
});

onMounted(() => {
  empresaStore.GetAllEmpresas();
  peticionesStore.obtenerCiudades();
  peticionesStore.obtenerCategorias();
});

const limpiarFormulario = () => {
  idEmpresa.value = 0;
  nombre.value = ''
  descripcion.value = ''
  direccion.value = ''
  imagen.value = ''

  editMode.value = false;
};

const seleccionarEmpresaParaEditar = async (empresa: any) => {
  idEmpresa.value = empresa.idEmpresa;
  nombre.value = empresa.nombre
  descripcion.value = empresa.descripcion
  direccion.value = empresa.direccion
  telefono.value = empresa.telefono
  correoEmpresa.value = empresa.correoEmpresa
  sitioWeb.value = empresa.sitioWeb
  imagen.value = empresa.imagen
  editMode.value = true;

  subirTop();
  // Obtener coordenadas de la dirección existente
  try {
    const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: direccion.value,
        format: 'json',
        limit: 1,
      },
    });

    if (geocodeResponse.data.length > 0) {
      const { lat, lon } = geocodeResponse.data[0];
      initMap(parseFloat(lat), parseFloat(lon)); // Inicializar el mapa en la dirección de la empresa
    } else {
      initMap(); // Si no encuentra la dirección, usar la posición por defecto
      direccion.value = 'Dirección no encontrada';
    }
  } catch (error) {
    console.error('Error obteniendo coordenadas de la dirección:', error);
    initMap(); // En caso de error, iniciar el mapa con la ubicación por defecto
  }
};

const confirmarEnvio = async () => {
  try {
    if (!nombre.value || !descripcion.value || !direccion.value || !imagen.value) {
      errorMessage.value = 'Por favor, completa todos los campos.';
      return;
    }

    nuevaEmpresa.value = <DatosEmpresa>{
      idEmpresa: idEmpresa.value,
      nombre: nombre.value,
      descripcion: descripcion.value,
      direccion: direccion.value,
      telefono: telefono.value,
      correoEmpresa: correoEmpresa.value,
      sitioWeb: sitioWeb.value,
      imagen: imagen.value
    }

    if (editMode.value && idEmpresa.value) {

      await empresaStore.PutDatosEmpresa(nuevaEmpresa.value);
      success.value = true;
      error.value = false;
      successMessage.value = 'Empresa editada con éxito';
    } else {
      await empresaStore.CreateEmpresa(nuevaEmpresa.value);
      success.value = true;
      error.value = false;
      successMessage.value = 'Empresa creada con éxito';
    }

    limpiarFormulario();
    empresaStore.GetAllEmpresas();
  } catch (err) {

    success.value = false;
    error.value = true;
    errorMessage.value = 'Hubo un error en el proceso';
    console.error(err);
  }
};

const eliminarEmpresa = async (idEmpresa: number) => {
  try {
    await empresaStore.EliminarEmpresa(idEmpresa);
    success.value = true;
    error.value = false;
    successMessage.value = 'Empresa eliminada con éxito';
    empresaStore.GetAllEmpresas();
  } catch (err) {
    success.value = false;
    error.value = true;
    errorMessage.value = 'Hubo un error al eliminar la empresa';
    console.error(err);
  }
};

const subirTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

const abrirDialogo = (id: string | number) => {
  dialogosVisibles[id] = true;
};

const cerrarDialogo = (id: string | number) => {
  dialogosVisibles[id] = false;
};

const obtenerNombreCategoria = (idCategoria: number) => {
  const categoria = categorias.value.find(c => c.idCategoria === idCategoria);
  return categoria?.nombre || 'Sin categoría';
}

const obtenerNombreCiudades = (idCiudad: number) => {
  const ciudad = ciudades.value.find(c => c.idCiudad === idCiudad);
  return ciudad?.nombre || 'Sin Ciudad';
}
</script>

<template>
  <div class="cont-panel-Empresas">
    <h1>Gestión de Empresas</h1>
    <div class="cont-form">
      <v-dialog v-model="dialogosVisibles['nuevaEmpresa']" max-width="600">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn class="edit" style="background-color: green;" prepend-icon="mdi-plus" v-bind="activatorProps"
            @click="abrirDialogo('nuevaEmpresa'); limpiarFormulario()">Añadir Empresa</v-btn>
        </template>
        <div style="background-color: white; padding: 30px; border-radius: 10px">
          <form @submit.prevent="confirmarEnvio">
            <div>
              <label for="nombre">Nombre de la Empresa:</label>
              <input v-model="nombre" id="nombre" type="text" required />
            </div>
            <div>
              <label for="descripcion">Descripción:</label>
              <textarea v-model="descripcion" id="descripcion" required></textarea>
            </div>

            <div>
              <label for="direccion">Dirección:</label>
              <input v-model="direccion" id="direccion" type="text" required />
            </div>
            <div>
              <label for="imagen">URL de la Imagen:</label>
              <input v-model="imagen" id="imagen" type="text" required />
            </div>
            <div>
              <label for="categoria">Categoria</label>
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
            <div>
              <button class="aceptar" type="submit">Añadir Empresa</button>
              <button class="denegar" type="button"
                @click="cerrarDialogo('nuevaEmpresa'); limpiarFormulario()">Cerrar</button>
            </div>
          </form>
        </div>
      </v-dialog>
    </div>

    <div class="filtros">
      <div class="filtro">
        <label for="filtroNombre">Nombre de Empresa</label>
        <input v-model="filtroNombre" id="filtroNombre" type="text" placeholder="Buscar por nombre" />
      </div>
      <div class="filtro">
        <label for="filtroCategoria">Categoría</label>
        <select v-model="filtroCategoria" id="filtroCategoria">
          <option value="0">Todas las categorías</option>
          <option v-for="categoria in categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
            {{ categoria.nombre }}
          </option>
        </select>
      </div>
      <div class="filtro">
        <label for="filtroCiudad">Ciudad</label>
        <select v-model="filtroCiudad" id="filtroCiudad">
          <option value="0">Todas las ciudades</option>
          <option v-for="ciudad in ciudades" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
            {{ ciudad.nombre }}
          </option>
        </select>
      </div>
    </div>


    <table class="styled-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Dirección</th>
          <th>Categoria</th>
          <th>Ciudad</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for=" empresa in empresasFiltradas" :key="empresa.idEmpresa">
          <td>{{ empresa.nombre }}</td>
          <td style="display: flex; max-width: 400px; border: none;text-align: justify">{{ empresa.descripcion }}</td>
          <td>{{ empresa.direccion }}</td>
          <td>
            <div v-for="(categoria, index) in empresa.empresaCategorias.map(m => m.idCategoria)" :key="index">
              <p class="categoria-p">{{ obtenerNombreCategoria(categoria) }}</p>
            </div>
          </td>
          <td>
            <div v-for="(ciudad, index) in empresa.empresasCiudades.map(m => m.idCiudad)" :key="index">
              <p class="ciudades-p">{{ obtenerNombreCiudades(ciudad) }}</p>
            </div>
          </td>
          <td><img :src="empresa.imagen" alt="Imagen de la Empresa" width="100" /></td>
          <td>
            <v-dialog v-model="dialogosVisibles[`${empresa.idEmpresa}-editar`]" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="edit" prepend-icon="mdi-pen" v-bind="activatorProps"
                  @click="abrirDialogo(`${empresa.idEmpresa}-editar`); seleccionarEmpresaParaEditar(empresa)"></v-btn>
              </template>
              <div class="scroll-container">
                <form @submit.prevent="confirmarEnvio">
                  <div>
                    <label for="nombre">Nombre de la Empresa:</label>
                    <input v-model="nombre" id="nombre" type="text" required />
                  </div>
                  <div>
                    <label for="descripcion">Descripción:</label>
                    <textarea v-model="descripcion" id="descripcion" required></textarea>
                  </div>

                  <div>
                    <label for="direccion">Dirección:</label>
                    <input v-model="direccion" id="direccion" type="text" required />
                    <div id="map" style="height: 300px;"></div>
                  </div>
                  <div>
                    <label for="telefono">Telefono:</label>
                    <input v-model="telefono" type="number" required>
                  </div>
                  <div>
                    <label for="correoEmpresa">Correo Empresa:</label>
                    <input v-model="correoEmpresa" type="text" required>
                  </div>
                  <div>
                    <label for="sitioWeb">Sitio Web:</label>
                    <input v-model="sitioWeb" type="text" required>
                  </div>
                  <div>
                    <label for="imagen">URL de la Imagen:</label>
                    <input v-model="imagen" id="imagen" type="text" required />
                  </div>
                  <div>
                    <button class="aceptar" type="submit">{{ editMode ? 'Guardar Cambios' : 'Añadir Empresa' }}</button>
                    <button class="denegar" type="button"
                      @click="cerrarDialogo(`${empresa.idEmpresa}-editar`); limpiarFormulario()">Cerrar</button>
                  </div>
                </form>
              </div>
            </v-dialog>
            <v-dialog v-model="dialogosVisibles[`${empresa.idEmpresa}-eliminar`]" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn style="margin-top: 20px;" class="denegar" prepend-icon="mdi-delete" v-bind="activatorProps"
                  @click="abrirDialogo(`${empresa.idEmpresa}-eliminar`);"></v-btn>
              </template>
              <div style="background-color: white; padding: 30px; border-radius: 10px">
                <h2>¿Seguro que quieres Eliminarlo?</h2>
                <v-btn style="margin-right: 20px;" class="aceptar" @click="eliminarEmpresa(empresa.idEmpresa)">
                  Si
                </v-btn>
                <v-btn class="denegar" style="margin-left: 20px;"
                  @click="cerrarDialogo(`${empresa.idEmpresa}-eliminar`); limpiarFormulario()">No</v-btn>
              </div>
            </v-dialog>

          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <button class="btn-subir-top" @click="subirTop">
    <v-icon>mdi-arrow-up</v-icon>
  </button>
  <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
    {{ successMessage }}
  </v-snackbar>

  <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
    {{ errorMessage }}
  </v-snackbar>
</template>

<style scoped>
.scroll-container {
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  height: 500px;
  overflow-y: auto;
  border: 1px solid #ccc;
}

.filtros {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
}

.filtro {
  display: flex;
  flex-direction: column;
  width: 32%;
}

input,
select {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
  width: 100%;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

.filtro input {
  margin-top: 0;
  padding: 10px;
}

.filtro select {
  padding: 10px;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

input::placeholder {
  color: #ccc;
}

.categoria-p {
  background-color: rgba(255, 175, 55, 0.699);
  border-radius: 5px;
  padding: 2px 5px;
}

.ciudades-p {
  background-color: rgba(138, 232, 255, 0.699);
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 2px 5px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  text-align: center;
}

.styled-table th,
.styled-table td {
  padding: 12px;
  border: 1px solid #ddd;
}

.styled-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.styled-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}


select {
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 10px;
  border: 1px solid black;
  width: 100%;
}

.btn-subir-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  background-color: #49bd44;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 10px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.btn-subir-top:hover {
  background-color: #45a049;
}

.cont-form {
  display: flex;
  padding: 20px;
  align-items: center;
  width: 85%;
  justify-content: center;
  margin: 20px auto;
}

.cont-panel-Empresas {
  background-color: white;
}

label {
  margin-bottom: 5px;
}

input,
textarea {
  margin-bottom: 10px;
  padding: 5px;
  margin: 10px;
  width: 100%;
  border: 1px solid black;
}

h1 {
  text-align: center;
}

.aceptar {
  padding: 10px;
  background-color: #49bd44;
  color: white;
}

.edit {
  padding: 10px;
  background-color: #fab83e;
  color: white;
}

.denegar {
  padding: 10px;
  background-color: #ff3535;
  color: white;
}

.aceptar:hover {
  background-color: #45a049;
}

.edit:hover {
  background-color: #c27816;
}

.denegar:hover {
  background-color: #861010;
}

table {
  width: 80%;
  border-collapse: collapse;
  text-align: center;
  margin: auto;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
}

img {
  border-radius: 5px;
}
</style>