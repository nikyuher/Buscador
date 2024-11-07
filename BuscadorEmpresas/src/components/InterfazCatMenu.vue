<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCategoriaStore } from '@/stores/Categoria'

const storeCategoria = useCategoriaStore()
const categorias = ref<any[]>([])
const numEmpresCat = ref<Record<number, number>>({})

const numEmpresas = async (id: number) => {
    try {
        await storeCategoria.GetNumEmpresasByCategoria(id)
        numEmpresCat.value[id] = storeCategoria.numEmpresas
    } catch (error) {
        console.log(error)
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
        <h3 class="Categorias" style="font-size: 40px;">Categorías</h3>
        <div class="categories-list">
            <ul>
                <li v-for="(categoria, index) in categorias" :key="index" :class="{ extraRow: index >= 5 }">
                    <router-link
                        :to="{ name: 'CatEmpresas', params: { nombre: categoria.nombre, idCategoria: categoria.idCategoria } }"
                        class="category-item">
                        <span class="bullet"></span>
                        <span>{{ categoria.nombre }} ({{ numEmpresCat[categoria.idCategoria] || 0 }})</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.categories-list {
    display: flex;
    flex-wrap: wrap;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 50vh;
}

li {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 8px 30px;
}



.category-item {
    display: flex;
    align-items: center;
    color: #333;
    text-decoration: none;
    transition: color 0.3s;
    flex-wrap: wrap;
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
