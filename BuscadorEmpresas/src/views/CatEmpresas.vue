<template>
  <div class="category-enterprises-container">
    <h1 v-if="!error">Empresas de la categoría: {{ categoriaNombre }}</h1>

    <p v-if="error">Hubo un error al cargar los datos.</p>

    <!-- Lista de empresas -->
    <ul v-if="!error && empresas.length">
      <li v-for="empresa in empresas" :key="empresa.idEmpresa">
        <h2>{{ empresa.nombre }}</h2>
        <p>Dirección: {{ empresa.direccion }}</p>
        <p>Teléfono: {{ empresa.telefono }}</p>
        <p>Email: {{ empresa.email }}</p>
      </li>
    </ul>

    <p v-else-if="!error">No hay empresas para esta categoría.</p>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { fetchEmpresasByCategoria } from '../stores/Buscador';

export default defineComponent({
  name: 'CatEmpresas',
  data() {
    return {
      categoriaNombre: '',
      empresas: [] as { idEmpresa: number; nombre: string; direccion: string; telefono: string; email: string }[],
      error: false,  // Agregar manejo de error
    };
  },
  async mounted() {
    const idCategoriaParam = this.$route.params.idCategoria;

    const idCategoria = Array.isArray(idCategoriaParam)
      ? parseInt(idCategoriaParam[0], 10)
      : parseInt(idCategoriaParam, 10);

    if (isNaN(idCategoria)) {
      console.error('El idCategoria no es un número válido');
      this.error = true;
      return;
    }

    try {
      const response = await fetchEmpresasByCategoria(idCategoria);

      // Mostrar toda la respuesta en la consola para depurar
      console.log('Respuesta completa del servidor:', response);

      // Verificar si `empresas` existe y está en el formato correcto
      if (response && response.empresas && Array.isArray(response.empresas)) {
        this.categoriaNombre = response.categoriaNombre || 'Sin categoría';
        this.empresas = response.empresas;
      } else {
        console.error('Respuesta no válida del servidor');
        this.error = true;
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      this.error = true;
    }
  }
});
</script>


<style scoped>
.category-enterprises-container {
  padding: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #f0f0f0;
  margin: 5px 0;
  padding: 10px;
  border-radius: 5px;
}

h2 {
  margin: 0;
  font-size: 18px;
}

p {
  margin: 5px 0;
}
</style>