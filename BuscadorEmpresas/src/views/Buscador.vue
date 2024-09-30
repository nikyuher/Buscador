<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchSuggestions, fetchCitySuggestions, fetchCategorias } from '../stores/Buscador';

// Definir variables reactivas usando `ref` para el estado
const keyword = ref('');
const IdEmpresa = ref(0);
const IdCiudad = ref(0);
const city = ref('');
const suggestions = ref<{ idEmpresa: number; nombre: string }[]>([]);
const citySuggestions = ref<{ idCiudad: number; nombre: string }[]>([]);
const categorias = ref<{ idCategoria: number; nombre: string }[]>([]);

const validarEmpresa = ref(false);
const validarCiudad = ref(false);
const errorMsg = ref(false)

const mensajeAdvertencia = ref('');


// Cargar las categorías al montar el componente
onMounted(async () => {
  categorias.value = await fetchCategorias();
});

const searchWithoutId = () => {
  if (IdEmpresa.value === 0 && IdCiudad.value === 0) {
    mensajeAdvertencia.value ='Debe seleccionar una empresa o una ciudad válida.';
    errorMsg.value = true
  } else if (IdEmpresa.value > 0 && IdCiudad.value === 0 && validarEmpresa.value) {
    mensajeAdvertencia.value = 'Buscando solo por empresa.';
    errorMsg.value = true
  } else if (IdCiudad.value > 0 && IdEmpresa.value === 0 && validarCiudad.value) {
    mensajeAdvertencia.value = 'Buscando solo por ciudad.';
    errorMsg.value = true
  } else {
    mensajeAdvertencia.value = 'Debe seleccionar valores válidos.';
    errorMsg.value = true
  }
};

// Función para manejar las sugerencias de empresas basadas en la palabra clave
const onKeywordInput = async () => {
  if (keyword.value.length >= 1) {
    suggestions.value = await fetchSuggestions(keyword.value);

    // Reiniciar la validación hasta que se seleccione una empresa de la lista
    validarEmpresa.value = false;
    errorMsg.value = false;

    // Si el texto ingresado coincide con una de las sugerencias, marcar como válido
    const empresaSeleccionada = suggestions.value.find(s => s.nombre === keyword.value);
    if (empresaSeleccionada) {
      IdEmpresa.value = empresaSeleccionada.idEmpresa;
      validarEmpresa.value = true;
    }
  } else {
    // Resetear valores si el input está vacío
    suggestions.value = [];
    validarEmpresa.value = false;
  }
};



// Función para seleccionar una sugerencia de empresa
const selectSuggestion = (suggestion: { idEmpresa: number; nombre: string }) => {
  keyword.value = suggestion.nombre;
  IdEmpresa.value = suggestion.idEmpresa;
  validarEmpresa.value = true;
  errorMsg.value = false;
  suggestions.value = [];
  console.log(IdEmpresa.value);


};

// Función para manejar las sugerencias de ciudades basadas en la ciudad ingresada
const onCityInput = async () => {
  if (city.value.length >= 1) {
    citySuggestions.value = await fetchCitySuggestions(city.value);

    // Reiniciar la validación hasta que se seleccione una ciudad de la lista
    validarCiudad.value = false;

    // Si el texto ingresado coincide con una de las sugerencias, marcar como válido
    const ciudadSeleccionada = citySuggestions.value.find(c => c.nombre === city.value);
    if (ciudadSeleccionada) {
      IdCiudad.value = ciudadSeleccionada.idCiudad;
      validarCiudad.value = true;
    }
  } else {
    // Resetear valores si el input está vacío
    citySuggestions.value = [];
    validarCiudad.value = false;
  }
};


// Función para seleccionar una sugerencia de ciudad
const selectCitySuggestion = (citySuggestion: { idCiudad: number; nombre: string }) => {
  IdCiudad.value = citySuggestion.idCiudad;
  city.value = citySuggestion.nombre;
  validarCiudad.value = true;
  errorMsg.value = false;
  citySuggestions.value = [];
  console.log(IdCiudad.value);
};

</script>

<template>
  <body> 
  <h1 class="Inicio">Inicio</h1>
  <div class="search-container">
    <div class="search-box">
      <h2>Busca tu empresa en tu ciudad</h2>
      <div v-if="errorMsg">
        <p style="color: red;">{{ mensajeAdvertencia }}</p>
      </div>
      <div class="search-inputs">
        <div class="keyword-container">
          <input type="text" v-model="keyword" placeholder="Nombre empresa" @input="onKeywordInput" />
          <ul v-if="suggestions.length" class="suggestions-list">
            <li v-for="(suggestion, index) in suggestions" :key="index" @click="selectSuggestion(suggestion)">
              {{ suggestion.nombre }}
            </li>
          </ul>
        </div>
        <div class="city-container">
          <input type="text" v-model="city" placeholder="Ciudad" @input="onCityInput" />
          <ul v-if="citySuggestions.length" class="suggestions-list">
            <li v-for="(citySuggestion, index) in citySuggestions" :key="index"
              @click="selectCitySuggestion(citySuggestion)">
              {{ citySuggestion.nombre }}
            </li>
          </ul>
        </div>
        <!-- Botón para buscar solo con empresa -->
        <div v-if="IdEmpresa > 0 && validarEmpresa == true && IdCiudad == 0">
          <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: IdEmpresa } }">
            <button>
              <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
                alt="Buscar" />
            </button>
          </RouterLink>
        </div>
        <!-- Botón para buscar solo con ciudad -->
        <div v-else-if="IdCiudad > 0 && validarCiudad == true && IdEmpresa == 0">
          <RouterLink :to="{ name: 'Ciudad', params: { idCiudad: IdCiudad } }">
            <button>
              <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
                alt="Buscar" />
            </button>
          </RouterLink>
        </div>
        <!-- Botón para buscar con ambos: empresa y ciudad -->
        <div v-else-if="validarEmpresa == true && validarCiudad == true">
          <RouterLink :to="{ name: 'CiudadEmpresas', params: { idCiudad: IdCiudad, idEmpresa: IdEmpresa } }">
            <button>
              <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
                alt="Buscar" />
            </button>
          </RouterLink>
        </div>
        <div v-else>
          <button @click="searchWithoutId">
            <img src="https://ik.imagekit.io/Mariocanizares/Empresas/search-icon.png?updatedAt=1726829161232"
              alt="Buscar" />
          </button>
        </div>
      </div>
    </div>
    <div class="categories-container">
      <h3 class="Categorias">Categorías</h3>
      <div class="categories-grid">
        <router-link v-for="(categoria, index) in categorias" :key="index"
          :to="{ name: 'CatEmpresas', params: { nombre: categoria.nombre,idCategoria: categoria.idCategoria } }" class="category-item">
          {{ categoria.nombre }}
        </router-link>
      </div>
    </div>
  </div>
</body>
</template>

<style scoped>
.search-container {
  text-align: center; 
  
}

input{
  color: white;
}

li,
a,
h2 {
  color: black;
}

.Inicio{
  margin-left: 15vh;
  font-size: 6vh;
  text-decoration: underline;
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

.Categorias{
  margin-bottom: 9vh;
  font-size: 5vh;
}

.category-item {
  background-color: rgb(23 6 51 / 88%);
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
  background-color: #e0e0e0;
}

.search-box {
  background-color: rgb(23 6 51 / 88%);
  color: white;
  padding: 70px;
  display: inline-block;
  border-radius: 12px;

}

.search-box h2 {
  color: white;
}

.search-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10vh;
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