<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';
import { ref, onMounted, reactive } from 'vue'
import { useEmpresaStore } from '@/stores/Empresa';
import type { DatosEmpresa } from '@/stores/Empresa'
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const empresaStore = useEmpresaStore();
const loginStore = useLoginStore()
const usuarioStore = useUsuarioStore()

const nuevaEmpresa = ref<DatosEmpresa>();
const listaEmpresas = ref<any[]>([])
const editMode = ref(false);
const dialogosVisibles = reactive<{ [key: string]: boolean }>({});

const idEmpresa = ref(0)
const nombre = ref('')
const descripcion = ref('')
const direccion = ref('')
const telefono = ref()
const correoEmpresa = ref('')
const sitioWeb = ref('')
const imagen = ref('')

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

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
        if (marker.value instanceof L.Marker) {
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

const DatosEmpresasUsuario = async (id: number) => {

    try {

        await usuarioStore.GetEmpresasByUsuario(id)

        listaEmpresas.value = usuarioStore.empresasUsuario

    } catch (error) {

    }
}


const confirmarSesion = async () => {
    try {
        if (loginStore.usuario?.idUsuario) {
            await usuarioStore.GetUsuarioId(loginStore.usuario?.idUsuario)
        }
    } catch (err) {
        error.value = true
        errorMessage.value = `Su sesión a caducado. Vuelva a iniciar sesión`
    }
}

const eliminarEmpresa = async (idEmpresa: number) => {
    try {

        await usuarioStore.EliminarEmpresasByUsuarios(idEmpresa)
        success.value = true
        error.value = false
        successMessage.value = 'Empresa eliminada con exito.'

        if (loginStore.usuario?.idUsuario) {
            DatosEmpresasUsuario(loginStore.usuario?.idUsuario)
        }

    } catch (err) {
        success.value = false
        error.value = true
        successMessage.value = `${err}`
        console.log(err);

    }
}

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

const confirmarEnvio = async () => {
    try {
        confirmarSesion()

        if (loginStore.usuario?.idUsuario) {
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
            DatosEmpresasUsuario(loginStore.usuario?.idUsuario)
        }
    } catch (err) {

        success.value = false;
        error.value = true;
        errorMessage.value = 'Hubo un error en el proceso';
        console.error(err);
    }
};


onMounted(async () => {
    confirmarSesion()

    if (loginStore.usuario?.idUsuario) {
        DatosEmpresasUsuario(loginStore.usuario?.idUsuario)
    } else {
        console.log('No hay un usuario registrado');
    }
})
</script>

<template>
    <div>
        <h2 style="margin: 5px 50px 30px 50px;">Mis Empresas</h2>
        <div v-if="listaEmpresas.length > 0">
            <div class="container-table">
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th> Nº</th>
                            <th>Nombre</th>
                            <th>Direccion</th>
                            <th>Imagen</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(empresa, index) in listaEmpresas" :key="index" class="style-form">
                            <td>{{ index + 1 }}</td>
                            <td>{{ empresa.empresa.nombre }}</td>
                            <td style="word-break: break-word;">{{ empresa.empresa.direccion }}</td>
                            <td><img :src="empresa.empresa.imagen" alt="Imagen Empresa" width="100" /></td>
                            <td>
                                <v-dialog v-model="dialogosVisibles[`${empresa.idEmpresa}-editar`]" max-width="600">
                                    <template v-slot:activator="{ props: activatorProps }">
                                        <v-btn class="edit" style="margin-right: 20px;" prepend-icon="mdi-pen"
                                            v-bind="activatorProps"
                                            @click="abrirDialogo(`${empresa.idEmpresa}-editar`); seleccionarEmpresaParaEditar(empresa.empresa)"></v-btn>
                                    </template>
                                    <div class="scroll-container">
                                        <form @submit.prevent="confirmarEnvio">
                                            <div>
                                                <label for="nombre">Nombre de la Empresa:</label>
                                                <input v-model="nombre" id="nombre" type="text" required />
                                            </div>
                                            <div>
                                                <label for="descripcion">Descripción:</label>
                                                <textarea style="height: 200px;resize: none;" v-model="descripcion"
                                                    id="descripcion" required></textarea>
                                            </div>

                                            <div>
                                                <label for="direccion">Dirección:</label>
                                                <input v-model="direccion" id="direccion" type="text" required
                                                    readonly />
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
                                                <button class="aceptar" type="submit">{{ editMode ? 'Guardar Cambios' :
                                                    'Añadir Empresa' }}</button>
                                                <button class="denegar" type="button"
                                                    @click="cerrarDialogo(`${empresa.idEmpresa}-editar`); limpiarFormulario()">Cerrar</button>
                                            </div>
                                        </form>
                                    </div>
                                </v-dialog>
                                <v-dialog v-model="dialogosVisibles[`${empresa.idEmpresa}-eliminar`]" max-width="600">
                                    <template v-slot:activator="{ props: activatorProps }">
                                        <v-btn class="denegar" prepend-icon="mdi-delete" v-bind="activatorProps"
                                            @click="abrirDialogo(`${empresa.idEmpresa}-eliminar`);"></v-btn>
                                    </template>
                                    <div style="background-color: white; padding: 30px; border-radius: 10px">
                                        <h2>¿Seguro que quieres Eliminarlo?</h2>
                                        <v-btn style="margin-right: 20px;" class="aceptar"
                                            @click="eliminarEmpresa(empresa.idUsuarioEmpresa)">
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
        </div>
        <div v-else style="text-align: center; margin: 20px;">
            <p>No tienes ninguna empresa creada.</p>
        </div>
    </div>
    <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
        {{ successMessage }}
    </v-snackbar>

    <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
        {{ errorMessage }}
    </v-snackbar>
</template>

<style scoped>
.container-table{
  width: 1200px;
  margin: auto
}
.scroll-container {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    height: 500px;
    overflow-y: auto;
    border: 1px solid #ccc;
}

label {
    margin-bottom: 5px;
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


img {
    border-radius: 5px;
}

.cont-divisores {
    border: 1px solid black;
    display: flex;
    justify-content: space-around;
}

.cont-data-empresa {
    background-color: rgb(226, 232, 255);
    border-radius: 10px;
    margin: 20px;
    padding: 20px;
    box-shadow: 1px 1px 5px black;
    justify-content: space-around;
    display: flex;
}

.eliminar {
    padding: 10px;
    background-color: #ff3535;
    color: white;
    border-radius: 5px;
}

.eliminar:hover {
    background-color: #861010;
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
    border-bottom: 1px solid rgb(134, 134, 134);
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
</style>