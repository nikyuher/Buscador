<script setup lang="ts">
import { computed } from 'vue';
import { useLoginStore } from '../stores/Login';
import { useRouter } from 'vue-router';

const loginStore = useLoginStore();
const router = useRouter(); // Obtener acceso al router

// Computar si el usuario está logueado
const isLoggedIn = computed(() => loginStore.usuario !== null);

// Obtener el nombre del usuario si está logueado
const userName = computed(() => loginStore.usuario?.nombre || '');

// Método para cerrar sesión
const handleLogout = () => {
  loginStore.logout();
  router.push('/');
};
</script>

<template>
  <div class="header">
    <div class="header-name">
      <RouterLink to="/">
        <h1 style="font-size: 35px;">BuscaNet</h1>
      </RouterLink>
    </div>

    <div class="user-actions">
      <div v-if="!isLoggedIn" style="padding-top: 20px;">
        <RouterLink to="/Register" class="nav__link" style="margin-right: 20px;">Register
        </RouterLink>
        <RouterLink to="/Login" class="nav__link">Login</RouterLink>
      </div>
      <div v-if="isLoggedIn" class="logged-in-actions">
        <div v-if="isLoggedIn && loginStore.isAdmin">
          <RouterLink to="/PanelAdmin" class="sol">Panel Admin</RouterLink>
        </div>
        <div v-if="isLoggedIn && !loginStore.isAdmin">
          <RouterLink to="/Solicitudes" class="Solicitudes" style="margin-right: 10px;">
            Solicitudes
          </RouterLink>
        </div>
        <span>
          <RouterLink to="/Perfil"><v-icon>mdi-account-circle</v-icon> Bienvenido {{ userName }}</RouterLink>
        </span>
        <button @click="handleLogout" class="logout-button">Cerrar sesión</button>
      </div>
    </div>

  </div>
</template>


<style scoped>
.nav__link {
  font-weight: bold;
  padding: 10px;
}

.nav__link:hover {
  text-decoration: underline;
  text-underline-offset: 7px;
  text-decoration-thickness: 2px;
  border-radius: 5px;
  background-color: #00000063;

}

span,
.Solicitudes {
  padding: 5px;
  font-size: 17px;
}

span:hover,
.Solicitudes:hover {
  background-color: #0000007e;
  border-radius: 5px;
  align-items: center;
  text-align: center;
  text-decoration: none;
}


span {
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 7px;
  text-decoration-thickness: 2px;
}

.header {
  width: 100%;
  height: 12vh;
  background-color: #387676;
  color: white;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

a,
h1 {

  text-decoration: none;
  color: white;
}
a{
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  font-size: 17px;
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

.user-actions button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: 10px;
}

.user-actions button:hover {
  text-decoration: underline;
}

.user-actions {
  display: flex;
  font-family: Arial, Helvetica, sans-serif;
}

.logout-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d9363e;
}

.logged-in-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.sol {
  margin-right: 20px;
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