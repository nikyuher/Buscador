<script setup lang="ts">
import { ref } from 'vue';
import { useLoginStore } from '../stores/Login';
import { useRouter } from 'vue-router';

const nombre = ref('');
const password = ref('');
const errorMessage = ref<string | null>(null);
const loginStore = useLoginStore();
const router = useRouter();
const loading = ref(false);

const login = async () => {
  loading.value = true;
  errorMessage.value = null;

  try {
    const success = await loginStore.login(nombre.value, password.value);

    if (success) {
      if (loginStore.usuario?.rol) {
        router.push('/PanelAdmin');
      } else {
        router.push('/');
      }
    } else {
      errorMessage.value = 'Credenciales incorrectas. Inténtalo nuevamente.';
    }
  } catch (error) {
    errorMessage.value = 'Ocurrió un error al iniciar sesión.';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="cont-form">
    <v-card class="py-8 px-6 mx-auto ma-4" elevation="12" max-width="400" width="100%">
      <div class="header-name">
        <RouterLink to="/">
          <h1>BuscaNet</h1>
        </RouterLink>
      </div>
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div>
          <div class="input-group">
            <label for="nombre">Correo</label>
            <input type="nombre" id="nombre" v-model="nombre" placeholder="Ingrese su Usuario" required />
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required />
          </div>
        </div>
        <div class="changePassword">
          <span class="obj1">
            <RouterLink to="/Register">¿No tienes una cuenta?</RouterLink>
          </span>
          <span class="obj2">
            <RouterLink to="/ChangePassword">¿Olvidaste tú contraseña?</RouterLink>
          </span>
        </div>
        <div>
          <button type="submit" :disabled="loading">
            {{ loading ? "Iniciando sesión..." : "Iniciar Sesión" }}
          </button>
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </form>
    </v-card>
  </div>
</template>

<style scoped>
.changePassword {
  display: flex;
  margin-bottom: 10px;
  padding: 5px;
  justify-content:space-between;
  flex-wrap: wrap;
  
}

.changePassword a {
  text-decoration: none;
  color: #0b57d0;
}

.obj1,
.obj2 {
  padding: 3px;
  font-size: 15px;
  cursor: pointer;
}

.obj1:hover,
.obj2:hover {
  border-radius: 10px;
  background-color: rgba(87, 187, 201, 0.205);

}


.header-name a {
  color: #990000;
  text-decoration: none;
  text-align: center;
}

.cont-form {
  margin: 200px auto;

}

.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 10px;
  color: red;
  text-align: center;
}

@media (max-width: 600px) {
  .cont-form {
    padding: 20px;
    display: flex;
    position: relative;
    margin-top: 15vh;

  }

  .form-card {
    padding: 20px;
  }

  .header-name a {
    font-size: 20px;
  }

  h2 {
    font-size: 18px;
  }

  .input-group input {
    padding: 8px;
  }

  button {
    font-size: 14px;
  }
}
</style>