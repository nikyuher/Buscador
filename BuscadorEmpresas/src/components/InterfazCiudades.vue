<script setup lang="ts">
import { useCiudadStore } from '@/stores/Ciudad';
import type { CiudadeEmpresas } from '@/stores/Ciudad';
import { ref, onMounted } from 'vue';

const storeCiudad = useCiudadStore();
const Ciudades = ref<CiudadeEmpresas[]>([]);
const isVisible = ref(false);

onMounted(async () => {
    await storeCiudad.GetAllCiudades()
    Ciudades.value = storeCiudad.listaCiudades.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Configuración de Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible.value = true; // Activar animaciones al hacer visible el componente
                observer.disconnect(); // Desconectar para evitar que siga observando
            }
        });
    });
    observer.observe(document.querySelector('.categories-list') as Element);
});
</script>

<template>
    <div>
        <h3 class="Categorias" :class="{ 'animate-title': isVisible }" style="font-size: 40px;">Ciudades</h3>
        <div class="categories-list" :class="{ 'animate-list': isVisible }">
            <ul>
                <li v-for="(ciudad, index) in Ciudades" :key="ciudad.idCiudad" :class="{ extraRow: index >= 5 }">
                    <router-link :to="{ name: 'Ciudad', params: { idCiudad: ciudad.idCiudad } }" class="category-item">
                        <span class="bullet"></span>
                        <span>{{ ciudad.nombre }} </span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
/* Animación para el título */
.Categorias {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 1s ease, transform 1s ease;
}

.animate-title {
    opacity: 1;
    transform: translateY(0);
}

/* Animación de la lista */
.categories-list {
    opacity: 0;
    transition: opacity 1s ease-in-out;
}

.animate-list {
    opacity: 1;
}

/* Animaciones para cada elemento */
ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    max-height: 50vh;
}

li {
    display: flex;
    align-items: center;
    padding: 20px 30px;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
    transition-delay: calc(var(--index) * 0.1s);
    /* Retardo para cada elemento */
}

.animate-list li {
    opacity: 1;
    transform: translateY(0);
}

/* Estilo de los items */
.category-item {
    display: flex;
    align-items: center;
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
    font-size: 18px;
}

.category-item:hover {
    color: #b006ff;
}

.bullet {
    width: 8px;
    height: 8px;
    background-color: #91763c;
    border-radius: 50%;
    margin-right: 10px;
}
</style>
