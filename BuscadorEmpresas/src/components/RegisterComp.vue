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
                    <div v-if="!isNombreValid" class="error-message">El nombre debe tener más de 3 caracteres.</div>
                </div>

                <div class="input-group">
                    <label for="email">Correo electrónico</label>
                    <input type="email" id="email" v-model="correo" placeholder="Ingrese su correo" required />
                    <div v-if="!isEmailValid" class="error-message">El correo debe ser un @gmail.com válido.</div>
                </div>

                <div class="input-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" v-model="password" placeholder="Ingrese su contraseña"
                        required />
                    <div v-if="!isPasswordValid" class="error-message">
                        La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, un número y
                        un símbolo.
                    </div>
                </div>
                <div class="changePassword">
                    <span class="obj1">
                        <RouterLink to="/Login">¿Ya tienes una cuenta?</RouterLink>
                    </span>
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
import { ref, computed } from 'vue';
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

// Validaciones
const isNombreValid = ref(true);
const isEmailValid = ref(true);
const isPasswordValid = ref(true);

const register = async () => {
    isNombreValid.value = nombre.value.length > 3;
    isEmailValid.value = /.+@gmail\.com$/.test(correo.value);
    isPasswordValid.value = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password.value);


    if (!isEmailValid.value || !isPasswordValid.value || !isNombreValid) {
        return;
    }


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
.changePassword {
    display: flex;
    margin-bottom: 10px;
    padding: 5px;
    justify-content: end;
    flex-wrap: wrap;
}

.changePassword a {
    text-decoration: none;
    color: #0b57d0;
}

.obj1,
.obj2 {
    padding: 5px;
    cursor: pointer;
}

.obj1:hover,
.obj2:hover {
    border-radius: 10px;
    background-color: rgba(87, 187, 201, 0.205);

}

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
