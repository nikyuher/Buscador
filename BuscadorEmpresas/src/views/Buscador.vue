<template>
  <div class="search-container">
    <div class="search-box">
      <h2>Busca tu empresa en tu ciudad</h2>
      <div class="search-inputs">
        <!-- Input de palabras clave para empresas -->
        <div class="keyword-container">
          <input type="text" v-model="keyword" placeholder="Palabra clave" @input="onKeywordInput"
            @keypress="onlyLetters" />
          <ul v-if="suggestions.length" class="suggestions-list">
            <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
              {{ suggestion.nombre }}
            </li>
          </ul>
        </div>

        <div class="city-container">
          <input type="text" v-model="city" placeholder="Ciudad" @input="onCityInput" @keypress="onlyLetters" />
          <ul v-if="citySuggestions.length" class="suggestions-list">
            <li v-for="(citySuggestion, index) in citySuggestions" :key="index"
              @click="selectCitySuggestion(citySuggestion)">
              {{ citySuggestion.nombre }}
            </li>
          </ul>
        </div>


        <!-- Botón para buscar con ciudad  y empresa-->
        <div v-if="IdEmpresa > 0 && IdCiudad == 0">
          <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: IdEmpresa } }">
            <button>
              <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
                alt="Buscar" />
            </button>
          </RouterLink>
        </div>
        <div v-else-if="IdEmpresa == 0 && IdCiudad > 0">
          <RouterLink :to="{ name: 'Ciudad', params: { idCiudad: IdCiudad } }">
            <button>
              <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
                alt="Buscar" />
            </button>
          </RouterLink>
        </div>
        <div v-else-if="IdEmpresa > 0 && IdCiudad > 0">
          <RouterLink :to="{ name: 'CiudadEmpresas', params: { idCiudad: IdCiudad, idEmpresa: IdEmpresa } }">
            <button>
              <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
                alt="Buscar" />
            </button>
          </RouterLink>
        </div>
        <div v-else="IdEmpresa == 0 && IdCiudad == 0">
          <button @click="searchWithoutId">
            <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
              alt="Buscar" />
          </button>
        </div>
      </div>
    </div>

    <!-- Lista de categorías en columnas -->
    <div class="categories-container">
      <h3>Categorías</h3>
      <div class="categories-grid">
        <router-link v-for="(categoria, index) in categorias" :key="index"
          :to="{ name: 'CatEmpresas', params: { idCategoria: categoria.idCategoria } }" class="category-item">
          {{ categoria.nombre }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchSuggestions, fetchCitySuggestions, fetchCategorias } from '../stores/Buscador';

// Definir variables reactivas usando `ref` para el estado
const keyword = ref(''); // Palabra clave para búsqueda de empresas
const IdEmpresa = ref(0);
const IdCiudad = ref(0);
const city = ref(''); // Ciudad para búsqueda
const suggestions = ref<{ idEmpresa: number; nombre: string }[]>([]); // Sugerencias de empresas
const citySuggestions = ref<{ idCiudad: number; nombre: string }[]>([]); // Sugerencias de ciudades
const categorias = ref<{ idCategoria: number; nombre: string }[]>([]); // Categorías

// Obtener el router para la navegación
const router = useRouter();

// Cargar las categorías al montar el componente
onMounted(async () => {
  categorias.value = await fetchCategorias();
});

const searchWithoutId = () => {
  console.log('Esa empresa no existe .');
};

// Función para manejar las sugerencias de empresas basadas en la palabra clave
const onKeywordInput = async () => {
  if (keyword.value.length >= 1) {
    suggestions.value = await fetchSuggestions(keyword.value);
  } else {
    suggestions.value = [];
  }
};


// Función para seleccionar una sugerencia de empresa
const selectSuggestion = (suggestion: { idEmpresa: number; nombre: string }) => {
  keyword.value = suggestion.nombre;
  IdEmpresa.value = suggestion.idEmpresa;
  suggestions.value = [];
  console.log(IdEmpresa.value);


};

// Función para manejar las sugerencias de ciudades basadas en la ciudad ingresada
const onCityInput = async () => {
  if (city.value.length >= 1) {
    citySuggestions.value = await fetchCitySuggestions(city.value);

  } else {
    citySuggestions.value = [];
  }
};

// Función para seleccionar una sugerencia de ciudad
const selectCitySuggestion = (citySuggestion: { idCiudad: number; nombre: string }) => {
  IdCiudad.value = citySuggestion.idCiudad;
  city.value = citySuggestion.nombre;
  citySuggestions.value = [];
  console.log(IdCiudad.value);
};

const onlyLetters = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.keyCode || event.which);

  // Expresión regular para permitir solo letras y espacios
  if (!/^[a-zA-Z\s]+$/.test(char)) {
    event.preventDefault(); // Evita que los caracteres no permitidos sean ingresados
  }
};


</script>

<style scoped>
.search-container {
  text-align: center;
  background-color: #f3f3f3;
  padding: 20px;
}

li,
a,
h2 {
  color: black;
}

.categories-container {
  margin-top: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* Ajusta el número de columnas */
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.category-item {
  background-color: #f0f0f0;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-item:hover {
  background-color: #e0e0e0;
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