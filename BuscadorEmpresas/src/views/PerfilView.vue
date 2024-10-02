<script setup lang="ts">
import { watchEffect, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useLoginStore } from '@/stores/Login';

import PerfilUsuario from '@/components/InterfasUsuario.vue'

const loginStore = useLoginStore()
const router = useRouter();

const isAuthenticated = computed(() => loginStore.isAuthenticated);

watchEffect(() => {
    if (!isAuthenticated.value) {
        router.push('/login');
    }
});

</script>

<template>
    <div v-if="loginStore.isAuthenticated">
        <PerfilUsuario></PerfilUsuario>
    </div>
</template>

<style scoped></style>