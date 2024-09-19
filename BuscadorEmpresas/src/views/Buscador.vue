<template>
  <header>
    <h1>BuscaNet</h1>
  </header>
  <div class="search-container">
    <div class="search-box">
      <h2>Busca tu empresa en tu ciudad</h2>
      <div class="search-inputs">
        <!-- Input de palabras clave para empresas -->
        <div class="keyword-container">
          <input type="text" v-model="keyword" placeholder="Palabra clave" @input="onKeywordInput" />
          <ul v-if="suggestions.length" class="suggestions-list">
            <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
              {{ suggestion.nombre }}
            </li>
          </ul>
        </div>

        <!-- Botón para buscar solo empresas -->
        <button @click="submitSearchEmpresas">
          <img src="../assets/search-icon.png" alt="Buscar empresas" />
        </button>

        <!-- Input de ciudades -->
        <div class="city-container">
          <input type="text" v-model="city" placeholder="Ciudad" @input="onCityInput" />
          <ul v-if="citySuggestions.length" class="suggestions-list">
            <li v-for="(citySuggestion, index) in citySuggestions" :key="index"
              @click="selectCitySuggestion(citySuggestion)">
              {{ citySuggestion.nombre }}
            </li>
          </ul>
        </div>

        <!-- Botón para buscar solo ciudades -->
        <button @click="submitSearchCiudades">
          <img src="../assets/search-icon.png" alt="Buscar ciudades" />
        </button>
      </div>
    </div>

    <!-- Lista de categorías -->
    <div class="categories-container">
      <h3>Categorías</h3>
      <ul v-if="categorias.length" class="categories-list">
        <li v-for="(categoria, index) in categorias" :key="index">
          {{ categoria.nombre }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fetchSuggestions, fetchCitySuggestions, fetchCategorias } from '../stores/Buscador'; // Importamos las funciones

export default defineComponent({
  name: 'BuscadorEmpresa',
  data() {
    return {
      keyword: '',
      city: '',
      suggestions: [] as { idEmpresa: number; nombre: string }[],
      citySuggestions: [] as { idCiudad: number; nombre: string }[],
      empresas: [] as { nombre: string }[],
      categorias: [] as { idCategoria: number; nombre: string }[]
    };
  },
  async mounted() {
    // CATEGORIAS
    this.categorias = await fetchCategorias();
  },
  methods: {
    // sugerencias de palabras clave (empresas)
    async onKeywordInput() {
      if (this.keyword.length >= 1) {
        this.suggestions = await fetchSuggestions(this.keyword);
      } else {
        this.suggestions = [];
      }
    },
    selectSuggestion(keyword: { idEmpresa: number; nombre: string }) {
      this.keyword = keyword.nombre;
      this.suggestions = [];
    },

    // sugerencias de ciudades
    async onCityInput() {
      if (this.city.length >= 1) {
        this.citySuggestions = await fetchCitySuggestions(this.city);
      } else {
        this.citySuggestions = [];
      }
    },
    selectCitySuggestion(city: { idCiudad: number; nombre: string }) {
      this.city = city.nombre;
      this.citySuggestions = [];
    },

    // Buscar solo empresas
    async submitSearchEmpresas() {
      // Imprimir en consola los valores de keyword
      console.log("Palabra clave (empresa):", this.keyword);

      // Simular la búsqueda de empresas
      //this.empresas = await searchEmpresas(this.keyword); // Llamada para empresas

      // Navegar a la página de resultados con las query parameters
      this.$router.push({
        name: 'Empresas',
        query: { keyword: this.keyword }
      });
    },

    // Buscar solo ciudades
    async submitSearchCiudades() {
      // Imprimir en consola los valores de city
      console.log("Ciudad:", this.city);

      // Simular la búsqueda de ciudades
      //this.cities = await searchCities(this.city); // Llamada para ciudades

      // Navegar a la página de resultados con las query parameters
      this.$router.push({
        name: 'Ciudades',
        query: { city: this.city }
      });
    }
  }
});
</script>


<style scoped>
.header {
  width: 100%;
  height: 7vh;
}

.header,
h1 {
  text-align: center;
  height: 10vh;
}

li,
h3,
h2 {
  color: black;
}

.search-container {
  text-align: center;
  background-color: #d3d3d3;
  padding: 20px;
}

.search-box {
  background-color: #e3e3e3;
  padding: 30px;
  display: inline-block;
  border-radius: 8px;
}

.search-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
}

input[type="text"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  background-color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
}

img {
  width: 16px;
  height: 16px;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  position: absolute;
  z-index: 10;
  width: 10%;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

.categories-container {
  margin-top: 20px;
  text-align: center;
}

.categories-list {
  list-style: none;
  padding: 0;
}

.categories-list li {
  padding: 5px;
  background-color: #f0f0f0;
  margin: 5px 0;
  border-radius: 5px;
}
</style>
