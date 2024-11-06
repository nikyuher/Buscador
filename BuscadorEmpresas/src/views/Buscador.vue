<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchSuggestions, fetchCitySuggestions, fetchCategorias } from '../stores/Buscador';
import Categoria from '@/components/InterfazCatMenu.vue'

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

onMounted(async () => {
  categorias.value = await fetchCategorias();
});

const searchWithoutId = () => {
  if (IdEmpresa.value === 0 && IdCiudad.value === 0) {
    mensajeAdvertencia.value = 'Debe seleccionar una empresa o una ciudad válida.';
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

const onKeywordInput = async () => {
  if (keyword.value.length >= 1) {
    let filtrarDatos = await fetchSuggestions(keyword.value);

    suggestions.value = filtrarDatos.sort((a, b) => a.nombre.localeCompare(b.nombre));

    validarEmpresa.value = false;
    errorMsg.value = false;

    const empresaSeleccionada = suggestions.value.find(s => s.nombre === keyword.value);
    if (empresaSeleccionada) {
      IdEmpresa.value = empresaSeleccionada.idEmpresa;
      validarEmpresa.value = true;
    }
  } else {
    suggestions.value = [];
    validarEmpresa.value = false;
  }
};

const selectSuggestion = (suggestion: { idEmpresa: number; nombre: string }) => {
  keyword.value = suggestion.nombre;
  IdEmpresa.value = suggestion.idEmpresa;
  validarEmpresa.value = true;
  errorMsg.value = false;
  suggestions.value = [];
  console.log(IdEmpresa.value);


};

const onCityInput = async () => {
  if (city.value.length >= 1) {
    let filtrarCiudades = await fetchCitySuggestions(city.value);

    citySuggestions.value = filtrarCiudades.sort((a, b) => a.nombre.localeCompare(b.nombre));

    validarCiudad.value = false;

    const ciudadSeleccionada = citySuggestions.value.find(c => c.nombre === city.value);
    if (ciudadSeleccionada) {
      IdCiudad.value = ciudadSeleccionada.idCiudad;
      validarCiudad.value = true;
    }
  } else {
    citySuggestions.value = [];
    validarCiudad.value = false;
  }
};

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
    <div class="search-container">
      <div class="search-box">
        <h2>¿Quieres encontrar tu empresa?</h2>
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
          <div v-if="IdEmpresa > 0 && validarEmpresa == true && IdCiudad == 0">
            <RouterLink :to="{ name: 'Empresa', params: { idEmpresa: IdEmpresa } }">
              <button>
                <v-icon class="lupa">mdi-magnify</v-icon>
              </button>
            </RouterLink>
          </div>
          <div v-else-if="IdCiudad > 0 && validarCiudad == true && IdEmpresa == 0">
            <RouterLink :to="{ name: 'Ciudad', params: { idCiudad: IdCiudad } }">
              <button>
                <v-icon class="lupa">mdi-magnify</v-icon>
              </button>
            </RouterLink>
          </div>
          <div v-else-if="validarEmpresa == true && validarCiudad == true">
            <RouterLink :to="{ name: 'CiudadEmpresas', params: { idCiudad: IdCiudad, idEmpresa: IdEmpresa } }">
              <button>
                <v-icon class="lupa">mdi-magnify</v-icon>
              </button>
            </RouterLink>
          </div>
          <div v-else>
            <button @click="searchWithoutId">
              <v-icon class="lupa">mdi-magnify</v-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="categories-container">
        <Categoria></Categoria>
      </div>
    </div>
  </body>
</template>

<style scoped>
.lupa {
  color: black;
  font-size: 30px;
}

.search-container {
  text-align: center;

}

input {
  color: white;
}

li,
a,
h2 {
  color: black;
}

.categories-container {
  text-align: center;
  display: flex;

  flex-direction: column;
  color: #990000;
  align-items: center;
  background-color: #e4e4e4;
  padding: 50px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  justify-content: center;
  align-items: center;
}

.Categorias {
  font-size: 5vh;
  margin: 0 0 30px 0px;
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

.search-box {
  color: white;
  padding: 100px;
  display: inline-block;
  width: 100%;
  min-height: 700px;
  margin: 40px auto;
  background-image: url(https://treeburealtygroup.com/wp-content/uploads/2024/02/Portada-Corasol.jpg);
  background-size: cover;
}

.search-box h2 {
  color: white;
  font-size: 40px
}

.search-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 30px;
}

input[type="text"] {
  color: black;
  padding: 10px;
  border: 1px solid #ffffff;
  background-color: #ffffff;
  border-radius: 5px;
}

button {
  background-color: white;
  border: none;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  padding: 10px;
  height: 46px;
}

button:hover {
  background-color: rgb(105, 105, 105);
  transition: 1s;
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
  max-height: 200px;
  overflow-y: auto;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

.categories-container {
  text-align: center;
  width: 80%;
  margin: auto;
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