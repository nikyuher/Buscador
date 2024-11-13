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
    esResponsive.value = window.innerWidth <= 1019;
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
                <!-- Mostrar todas o solo las primeras 5 según el estado responsive -->
                <li v-for="(categoria, index) in (mostrarTodo ? categorias : categoriasIniciales)" :key="index" :class="{ extraRow: index >= 5 }">
                    <router-link
                        :to="{ name: 'CatEmpresas', params: { nombre: categoria.nombre, idCategoria: categoria.idCategoria } }"
                        class="category-item">
                        <span class="bullet"></span>
                        <span>{{ categoria.nombre }}</span>
                    </router-link>
                </li>
            </ul>
            
            <!-- Botones "Ver Más" y "Ver Menos" solo visibles en móvil -->
            <div v-if="esResponsive && categoriasExtras.length > 0" class="toggle-buttons">
                <button v-if="!mostrarTodo" @click="mostrarTodasCategorias" class="ver-mas">Ver más</button>
                <button v-if="mostrarTodo" @click="reducirCategorias" class="ver-menos">Ver menos</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
    height: 200px;
    margin: 0;
    flex-direction: column;
    display: flex;
    flex-wrap: wrap;
}

li {
    display: flex;
    align-items: center;
    padding: 8px 20px;
    opacity: 0;
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

/* Estilo de las categorías extras para mostrarse en dos columnas */
.extra-category {
    flex: 1 1 50%;
}

/* Botones de "Ver Más" y "Ver Menos" */
.ver-mas, .ver-menos {
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

.ver-mas:hover, .ver-menos:hover {
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
    li, .extra-category {
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
