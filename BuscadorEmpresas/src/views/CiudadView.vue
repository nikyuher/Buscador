<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresasByCiudad } from '../stores/Buscador'; 

// Definir los estados
const ciudad = ref<{ idCiudad: number; nombre: string; empresas: { idEmpresa: number; nombre: string }[] } | null>(null);
const error = ref(false);

const route = useRoute(); 

// Función para obtener los datos de la ciudad y sus empresas
const fetchCiudadData = async (idCiudad: number) => {
    try {
        const data = await fetchEmpresasByCiudad(idCiudad); 
        console.log("Datos obtenidos de la API:", data); 
        if (data) {
            ciudad.value = data; 
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
    const idCiudad = parseInt(route.params.idCiudad as string, 10); // Obtener idCiudad de la URL
    console.log("ID de la ciudad obtenida de la URL:", idCiudad); 

    if (idCiudad) {
        fetchCiudadData(idCiudad); 
    } else {
        error.value = true;
    }
});

</script>

<template>
    <div v-if="ciudad">
        <h1>Ciudad: {{ ciudad.nombre }}</h1>
        <h2>Empresas en {{ ciudad.nombre }}:</h2>
        <ul v-if="ciudad.empresas.length > 0">
            <li v-for="empresa in ciudad.empresas" :key="empresa.idEmpresa">
                {{ empresa.nombre }} (ID: {{ empresa.idEmpresa }})
            </li>
        </ul>
        <p v-else>No hay empresas registradas en esta ciudad.</p>
    </div>

    <div v-else-if="error">
        <p>Error al cargar los datos de la ciudad.</p>
    </div>

    <div v-else>
        <p>Cargando datos...</p>
    </div>
</template>


<style scoped></style>
