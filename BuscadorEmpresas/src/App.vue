<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useRoute } from 'vue-router'; 
import Buscador from './views/Buscador.vue';
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import router from './router';
const route = useRoute(); 
</script>

<template>
  <body>
    <Header v-if="route.name !== 'Login' && route.name !== 'Register' && route.name !== 'ChangePassword'"></Header>
  <RouterView></RouterView>
  <Footer v-if="route.name !== 'Login' && route.name !== 'Register' && route.name !== 'ChangePassword'"></Footer>
  </body>
</template>

<style scoped>

header {
  width: 100%;
  height: 10vh;
  background-color: rgb(23, 6, 51);
  color: white;
}

a,h1 {
  text-align: center;
  margin: auto;
  align-items: center;
  text-decoration: none;
  color: white;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
