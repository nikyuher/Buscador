<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
import ListaEmpresas from '@/components/EmpresasUsuario.vue'
import ListaPeticiones from '@/components/PeticionesUsuario.vue'
import DatosUsuario from '@/components/DatosUsuario.vue'
const loginStore = useLoginStore()

</script>

<template>
    <div v-if="loginStore.isAuthenticated">
        <div class="cont-perfil">
            <DatosUsuario></DatosUsuario>
            <ListaEmpresas></ListaEmpresas>
            <ListaPeticiones></ListaPeticiones>
        </div>
    </div>
</template>

<style scoped>
.cont-perfil {
    background-color: white;
    min-height: 300px;
    padding: 50px;
}
</style>