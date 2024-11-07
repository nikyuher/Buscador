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
        <h1>BuscaNet</h1>
      </RouterLink>
    </div>

    <div class="user-actions">
      <div>
        <RouterLink v-if="!isLoggedIn" to="/Register" class="nav__link" style="margin-right: 20px;">Register
        </RouterLink>
        <RouterLink v-if="!isLoggedIn" to="/Login" class="nav__link">Login</RouterLink>
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
span:hover,
.Solicitudes:hover {
  font-size: 17px;
  background-color: #0000007e;
  padding: 5px;
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
  height: 10vh;
  background-color: #2a5f4d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

a,
h1 {
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
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-left: 20vh;
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