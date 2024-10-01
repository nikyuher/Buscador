<template>
    <div v-if="isAuthenticated">
        <div v-if="isAdmin">
            <AdminComp></AdminComp>
            <PanelEmpresas></PanelEmpresas>
        </div>
        <div v-else>
            <div>
                <div class="contenedorError">
                    <v-empty-state headline="Acceso denegado" title="No tienes permisos para este contenido"
                        image="https://vuetifyjs.b-cdn.net/docs/images/components/v-empty-state/astro-dog.svg">
                    </v-empty-state>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AdminComp from '@/components/AdminComp.vue';
import { computed, watchEffect } from 'vue';
import { useLoginStore } from '../stores/Login';
import { useRouter } from 'vue-router';
import PanelEmpresas from '@/components/PanelEmpresas.vue';

const router = useRouter();
const usuario = useLoginStore();

const isAuthenticated = computed(() => usuario.isAuthenticated);
const isAdmin = computed(() => usuario.usuario?.rol);
watchEffect(() => {
    if (!isAuthenticated.value) {
        router.push('/login');
    }
});
</script>

<style>
.contenedorError {
    background-color: white;
    margin: 150px auto;
    text-align: center;
    color: none;
}
</style>