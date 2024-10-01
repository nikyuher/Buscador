<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
const loginStore = useLoginStore()

</script>

<template>
    <div class="cont-perfil">
        <h1>Datos Usuario</h1>
        <h2>IdUsuario: {{ loginStore.usuario?.idUsuario }}</h2>
        <h2>Nombre: {{ loginStore.usuario?.nombre }}</h2>
        <h2>Correo: {{ loginStore.usuario?.correo }}</h2>
    </div>
</template>

<style scoped>
.cont-perfil {
    background-color: rgb(238, 238, 238);
    min-height: 300px;
    padding: 50px;
    border-radius: 10px;
    box-shadow: 5px 5px 10px black
}
</style>