<template>
  <div class="search-container">
    <h1>BuscaNet</h1>
    <div class="search-box">
      <h2>Busca tu empresa en tu ciudad</h2>
      <div class="search-inputs">
        <input type="text" v-model="keyword" placeholder="Palabra clave" />
        <button @click="search"><img src="../assets/search-icon.png" alt="Buscar"></button>
        <input type="text" v-model="city" placeholder="Ciudad" />
        <button @click="search"><img src="../assets/search-icon.png" alt="Buscar"></button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BuscadorEmpresa',
  data() {
    return {
      keyword: '',
      city: ''
    };
  },
  methods: {
    search() {
      console.log(`Buscando ${this.keyword} en ${this.city}`);
    }
  }
};
</script>

<style scoped>
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
</style>
