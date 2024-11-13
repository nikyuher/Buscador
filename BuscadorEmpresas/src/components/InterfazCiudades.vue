<script setup lang="ts">
import { useCiudadStore } from '@/stores/Ciudad';
import type { CiudadeEmpresas } from '@/stores/Ciudad';
import { ref, onMounted, onBeforeUnmount } from 'vue';

const storeCiudad = useCiudadStore();
const Ciudades = ref<CiudadeEmpresas[]>([]);
const CiudadesIniciales = ref<CiudadeEmpresas[]>([]);
const CiudadesExtras = ref<CiudadeEmpresas[]>([]);
const mostrarTodo = ref(false);
const isVisible = ref(false);
const esResponsive = ref(window.innerWidth <= 1019);

// Función para actualizar el modo responsive según el ancho de la ventana
const actualizarModoResponsive = () => {
    esResponsive.value = window.innerWidth <= 1019;
    mostrarTodo.value = !esResponsive.value; // Mostrar todas las categorías en pantallas grandes
};

onMounted(async () => {
    await storeCiudad.GetAllCiudades();
    Ciudades.value = storeCiudad.listaCiudades.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Separar en dos listas: primeras 5 y el resto
    CiudadesIniciales.value = Ciudades.value.slice(0, 5);
    CiudadesExtras.value = Ciudades.value.slice(5);

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

    actualizarModoResponsive();
    window.addEventListener('resize', actualizarModoResponsive);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', actualizarModoResponsive);
});

// Métodos para mostrar todas las ciudades o reducir la lista
const mostrarTodasCiudades = () => {
    mostrarTodo.value = true;
}
const reducirCiudades = () => {
    mostrarTodo.value = false;
}
</script>

<template>
    <div>
        <h3 class="Categorias" :class="{ 'animate-title': isVisible }" style="font-size: 40px;">Ciudades</h3>
        <div class="categories-list" :class="{ 'animate-list': isVisible }">
            <ul>
                <!-- Mostrar todas o solo las primeras 5 según el estado responsive -->
                <li v-for="(ciudad, index) in (mostrarTodo ? Ciudades : CiudadesIniciales)" :key="index"
                    :class="{ extraRow: index >= 5 }">
                    <router-link :to="{ name: 'Ciudad', params: { nombre: ciudad.nombre, idCiudad: ciudad.idCiudad } }"
                        class="category-item">
                        <span class="bullet"></span>
                        <span>{{ ciudad.nombre }}</span>
                    </router-link>
                </li>
            </ul>

            <!-- Botones "Ver Más" y "Ver Menos" solo visibles en móvil -->
            <div v-if="esResponsive && CiudadesExtras.length > 0" class="toggle-buttons">
                <button v-if="!mostrarTodo" @click="mostrarTodasCiudades" class="ver-mas">Ver más</button>
                <button v-if="mostrarTodo" @click="reducirCiudades" class="ver-menos">Ver menos</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos de la animación y estructura */
.Categorias {
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 1s ease, transform 1s ease;
}

.animate-title {
    opacity: 1;
    transform: translateY(0);
}

.categories-list {
    opacity: 0;
    transition: opacity 1s ease-in-out;
    margin-bottom: 5vh;
}

.animate-list {
    opacity: 1;
}

ul {
    list-style-type: none;
    padding: 0;
    height: 300px;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

li {
    display: flex;
    align-items: center;
    padding: 8px 20px;
    opacity: 0;
    flex-wrap: wrap;
    transform: translateY(20px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.animate-list li {
    opacity: 1;
    transform: translateY(0);
}


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

.extra-category {
    flex: 1 1 50%;
}

/* Botones de "Ver Más" y "Ver Menos" */
.ver-mas,
.ver-menos {
    background-color: #b006ff;
    color: white;
    padding: 10px 20px;
    margin-top: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}

.ver-mas:hover,
.ver-menos:hover {
    background-color: #8805bb;
}

/* Responsive para móvil */
@media (max-width: 1019px) {
    .Categorias {
        font-size: 28px;
    }

    ul {
        flex-direction: column;
        align-items: center;
        height: auto;
    }

    li,
    .extra-category {
        padding: 8px 10px;
        text-align: center;
    }

    .toggle-buttons {
        display: flex;
        justify-content: center;
        width: 100%;
    }
}
</style>
