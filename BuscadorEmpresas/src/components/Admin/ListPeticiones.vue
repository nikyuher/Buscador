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
const peticiones = computed(() => peticionesStore.peticiones);

const idUsuario = LoginStore.usuario?.idUsuario;

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const selectedCategoria = ref(0);
const selectedCiudad = ref(0);
const searchQuery = ref('');

const filteredPeticiones = computed(() => {
    return peticiones.value.filter(peticion => {
        const matchesCategoria = selectedCategoria.value == 0 || peticion.idCategoriaEmpresa == selectedCategoria.value;
        const matchesCiudad = selectedCiudad.value == 0 || peticion.idCiudadEmpresa == selectedCiudad.value;
        const matchesNombre = peticion.nombreEmpresa.toLowerCase().includes(searchQuery.value.toLowerCase());

        return matchesCategoria && matchesCiudad && matchesNombre;
    });
});

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
    <div class="container">
        <h1 class="text-center">Administración - Peticiones</h1>
        <div class="filters">
            <div class="filter">
                <label for="search">Buscar por nombre:</label>
                <input v-model="searchQuery" id="search" type="text" placeholder="Buscar empresa...">
            </div>
            <div class="filter">
                <label for="categoria">Filtrar por Categoría:</label>
                <select v-model="selectedCategoria" id="categoria">
                    <option value="0">Todas las Categorías</option>
                    <option v-for="categoria in categorias" :key="categoria.idCategoria" :value="categoria.idCategoria">
                        {{ categoria.nombre }}
                    </option>
                </select>
            </div>
            <div class="filter">
                <label for="ciudad">Filtrar por Ciudad:</label>
                <select v-model="selectedCiudad" id="ciudad">
                    <option value="0">Todas las Ciudades</option>
                    <option v-for="ciudad in ciudades" :key="ciudad.idCiudad" :value="ciudad.idCiudad">
                        {{ ciudad.nombre }}
                    </option>
                </select>
            </div>
        </div>
        <table class="styled-table">
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
                <tr v-for="(peticion, index) in filteredPeticiones" :key="peticion.idPeticion">
                    <td>{{ index + 1 }}</td>
                    <td>{{ peticion.nombreEmpresa }}</td>
                    <td>{{ peticion.descripcionEmpresa }}</td>
                    <td>{{ peticion.direccionEmpresa }}</td>
                    <td>
                        <p class="categoria-p">{{ obtenerNombreCategoria(peticion.idCategoriaEmpresa) }}</p>
                    </td>
                    <td>
                        <p class="ciudades-p">{{ obtenerNombreCiudades(peticion.idCiudadEmpresa) }}</p>
                    </td>
                    <td>
                        <button class="btn aceptar" @click="aceptarPeticion(peticion.idPeticion)">Aceptar</button>
                        <button class="btn denegar" @click="rechazarPeticion(peticion.idPeticion)">Rechazar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="notification success" v-if="success">{{ successMessage }}</div>
        <div class="notification error" v-if="error">{{ errorMessage }}</div>
    </div>
</template>

<style scoped>
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

.container {
    width:1200px;
    margin: auto;
    padding: 20px;
}

.text-center {
    text-align: center;
    margin-bottom: 20px;
}

.filters {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.filter {
    display: flex;
    flex-direction: column;
    width: 45%;
}

input {
    border: 1px solid gray;
    border-radius: 5px;
    height: 100%;
    padding: 10px
}

#categoria,
#ciudad,
#search {
    width: 70%;
}

label {
    font-weight: bold;
    margin-bottom: 5px;
}

select {
    padding: 10px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ccc;
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

.btn {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    color: white;
}

.aceptar {
    background-color: #4CAF50;
}

.denegar {
    background-color: #f44336;
}

.aceptar:hover {
    background-color: #45a049;
}

.denegar:hover {
    background-color: #d32f2f;
}

.notification {
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 15px;
    text-align: center;
}

.success {
    background-color: #4CAF50;
    color: white;
}

.error {
    background-color: #f44336;
    color: white;
}
</style>