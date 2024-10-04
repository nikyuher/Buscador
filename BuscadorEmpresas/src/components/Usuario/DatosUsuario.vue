<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';

interface infoUsuario {
    idUsuario: number
    nombre: string
    contrasena: string
    correo: string
}

const loginStore = useLoginStore()
const usuarioStore = useUsuarioStore()

const nombre = ref('');
const correo = ref('');
const contrasena = ref('');

const solicitudNum = computed(() => usuarioStore.peticionesUsuario.length > 0 ? usuarioStore.peticionesUsuario.length : 0)
const empresasNum = computed(() => usuarioStore.empresasUsuario.length > 0 ? usuarioStore.empresasUsuario.length : 0)

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const editMode = ref(false)
const deleteMode = ref(false)

onMounted(() => {
    selectDatos()
})

const selectDatos = async () => {
    try {

        if (loginStore.usuario?.idUsuario) {

            await usuarioStore.GetUsuarioId(loginStore.usuario?.idUsuario)

            nombre.value = usuarioStore.usuario ? usuarioStore.usuario?.nombre : ''
            correo.value = usuarioStore.usuario ? usuarioStore.usuario?.correo : ''
            contrasena.value = usuarioStore.usuario ? usuarioStore.usuario?.contrasena : ''
        }

    } catch (err) {
        error.value = true
        errorMessage.value = `Su sesión a caducado. Vuelva a iniciar sesión`
    }

}
const EditarDatos = async () => {

    try {

        if (loginStore.usuario?.idUsuario) {

            const datos = <infoUsuario>{
                idUsuario: loginStore.usuario?.idUsuario,
                nombre: nombre.value,
                contrasena: contrasena.value,
                correo: correo.value
            }

            await usuarioStore.PutDatosUsuarioId(datos)

            usuarioStore.usuario!.nombre = datos.nombre;
            usuarioStore.usuario!.correo = datos.correo;
            usuarioStore.usuario!.contrasena = datos.contrasena;

            success.value = true
            successMessage.value = 'Datos actualizados con éxito.'
            error.value = false
            editMode.value = false
        }

    } catch (err) {
        success.value = false
        error.value = true
        errorMessage.value = `${err}`

    }

}

const confirmarSesion = async (modo:string) => {
    try {
        if (loginStore.usuario?.idUsuario ) {
            await usuarioStore.GetUsuarioId(loginStore.usuario?.idUsuario)
            if (modo == 'edit') {
                editMode.value = true
            }
            if (modo == 'delete') {
                deleteMode.value = true
                editMode.value = true
            }
        }
    } catch (err) {
        error.value = true
        editMode.value = false
        deleteMode.value = false
        errorMessage.value = `Su sesión a caducado. Vuelva a iniciar sesión`
    }
}

const eliminarCuenta = async () => {

    try {

        if (loginStore.usuario?.idUsuario) {
            await usuarioStore.EliminarUsuarios(loginStore.usuario?.idUsuario)
            success.value = true
            successMessage.value = 'Cuenta eliminada con éxito.'
            error.value = false

            setTimeout(() => {
                loginStore.logout()
            }, 2000);
        }


    } catch (err) {
        success.value = false
        error.value = true
        errorMessage.value = `${err}`

    }
}

const cancelEdicion = async () => {

    editMode.value = false
    nombre.value = usuarioStore.usuario ? usuarioStore.usuario?.nombre : ''
    correo.value = usuarioStore.usuario ? usuarioStore.usuario?.correo : ''
    contrasena.value = usuarioStore.usuario ? usuarioStore.usuario?.contrasena : ''
}

</script>

<template>
    <div v-if="!editMode && !deleteMode" class="cont-perfil">
        <h1>Informacion Usuario</h1>
        <p>Nombre: {{ nombre }}</p>
        <p>Correo: {{ correo }}</p>
        <p>Contraseña: ***********</p>
        <button class="editar" v-if="!editMode" @click="confirmarSesion('edit')"> <strong>Editar</strong></button>
    </div>
    <div v-if="editMode && !deleteMode">
        <h1>Editar Informacion</h1>
        <div class="cont-editor">
            <form @submit.prevent="EditarDatos">
                <label for="">Nombre</label>
                <input type="text" v-model="nombre" name="nombre" required>
                <label for="">Correo</label>
                <input type="email" v-model="correo" name="correo" required>
                <label for="">Contraseña</label>
                <input type="text" v-model="contrasena" name="contrasena" required>
                <button class="guardar" v-if="editMode" type="submit"> Guardar</button>
                <button class="cancelar" v-if="editMode" @click="cancelEdicion()"> Cancelar</button>
            </form>
        </div>
    </div>
    <div v-if="!editMode && !deleteMode" class="cont-perfil">
        <h2>Informacion Empresas</h2>
        <p>Solicitudes pendienetes: <strong style="color: green; font-size: 20px">{{ solicitudNum }}</strong></p>
        <p>Empresas Aceptadas: <strong style="color: green; font-size: 20px">{{ empresasNum }}</strong></p>
    </div>
    <div class="cont-delete" v-if="!editMode">
        <h2>Eliminar Cuenta</h2>
        <button class="cancelar" @click=" confirmarSesion('delete')">Eliminar cuenta</button>
    </div>
    <div v-if="deleteMode">
        <div class="cont-delete-mode">
            <h2>¿Seguro que quieres eliminar tu cuenta?</h2>
            <button class="guardar" @click="eliminarCuenta()">Si</button>
            <button class="cancelar" @click="deleteMode = false; editMode = false">No</button>
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
.cont-editor {
    display: flex;
}

.cont-delete {
    margin: 40px auto;
    width: 90%;
    padding: 0 50px;
}

.cont-delete-mode h2 {
    padding: 20px 50px;
}

.cont-delete-mode button {
    margin: 0 50px
}

.cont-editor input {
    border: 1px solid black;
    width: 100%;
    height: 30px;
    padding: 20px 10px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.cont-editor label {
    color: rgb(0, 0, 0);
    font-size: larger;
}

.guardar {
    padding: 10px;
    background-color: #49bd44;
    color: white;
    padding: 5px 20px;
    border-radius: 5px;
    margin-right: 20px
}

.cancelar {
    padding: 10px;
    background-color: #ff3535;
    padding: 5px 20px;
    color: white;
    border-radius: 5px;
}

.editar {
    background-color: rgb(255, 185, 56);
    color: rgb(0, 0, 0);
    padding: 5px 20px;
    border-radius: 5px;
    margin-top: 20px;
}

.guardar:hover {
    background-color: #45a049;
}

.cancelar:hover {
    background-color: #861010;
}


.editar:hover {
    background-color: rgb(185, 133, 36);
    color: rgb(255, 255, 255);
}

.cont-perfil {
    min-height: 300px;
    padding: 50px;
    border-bottom: 2px solid rgb(136, 136, 136);
    align-items: center;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 17px;
    width: 90%;
    margin: auto;
}
</style>