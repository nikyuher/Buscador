<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresaByCiudad } from '../stores/Buscador'; // Importa la función adecuada
import { fetchEmpresasById } from '../stores/Buscador';

// Definir los estados
const ciudad = ref<{ idCiudad: number; ciudadNombre: string; empresa: { idEmpresa: number; nombre: string } | null } | null>(null);
const empresa = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; imagen: string; } | null>(null);
const error = ref(false);
const errorMessage = ref('');

const route = useRoute(); // Obtener los parámetros de la ruta

// Función para obtener los datos de la empresa por ciudad
const fetchEmpresaData = async (idEmpresa: number, idCiudad: number) => {
    try {
        const data = await fetchEmpresaByCiudad(idEmpresa, idCiudad); // Llama a la función para obtener datos de la API
        console.log("Datos obtenidos de la API:", data); // Comprobar los datos recibidos
        if (data) {
            ciudad.value = data; // Asigna los datos de la ciudad y la empresa al estado
        } else {
            error.value = true; // Marca error si no hay datos
        }
    } catch (err: any) {
        console.error('Error al obtener los datos de la empresa por ciudad:', err);

        errorMessage.value = err.message || 'Error desconocido';
        error.value = true;
    }
};

// Función para obtener los detalles de la empresa por su ID
const fetchEmpresasData = async (idEmpresa: number) => {
    try {
        const data = await fetchEmpresasById(idEmpresa);
        console.log("Datos de la empresa:", data); // Verificar los datos recibidos
        if (data) {
            empresa.value = data; // Asigna los datos de la empresa al estado
        } else {
            error.value = true; // Marca error si no hay datos
        }
    } catch (err) {
        console.error('Error al obtener los datos de la empresa:', err);
        error.value = true;
    }
};

// Ejecutar cuando el componente se monte
onMounted(() => {
    const idCiudad = parseInt(route.params.idCiudad as string, 10); // Obtener idCiudad desde la URL
    const idEmpresa = parseInt(route.params.idEmpresa as string, 10); // Obtener idEmpresa desde la URL

    console.log("ID de la ciudad y empresa obtenidas de la URL:", idCiudad, idEmpresa); // Verificar si obtenemos la ID correctamente

    if (!isNaN(idCiudad) && !isNaN(idEmpresa)) {
        fetchEmpresaData(idEmpresa, idCiudad); // Llama a la función para obtener los datos
        fetchEmpresasData(idEmpresa);
    } else {
        error.value = true;
    }
});
</script>

<template>
    <div class="empresa-container">
        <div v-if="empresa">
            <h1>Ciudad: {{ ciudad?.ciudadNombre }}</h1>
            <h1>{{ empresa.nombre }}</h1>
            <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
            <p><strong>Descripción:</strong> {{ empresa.descripcion }}</p>
            <p><strong>Dirección:</strong> {{ empresa.direccion }}</p>
        </div>
        <div v-else-if="error">
            <p>Error al cargar los datos de la empresa o ciudad.</p>
            <p v-if="errorMessage">{{ errorMessage }}</p> <!-- Mostrar el mensaje de error -->
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
