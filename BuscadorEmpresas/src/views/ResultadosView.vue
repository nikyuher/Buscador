<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useEmpresaStore } from '@/stores/Empresa'
import { useCiudadStore } from '@/stores/Ciudad'
import type { Empresa } from '@/stores/Empresa'
import type { CiudadeEmpresas } from '@/stores/Ciudad'


const route = useRoute();
const empresaName = ref(route.params.empresa.toString());
const idCiudad = ref(route.params.idCiudad ? parseInt(route.params.idCiudad as string) : null);

const empresaStore = useEmpresaStore()
const ciudadStore = useCiudadStore()

const empresas = ref<Empresa[]>([])
const ciudadesEmpresas = ref<CiudadeEmpresas | null>(null)

const nombreBusqueda = ref('')
const empresaFiltradas = computed(() => {
    return empresas.value.filter(empresa => empresa.nombre.toLowerCase().includes(nombreBusqueda.value.toLowerCase()))
})

const empresaCiudadFiltradas = computed(() => {
    return ciudadesEmpresas.value?.empresasCiudades.filter(empresa => empresa.empresa.nombre.toLowerCase().includes(nombreBusqueda.value.toLowerCase()))
})

const recortarTexto = (texto: string, maxLongitud: number) => {
    return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
};

onMounted(async () => {
    if (idCiudad.value) {
        await ciudadStore.GetEmpresaExistente(empresaName.value, idCiudad.value);
        ciudadesEmpresas.value = ciudadStore.ciudadExistente;
    } else {
        await empresaStore.BuscadorEmpresa(empresaName.value);
        empresas.value = empresaStore.listaBuscadorEmpresa;
    }

})

</script>

<template>
    <h1 class="breadcrumb">Inicio > Relacionadas > "{{ empresaName }}"</h1>
    <div v-if="idCiudad === null && empresas.length > 0" class="category-enterprises-container">

        <div style="display: flex; justify-content: space-between">
            <h2 style="font-size: 30px">Empresas con: {{ empresaName }}</h2>
            <div>
                <input v-model="nombreBusqueda" type="search" placeholder="Buscar...">
            </div>
        </div>

        <div class="empresa-list">
            <div v-for="empresa in empresaFiltradas" :key="empresa.idEmpresa">
                <router-link :to="{ name: 'Empresa', params: { idEmpresa: empresa.idEmpresa } }" class="empresa-card">
                    <div class="cont-img-tef">
                        <div class="empresa-contact-info ">
                            <v-icon>mdi-phone</v-icon>
                            <p>{{ empresa.telefono }}</p>
                        </div>
                        <img :src="empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
                    </div>
                    <div class="empresa-details">
                        <h3>{{ empresa.nombre }}</h3>
                        <p class="empresa-address"><strong>Dirección:</strong> {{ empresa.direccion }}</p>
                        <p class="empresa-description"> <strong>Descripción</strong> {{
                            recortarTexto(empresa.descripcion, 167) }}</p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
    <div v-else-if="ciudadesEmpresas" class="category-enterprises-container">
        <div class="empresa-list">
            <div style="display: flex; justify-content: space-between">
                <h2 style="font-size: 30px">Ciudad {{ ciudadesEmpresas.nombre }}</h2>
                <div>
                    <input v-model="nombreBusqueda" type="search" placeholder="Buscar...">
                </div>
            </div>
            <div v-for="(ciudad, index) in empresaCiudadFiltradas" :key="index">
                <router-link :to="{ name: 'Empresa', params: { idEmpresa: ciudad.empresa.idEmpresa } }"
                    class="empresa-card">
                    <div class="cont-img-tef">
                        <div class="empresa-contact-info">
                            <v-icon>mdi-phone</v-icon>
                            <p>{{ ciudad.empresa.telefono }}</p>
                        </div>
                        <img :src="ciudad.empresa.imagen" alt="Imagen de la empresa" class="empresa-img" />
                    </div>
                    <div class="empresa-details">
                        <h3>{{ ciudad.empresa.nombre }}</h3>
                        <p class="empresa-address">
                            <strong>Dirección:</strong> {{ ciudad.empresa.direccion }}
                        </p>
                        <p class="empresa-description">
                            <strong>Descripción:</strong> {{ recortarTexto(ciudad.empresa.descripcion, 167) }}
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
    <div v-else class="category-enterprises-container">
        <h1>No nay datos relacionados con tu busqueda.</h1>
    </div>
</template>
<style scoped>
input[type="search"] {
    color: black;
    padding: 5px;
    border: 1px solid #fff;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 2px 2px 5px black;
    outline: none;
}

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

.empresa-contact-info {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #000000;
    font-size: 14px;
    margin-bottom: 10px;
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
    flex-direction: column;
    align-items: center;
    padding: 20px;
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