<template>
    <div class="cont-form">
        <v-card class="form-card" elevation="12">
            <div class="header-name">
                <RouterLink to="/">
                    <h1>BuscaNet</h1>
                </RouterLink>
            </div>
            <h2>Registrar Cuenta</h2>
            <form @submit.prevent="register">
                <div class="input-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" v-model="nombre" placeholder="Ingrese su nombre" required />
                </div>

                <div class="input-group">
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email" v-model="correo" placeholder="Ingrese su correo" required />
                </div>

                <div class="input-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña" required />
                </div>

                <button type="submit" :disabled="loading">
                    {{ loading ? "Registrando..." : "Registrarse" }}
                </button>

                <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
                <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            </form>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useLoginStore } from '../stores/Login';
import { useRouter } from 'vue-router';

const nombre = ref('');
const correo = ref('');
const password = ref('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);

const loginStore = useLoginStore();
const router = useRouter();

const register = async () => {
    loading.value = true;
    errorMessage.value = null;
    successMessage.value = null;

    try {
        const success = await loginStore.register(nombre.value, correo.value, password.value);

        if (success) {
            successMessage.value = 'Registro exitoso. Redirigiendo a la página de inicio de sesión...';
            setTimeout(() => {
                router.push('/');
            }, 2000);
        } else {
            errorMessage.value = 'Hubo un problema al registrarse. Inténtalo nuevamente.';
        }
    } catch (error) {
        errorMessage.value = 'Ocurrió un error al registrarse.';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.cont-form {
    padding: 100px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-card {
    padding: 40px;
    max-width: 400px;
    width: 100%;
    margin: auto;
}

.header-name a {
    color: #990000;
    text-decoration: none;
    display: block;
    text-align: center;
    font-size: 24px;
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

.error-message,
.success-message {
    margin-top: 10px;
    text-align: center;
}

.error-message {
    color: red;
}

.success-message {
    color: green;
}

/* Responsive */
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
