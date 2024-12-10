<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchCitySuggestions, fetchCategorias } from '../stores/Buscador';
import Categoria from '@/components/InterfazCatMenu.vue'
import Ciudades from '@/components/InterfazCiudades.vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const keyword = ref('');
const IdEmpresa = ref(0);
const IdCiudad = ref(0);
const city = ref('');
const citySuggestions = ref<{ idCiudad: number; nombre: string }[]>([]);
const categorias = ref<{ idCategoria: number; nombre: string }[]>([]);

const validarEmpresa = ref(false);
const validarCiudad = ref(false);
const errorMsg = ref(false)

const mensajeAdvertencia = ref('');


onMounted(async () => {
  categorias.value = await fetchCategorias();
});

const handleSearch = () => {
  if (keyword.value.length >= 1 && IdCiudad.value === 0 && validarEmpresa.value) {
    router.push({ name: 'Resultado', params: { empresa: keyword.value } });
  } else if (IdCiudad.value > 0 && keyword.value.length === 0 && validarCiudad.value) {
    router.push({ name: 'Ciudad', params: { idCiudad: IdCiudad.value } });
  } else if (validarEmpresa.value && validarCiudad.value) {
    router.push({ name: 'Resultado', params: { empresa: keyword.value, idCiudad: IdCiudad.value } });
  } else {
    searchWithoutId();
  }
};

const searchWithoutId = () => {
  if (keyword.value.length === 0 && IdCiudad.value === 0) {
    mensajeAdvertencia.value = 'Debe seleccionar una empresa o una ciudad válida.';
    errorMsg.value = true
  } else if (keyword.value.length >= 1 && IdCiudad.value === 0 && validarEmpresa.value) {
    mensajeAdvertencia.value = 'Buscando solo por empresa.';
    errorMsg.value = true
  } else if (IdCiudad.value > 0 && keyword.value.length === 0 && validarCiudad.value) {
    mensajeAdvertencia.value = 'Buscando solo por ciudad.';
    errorMsg.value = true
  } 
  else if(validarEmpresa.value && validarCiudad.value){

  }
  else {
    mensajeAdvertencia.value = 'Debe seleccionar valores válidos.';
    errorMsg.value = true
  }
};

const onKeywordInput = async () => {
  if (keyword.value.length >= 1) {

    validarEmpresa.value = true;
    errorMsg.value = false;
  }
};

const onCityInput = async () => {
  if (city.value.length >= 1) {
    let filtrarCiudades = await fetchCitySuggestions(city.value);

    citySuggestions.value = filtrarCiudades;

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
        <h2>¿Estas buscando alguna empresa?</h2>
        <div v-if="errorMsg">
          <p style="color: red;">{{ mensajeAdvertencia }}</p>
        </div>
        <div class="search-inputs">
          <div class="city-container">
            <input type="search" v-model="city" placeholder="Ciudad" @input="onCityInput" @keyup.enter="handleSearch()" />
            <ul v-if="citySuggestions.length" class="suggestions-list">
              <li v-for="(citySuggestion, index) in citySuggestions" :key="index"
                @click="selectCitySuggestion(citySuggestion)">
                {{ citySuggestion.nombre }}
              </li>
            </ul>
          </div>
          <div class="keyword-container">
            <input type="search" v-model="keyword" placeholder="Nombre empresa" @input="onKeywordInput"
              @keyup.enter="handleSearch()" />
          </div>
          <div v-if="keyword.length >= 1 && validarEmpresa == true && IdCiudad == 0">
            <RouterLink :to="{ name: 'Resultado', params: { empresa: keyword } }">
              <button class="search-button">
                <v-icon class="lupa">mdi-magnify</v-icon>
              </button>
            </RouterLink>
          </div>
          <div v-else-if="IdCiudad > 0 && validarCiudad == true && keyword.length == 0">
            <RouterLink :to="{ name: 'Ciudad', params: { idCiudad: IdCiudad } }">
              <button class="search-button">
                <v-icon class="lupa">mdi-magnify</v-icon>
              </button>
            </RouterLink>
          </div>
          <div v-else-if="validarEmpresa == true && validarCiudad == true">
            <RouterLink :to="{ name: 'Resultado', params: { empresa: keyword, idCiudad: IdCiudad } }">
              <button class="search-button">
                <v-icon class="lupa">mdi-magnify</v-icon>
              </button>
            </RouterLink>
          </div>
          <div v-else>
            <button @click="searchWithoutId" class="search-button">
              <v-icon class="lupa">mdi-magnify</v-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="categories-container">
        <Categoria></Categoria>
        <Ciudades></Ciudades>
      </div>
    </div>
  </body>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.search-container {
  text-align: center;
  animation: fadeIn 1s ease-in;
}

.search-box {
  color: white;
  padding-top: 100px;
  display: inline-block;
  width: 100%;
  min-height: 700px;
  background-image: url(https://treeburealtygroup.com/wp-content/uploads/2024/02/Portada-Corasol.jpg);
  background-size: cover;
}

.search-box h2 {
  color: rgb(255, 255, 255);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 30px 0;
  font-size: 50px;
  font-weight: 900;
  font-family:'Courier New', Courier, monospace;
  animation: bounceIn 1s ease;
}

.search-inputs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 100px;
}

input[type="search"] {
  color: black;
  padding: 10px;
  border: 1px solid #fff;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 5px 5px 10px black;
  outline: none;
  transition: transform 0.3s, box-shadow 0.3s;
}

input:hover,
input:focus {
  transform: scale(1.05);
  box-shadow: 5px 5px 15px rgb(0, 0, 0);
}

.search-button {
  color: black;
  background-color: white;
  border: none;
  border-radius: 0 10px 10px 0;
  cursor: pointer;
  padding: 10px;
  height: 46px;
  transition: background-color 0.5s, transform 0.3s;
}

.lupa {
  font-size: 30px;
}

.search-button:hover {
  background-color: rgba(52, 238, 114, 0.89);
  transform: scale(1.1);
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
  animation: fadeIn 0.5s ease-in-out;
}

.suggestions-list li {
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.categories-container {
  text-align: center;
  width: 60%;
  margin: auto;
  animation: slideUp 1s ease;
}

.category-item {
  background-color: rgba(223, 42, 42, 0.88);
  color: white;
  font-size: 20px;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.5s;
}

.category-item:hover {
  background-color: #681717;
  transform: scale(1.1);
}

ul,
.categories-list {
  list-style: none;
  padding: 0;
  margin: 0;
  color: black;
}

.categories-list li {
  padding: 5px;
  background-color: #f0f0f0;
  margin: 5px 0;
  border-radius: 5px;
}

@media (max-width: 1018px) {
  .search-box {
    padding-top: 50px;
    min-height: 500px;
  }

  .search-box h2 {
    font-size: 28px;
    padding: 15px 0;
  }

  .search-inputs {
    flex-direction: column;
    gap: 10px;
    margin-top: 50px;
  }

  .search-button {
    padding: 10px;
    font-size: 18px;
    width: auto;
  }

  .lupa {
    font-size: 24px;
  }

  .suggestions-list {
    width: 70%;
    margin-left: 7vh;
  }

  .categories-container {
    width: 27%;
  }

  input[type="text"] {
    width: 70%;
  }
}
</style>
