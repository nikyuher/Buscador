<template>
    <div class="category-enterprises-container">
      <h1>Empresas de la categoría: {{ categoriaNombre }}</h1>
      <ul v-if="empresas.length">
        <li v-for="empresa in empresas" :key="empresa.idEmpresa">
          <h2>{{ empresa.nombre }}</h2>
          <p>Dirección: {{ empresa.direccion }}</p>
          <p>Teléfono: {{ empresa.telefono }}</p>
          <p>Email: {{ empresa.email }}</p>
        </li>
      </ul>
      <p v-else>No hay empresas para esta categoría.</p>
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
        empresas: [] as { idEmpresa: number; nombre: string; direccion: string; telefono: string; email: string }[]
      };
    },
    async mounted() {
      const idCategoria = this.$route.params.idCategoria;
      const response = await fetchEmpresasByCategoria(idCategoria);
      this.categoriaNombre = response.categoriaNombre;
      this.empresas = response.empresas;
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
  