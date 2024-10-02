<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
const loginStore = useLoginStore()

</script>

<template>
    <h1>Informacion Usuario</h1>
    <div class="cont-perfil">
        <p>Nombre usuario: {{ loginStore.usuario?.nombre }}</p>
        <p>Correo Electronico: {{ loginStore.usuario?.correo }}</p>
    </div>
</template>

<style scoped>
.cont-perfil {
    background-color: rgb(243, 243, 243);
    min-height: 300px;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 1px 1px 5px black;
    align-items: center;
    font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 17px;
}
</style>