<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'

import { usePeticionesStore } from '@/stores/Peticiones'
import { useLoginStore } from '@/stores/Login'
import { useCategoriaStore } from '@/stores/Categoria';
import { useCiudadStore } from '@/stores/Ciudad';

const peticionesStore = usePeticionesStore()
const LoginStore = useLoginStore()
const categoriaStore = useCategoriaStore()
const ciudadStore = useCiudadStore()

const categorias = computed(() => categoriaStore.listaCategorias);
const ciudades = computed(() => ciudadStore.listaCiudades)

const idUsuario = LoginStore.usuario?.idUsuario;

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const peticiones = computed(() => peticionesStore.peticiones);

const aceptarPeticion = async (idPeticion: number) => {
    try {

        await peticionesStore.AceptarPeticion(idPeticion)

        success.value = true;
        error.value = false;

        successMessage.value = 'Petición aceptada correctamente'
        await peticionesStore.GetAllPeticiones()
    } catch (err) {
        success.value = false;
        error.value = true;

        errorMessage.value = `${err}`
    }
}

const rechazarPeticion = async (idPeticion: number) => {
    try {
        if (idUsuario) {
            await peticionesStore.EliminarPeticion(idPeticion)

            success.value = true;
            error.value = false;

            successMessage.value = 'Petición rechazada correctamente'
            await peticionesStore.GetAllPeticiones()
        }
    } catch (err) {
        success.value = false;
        error.value = true;
        errorMessage.value = `${err}`
    }
}

const obtenerNombreCategoria = (idCategoria: number) => {
    const categoria = categorias.value.find(c => c.idCategoria === idCategoria);
    return categoria?.nombre || 'Sin categoría';
}

const obtenerNombreCiudades = (idCiudad: number) => {
    const ciudad = ciudades.value.find(c => c.idCiudad === idCiudad);
    return ciudad?.nombre || 'Sin Ciudad';
}

onMounted(async () => {
    await categoriaStore.GetAllCategorias();
    await peticionesStore.GetAllPeticiones();
    await ciudadStore.GetAllCiudades();
})
</script>

<template>
    <h1>Administración - Peticiones</h1>
    <div v-if="peticiones.length">
        <table>
            <thead>
                <tr>
                    <th> Nº</th>
                    <th>Nombre Empresa</th>
                    <th>Descripción</th>
                    <th>Dirección</th>
                    <th>Categoria</th>
                    <th>Ciudad</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(peticion, index) in peticiones" :key="peticion.idPeticion">
                    <td>{{ index + 1 }}</td>
                    <td>{{ peticion.nombreEmpresa }}</td>
                    <td>{{ peticion.descripcionEmpresa }}</td>
                    <td>{{ peticion.direccionEmpresa }}</td>
                    <td> {{ obtenerNombreCategoria(peticion.idCategoriaEmpresa) }}</td>
                    <td>{{ obtenerNombreCiudades(peticion.idCiudadEmpresa) }}</td>
                    <td>
                        <button class="aceptar" @click="aceptarPeticion(peticion.idPeticion)">Aceptar</button>
                        <button class="denegar" @click="rechazarPeticion(peticion.idPeticion)">Rechazar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
            {{ successMessage }}
        </v-snackbar>

        <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
            {{ errorMessage }}
        </v-snackbar>
    </div>
    <div v-else>
        <p>No hay peticiones pendientes.</p>
    </div>
</template>

<style scoped>
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

.aceptar {
    padding: 10px;
    background-color: #49bd44;
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

.denegar:hover {
    background-color: #861010;
}
</style>