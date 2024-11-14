<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useEmpresaStore } from '@/stores/Empresa'
import type { Empresa } from '@/stores/Empresa'


const route = useRoute();
const empresaName = ref(route.params.empresa.toString());

const empresaStore = useEmpresaStore()

const empresas = ref<Empresa[]>([])

const recortarTexto = (texto: string, maxLongitud: number) => {
    return texto.length > maxLongitud ? texto.slice(0, maxLongitud) + '...' : texto;
};

onMounted(async () => {
    await empresaStore.BuscadorEmpresa(empresaName.value)
    empresas.value = empresaStore.listaBuscadorEmpresa
})

</script>

<template>
    <div class="category-enterprises-container">
        <div v-if="empresas.length > 0" class="empresa-list">
            <div v-for="empresa in empresas" :key="empresa.idEmpresa">
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