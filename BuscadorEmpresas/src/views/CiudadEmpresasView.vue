<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchEmpresaByCiudad, fetchCiudadById, fetchEmpresasById } from '../stores/Buscador';

// Definir los estados
const ciudad = ref<{ idCiudad: number; ciudadNombre: string; empresa: { idEmpresa: number; nombre: string } | null } | null>(null);
const empresa = ref<{ idEmpresa: number; nombre: string; descripcion: string; direccion: string; telefono: string; imagen: string; } | null>(null);
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
    <div class="category-enterprises-container">
        <div v-if="ciudad" class="empresa-card">
            <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: empresa?.idEmpresa } }" class="decorador">
                <div class="cont-img-tef">
                    <div style="display: flex; align-items: center; color: black;">
                        <v-icon>mdi-phone</v-icon>
                        <p>{{ empresa?.telefono }}</p>
                    </div>
                    <img :src="empresa?.imagen" alt="Imagen de la empresa" class="empresa-img" />
                </div>
                <div class="empresa-details">
                    <h3>{{ empresa?.nombre }}</h3>
                    <h3 style="color: rgb(255, 94, 66);">Ciudad: {{ ciudad?.ciudadNombre }}</h3>
                    <p class="empresa-address"><strong>Dirección:</strong> {{ empresa?.direccion }}</p>
                    <p class="empresa-description"><strong>Descripción:</strong> {{ empresa?.descripcion }}</p>
                </div>
            </RouterLink>

        </div>
        <div v-else-if="mensajeError">
            <p style="font-size: 20px; color: white;">No hay ninguna empresa de {{ empresa?.nombre }} en {{
                nombreCiudadError }}</p>
        </div>
        <div v-else>
            <p>Cargando datos...</p>
        </div>
    </div>
</template>

<style scoped>
.decorador {
    display: flex;
}

.cont-img-tef {
    width: 190px;
    text-align: center;
}

.empresa-card {
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
    width: 100%;
    display: flex;
    align-items: center;
    transition: transform 0.2s, box-shadow 0.2s;
}

a {
    text-decoration: none;
}

.Datos {
    background-color: rgb(0, 0, 0);
    border-radius: 10px;
    padding: 40px 40px;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.Datos p {
    font-size: 17px;
}

.Datos h2 {
    color: rgb(235, 160, 48);
}

.category-enterprises-container {
    padding: 20px;
    background-color: rgb(209, 209, 209);
    width: 60%;
    margin: 150px auto;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    background-color: rgb(23 6 51 / 88%);
    margin: 30px;
    padding: 10px;
    border-radius: 10px;
}

h1 {
    color: rgb(0, 0, 0);
    font-size: 17px;
}


p {
    margin: 5px 0;
    color: rgb(0, 0, 0);
}

.breadcrumb {
    font-size: 17px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 20px;
}

.category-enterprises-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.error-message,
.no-data {
    font-size: 18px;
    color: #ff4d4f;
    margin-top: 20px;
}

.empresa-list {
    width: 100%;
}


.empresa-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.empresa-img {
    max-width: 100%;
    height: 100px;
    border-radius: 10px;
    margin-bottom: 15px;
}

.empresa-details {
    text-align: justify;
    padding: 20px;
    width: 80%;
}

.empresa-details h3 {
    font-size: 18px;
    color: #404fd4;
    margin-bottom: 10px;
}

.empresa-description,
.empresa-address {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 16px;
    color: #000000;
    margin-bottom: 8px;
}

.empresa-address {
    color: #000000;
}
</style>
