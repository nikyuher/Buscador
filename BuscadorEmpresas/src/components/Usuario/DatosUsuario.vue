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

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const editMode = ref(false)


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

const cancelEdicion = async () => {

    editMode.value = false
    nombre.value = usuarioStore.usuario ? usuarioStore.usuario?.nombre : ''
    correo.value = usuarioStore.usuario ? usuarioStore.usuario?.correo : ''
    contrasena.value = usuarioStore.usuario ? usuarioStore.usuario?.contrasena : ''
}

</script>

<template>
    <div v-if="!editMode" class="cont-perfil">
        <h1>Informacion Usuario</h1>
        <p>Nombre: {{ nombre }}</p>
        <p>Correo: {{ correo }}</p>
        <p>Contraseña: ***********</p>
        <button class="editar" v-if="!editMode" @click="editMode = true"> <strong>Editar</strong></button>
    </div>
    <div v-else>
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