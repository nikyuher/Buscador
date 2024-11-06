<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useCategoriaStore } from '@/stores/Categoria'

const storeCategoria = useCategoriaStore()
const categorias = ref<any[]>([])
const numEmpresCat = ref<Record<number, number>>({})

const numEmpresas = async (id: number) => {
    try {
        await storeCategoria.GetNumEmpresasByCategoria(id)

        numEmpresCat.value[id] = storeCategoria.numEmpresas

    } catch (error) {
        console.log(error);

    }
}

onMounted(async () => {
    await storeCategoria.GetAllCategorias()
    categorias.value = storeCategoria.listaCategorias

    await Promise.all(categorias.value.map((categoria) => numEmpresas(categoria.idCategoria)))
})

</script>

<template>
    <div>
        <h3 class="Categorias">Categorías</h3>
        <div class="categories-grid">
            <router-link v-for="(categoria, index) in categorias" :key="index"
                :to="{ name: 'CatEmpresas', params: { nombre: categoria.nombre, idCategoria: categoria.idCategoria } }"
                class="category-item">
                <p>{{ categoria.nombre }} ({{ numEmpresCat[categoria.idCategoria] || 0 }})</p>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.categories-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.Categorias {
    font-size: 5vh;
    margin: 0 0 30px 0px;
}

p {
    font-family: monospace;
}

.category-item {
    background-color: rgba(223, 42, 42, 0.88);
    color: white;
    font-size: 20px;
    padding: 10px;
    text-align: center;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    text-decoration: none;
}

.category-item:hover {
    background-color: #681717;
    transition: 0.7s;
}
</style>