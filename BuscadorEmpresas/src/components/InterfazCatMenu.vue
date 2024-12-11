<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoriaStore } from '@/stores/Categoria'

const storeCategoria = useCategoriaStore()
const categorias = ref<any[]>([])
const categoriasIniciales = ref<any[]>([])
const categoriasExtras = ref<any[]>([])
const mostrarTodo = ref(false)
const isVisible = ref(false)
const esResponsive = ref(window.innerWidth <= 1019)

const actualizarModoResponsive = () => {
    esResponsive.value = window.innerWidth <= 1319;
    if (!esResponsive.value) {
        mostrarTodo.value = true; // Mostrar todas las categorías en pantallas grandes
    } else {
        mostrarTodo.value = false; // Solo mostrar las primeras 5 en pantallas móviles
    }
}

onMounted(async () => {
    await storeCategoria.GetAllCategorias()
    categorias.value = storeCategoria.listaCategorias.sort((a, b) => a.nombre.localeCompare(b.nombre));

    categoriasIniciales.value = categorias.value.slice(0, 5)
    categoriasExtras.value = categorias.value.slice(5)

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isVisible.value = true;
                observer.disconnect();
            }
        });
    });
    observer.observe(document.querySelector('.categories-list') as Element);

    actualizarModoResponsive();
    window.addEventListener('resize', actualizarModoResponsive);
})

// Métodos para mostrar todas las categorías o reducir la lista
const mostrarTodasCategorias = () => {
    mostrarTodo.value = true;
}
const reducirCategorias = () => {
    mostrarTodo.value = false;
}
</script>

<template>
    <div>
        <h3 class="Categorias" :class="{ 'animate-title': isVisible }" style="font-size: 40px;">Categorías</h3>
        <div class="categories-list" :class="{ 'animate-list': isVisible }">
            <ul>
                <li v-for="(categoria, index) in (mostrarTodo ? categorias : categoriasIniciales)" :key="index" :class="{ extraRow: index >= 5 }">
                    <router-link
                        :to="{ name: 'CatEmpresas', params: { nombre: categoria.nombre, idCategoria: categoria.idCategoria } }"
                        class="category-item">
                        <span class="bullet"></span>
                        <span>{{ categoria.nombre }}</span>
                    </router-link>
                </li>
            </ul>
            <div v-if="esResponsive && categoriasExtras.length > 0" class="toggle-buttons">
                <button v-if="!mostrarTodo" @click="mostrarTodasCategorias" class="ver-mas">Ver más</button>
                <button v-if="mostrarTodo" @click="reducirCategorias" class="ver-menos">Ver menos</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Estilos globales */
.Categorias {
    font-size: 40px;
    margin-bottom: 2vh;
    margin-top: 5vh;
    text-align: center;
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
    margin-bottom: 5vh;
    transition: opacity 1s ease-in-out;
}

.animate-list {
    opacity: 1;
}

/* Estilo de listas */
ul {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    align-items: stretch;
    max-width: 1200px;
}

li {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 5px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateY(20px);
    opacity: 0;
    text-align: center;
    flex: 1 1 calc(33.333% - 20px); /* Tres columnas con espacio */
    box-sizing: border-box;
}

.animate-list li {
    opacity: 1;
    transform: translateY(0);
}

li:hover {
    transform: translateY(-5px);
    box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.527);
    ;
}
/* Estilo de enlaces */
.category-item {
    display: flex;
    align-items: center;
    color: #333;
    text-decoration: none;
    font-size: 18px;
    transition: color 0.3s ease, background-color 0.3s ease;
}

.category-item:hover {
    border-radius: 10px;
    color: #ff4d4f;
    
}

.bullet {
    width: 8px;
    height: 8px;
    background-color: #91763c;
    border-radius: 50%;
    margin-right: 10px;
}

/* Botones "Ver Más" y "Ver Menos" */
.ver-mas, .ver-menos {
    background-color: #387676;
    color: white;
    padding: 10px 20px;
    margin-top: 3vh;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.ver-mas:hover, .ver-menos:hover {
    background-color: #7aacac;
}

/* Estilos Responsive */
@media (max-width: 1319px) {
    .Categorias {
        font-size: 28px;
    }

    ul {
        flex-direction: row;
        gap: 10px;
    }

    li {
        flex: 1 1 calc(50% - 10px); /* Dos columnas en pantallas medianas */
        padding: 10px;
        font-size: 16px;
    }
}

@media (max-width: 1318px) {
    ul {
        flex-direction: column;
    }

    li {
        flex: 1 1 100%; /* Una columna en pantallas pequeñas */
    }
}
</style>

