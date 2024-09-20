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

        <RouterLink
          to="/empresas"
        >
        Palabra para ir 
      </RouterLink>
      <button>
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
        <button>
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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchSuggestions, fetchCitySuggestions, fetchCategorias } from '../stores/Buscador'; // Importamos las funciones

// Variables reactivas
const keyword = ref(''); // Para palabras clave de empresas
const city = ref(''); // Para la ciudad
const suggestions = ref<{ idEmpresa: number; nombre: string }[]>([]); // Sugerencias de empresas
const citySuggestions = ref<{ idCiudad: number; nombre: string }[]>([]); // Sugerencias de ciudades
const categorias = ref<{ idCategoria: number; nombre: string }[]>([]); // Categorías

// Router
const router = useRouter();

// Función para obtener categorías
const fetchCategories = async () => {
  categorias.value = await fetchCategorias();
};

// Llamada a la función fetch al montar el componente
onMounted(() => {
  fetchCategories();
});

// Sugerencias de palabras clave (empresas)
const onKeywordInput = async () => {
  if (keyword.value.length >= 1) {
    suggestions.value = await fetchSuggestions(keyword.value);
  } else {
    suggestions.value = [];
  }
};

const selectSuggestion = (suggestion: { idEmpresa: number; nombre: string }) => {
  keyword.value = suggestion.nombre;
  suggestions.value = [];
};

// Sugerencias de ciudades
const onCityInput = async () => {
  if (city.value.length >= 1) {
    citySuggestions.value = await fetchCitySuggestions(city.value);
  } else {
    citySuggestions.value = [];
  }
};

const selectCitySuggestion = (citySuggestion: { idCiudad: number; nombre: string }) => {
  city.value = citySuggestion.nombre;
  citySuggestions.value = [];
};

// // Buscar solo empresas
// const submitSearchEmpresas = async () => {
//   console.log('Empresa:', keyword.value);
//   router.push({
//     name: 'Empresas',
//     query: { keyword: keyword.value }
//   });
// };

// // Buscar solo ciudades
// const submitSearchCiudades = async () => {
//   console.log('Ciudad:', city.value);
//   router.push({
//     name: 'Ciudades',
//     query: { city: city.value }
//   });
// };
</script>

<style scoped>
/* Estilos se mantienen igual */
.search-container {
  padding: 20px;
}
</style>



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
