<template>
    <div v-if="isAuthenticated">
        <div v-if="isAdmin">
            <AdminComp></AdminComp>
        </div>
        <div v-else>
            <div>
                <p>No eres administrador</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import AdminComp from '@/components/AdminComp.vue';
import { computed, watchEffect } from 'vue';
import { useLoginStore } from '../stores/Login';
import { useRouter } from 'vue-router';

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