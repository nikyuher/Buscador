<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';
import { ref, onMounted } from 'vue';
import { usePeticionesStore } from '@/stores/Peticiones'
// Definición de los headers para la tabla
const headers = ref([
    { text: 'Nº', value: 'index', align: 'start' },
    { text: 'Nombre', value: 'nombreEmpresa' },
    { text: 'Descripción', value: 'descripcionEmpresa' },
    { text: 'Dirección', value: 'direccionEmpresa' },
    { text: 'Imagen', value: 'imagenEmpresaURL' }
]);

const loginStore = useLoginStore();
const usuarioStore = useUsuarioStore();
const peticionesStore = usePeticionesStore()

const idUsuario = loginStore.usuario?.idUsuario;

const ListaPeticiones = ref<any[]>([]);

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const DatosPeticionesUsuario = async (id: number) => {
    try {
        await usuarioStore.GetPeticionesByUsuario(id);
        ListaPeticiones.value = usuarioStore.peticionesUsuario;
    } catch (error) {
        console.error(error);
    }
};

const confirmarSesion = async () => {
    try {
        if (loginStore.usuario?.idUsuario) {
            await usuarioStore.GetUsuarioId(loginStore.usuario?.idUsuario);
        }
    } catch (err) {
        error.value = true;
        errorMessage.value = `Su sesión ha caducado. Vuelva a iniciar sesión.`;
    }
};

const rechazarPeticion = async (idPeticion: number) => {
    try {
        if (idUsuario) {
            await peticionesStore.EliminarPeticion(idPeticion)

            success.value = true;
            error.value = false;
            await usuarioStore.GetPeticionesByUsuario(idUsuario);
            ListaPeticiones.value = usuarioStore.peticionesUsuario;
            successMessage.value = 'Petición rechazada correctamente'
        }
    } catch (err) {
        success.value = false;
        error.value = true;

        errorMessage.value = `${err}`
    }
}

onMounted(() => {
    confirmarSesion();
    if (loginStore.usuario?.idUsuario) {
        DatosPeticionesUsuario(loginStore.usuario?.idUsuario);
    } else {
        console.log('No hay un usuario registrado');
    }
});
</script>

<template>

    <div>
        <div v-if="ListaPeticiones.length > 0">
            <h2 style="margin: 5px 50px 30px 50px;">Solicitudes Pendientes</h2>
            <table>
                <thead>
                    <tr>
                        <th> Nº</th>
                        <th>Nombre</th>
                        <th>Descripcion</th>
                        <th>Direccion</th>
                        <th>Imagen</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(peticion, index) in ListaPeticiones" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ peticion.nombreEmpresa }}</td>
                        <td>{{ peticion.descripcionEmpresa }}</td>
                        <td>{{ peticion.direccionEmpresa }}</td>
                        <td><img :src="peticion.imagenEmpresaURL" alt="Imagen Empresa" width="100" /></td>
                        <td><button class="denegar" @click="rechazarPeticion(peticion.idPeticion)">Eliminar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <h2 style="margin: 5px 50px 30px 50px;">Solicitudes Pendientes</h2>
            <p>¡No tienes ninguna solicitud pediente!</p>
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
.cont-data-peticion {

    background-color: rgb(226, 232, 255);
    border-radius: 10px;
    margin: 20px;
    padding: 20px;
    box-shadow: 5px 5px 10px black
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