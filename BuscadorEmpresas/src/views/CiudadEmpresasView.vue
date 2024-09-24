<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresaByCiudad, fetchCiudadById, fetchEmpresasById } from '../stores/Buscador'; 

// Definir los estados
const ciudad = ref<{ idCiudad: number; ciudadNombre: string; empresa: { idEmpresa: number; nombre: string } | null } | null>(null);
const empresa = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; imagen: string; } | null>(null);
const error = ref(false);
const nombreCiudadError = ref('')
const mensajeError = ref('');
const route = useRoute(); 

// Función para obtener los datos de la empresa por ciudad
const fetchEmpresaCiudadData = async (idEmpresa: number, idCiudad: number) => {
    try {
        const data = await fetchEmpresaByCiudad(idEmpresa, idCiudad); 
        if (data) {
            ciudad.value = data; 
            fetchEmpresaData(idEmpresa);
        } else {
            error.value = true; 
        }
    } catch (err: any) {
        console.error('Error al obtener los datos de la empresa por ciudad:', err);
        fetchEmpresaData(idEmpresa);
        fetchCiudadData(idCiudad);
        mensajeError.value = `No hay ninguna empresa de ${empresa.value?.nombre} en  ${ciudad.value?.ciudadNombre}</p>`
        error.value = true;
    }
};

// Función para obtener los detalles de la empresa por su ID
const fetchEmpresaData = async (idEmpresa: number) => {
    try {
        const data = await fetchEmpresasById(idEmpresa);
        if (data) {
            empresa.value = data;
        } else {
            error.value = true; 
        }
    } catch (err) {
        console.error('Error al obtener los datos de la empresa:', err);
        error.value = true;
    }
};

const fetchCiudadData = async (idCiudad: number) => {
    try {
        const data = await fetchCiudadById(idCiudad);
        if (data) {
            nombreCiudadError.value = data.nombre; 
        } else {
            error.value = true;
        }
    } catch (err) {
        console.error('Error al obtener los datos de la ciudad:', err);
        error.value = true;
    }
};

// Ejecutar cuando el componente se monte
onMounted(() => {
    const idCiudad = parseInt(route.params.idCiudad as string, 10); 
    const idEmpresa = parseInt(route.params.idEmpresa as string, 10); 

    console.log("ID de la ciudad y empresa obtenidas de la URL:", idCiudad, idEmpresa); 

    if (!isNaN(idCiudad) && !isNaN(idEmpresa)) {
        fetchEmpresaCiudadData(idEmpresa, idCiudad);
    } else {
        error.value = true;
    }
});
</script>

<template>
    <h1>Inicio > Empresa > {{ empresa?.nombre }}</h1>
    <div class="empresa-container">
        <div v-if="ciudad">
            <h1>Ciudad: {{ ciudad?.ciudadNombre }}</h1>
            <h1>{{ empresa?.nombre }}</h1>
            <img :src="empresa?.imagen" alt="Imagen de la empresa" class="empresa-img" />
            <p><strong>Descripción:</strong> {{ empresa?.descripcion }}</p>
            <p><strong>Dirección:</strong> {{ empresa?.direccion }}</p>
        </div>
        <div v-else-if="mensajeError">
            <p>No hay ninguna empresa de {{ empresa?.nombre }} en  {{ nombreCiudadError  }}</p>
        </div>
        <div v-else>
            <p>Cargando datos...</p>
        </div>
    </div>
</template>

<style scoped>
.empresa-container {
    padding: 20px;
}

.empresa-img {
    max-width: 100%;
    height: auto;
}

.category-enterprises-container {
    padding: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
}

.empresa {
    background-color: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}

li {
    background-color: #f0f0f0;
    margin: 5px 0;
    padding: 10px;
    border-radius: 5px;
}

h2 {
    margin: 0;
    font-size: 30px;
    margin-bottom: 3vh;
    color: black;
}

.empresa-img {
    max-width: 500px;
    height: auto;
    margin-bottom: 20px;
    margin-left: 8vh;
}

p {
    margin: 5px 0;
    font-size: 17px;
    color: black;
}
</style>
