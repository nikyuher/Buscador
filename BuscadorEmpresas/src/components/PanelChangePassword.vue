<script setup lang="ts">
import router from '@/router';
import { useLoginStore } from '@/stores/Login';
import { onMounted, ref } from 'vue';

const loginStore = useLoginStore();

const email = ref('')
const codigo = ref(0)
const password = ref('')
const confirmPassword = ref('')

const success = ref(false);
const error = ref(false);
const Message = ref('');

const paso1 = ref(false)
const paso2 = ref(false)

const Solicitar = async () => {
    try {

        await loginStore.solicitarRecuperacion(email.value);

        success.value = true;
        error.value = false;
        Message.value = 'Solicitud enviada exitosamente';
        paso1.value = true;

    } catch (err) {
        success.value = false;
        error.value = true;
        Message.value = `${err}`;
    }
}

const VerificarCodigo = async () => {
    try {

        if (loginStore.email) {
            await loginStore.VerificarCodigo(loginStore.email, codigo.value)

            Message.value = 'Verificado correctamente';
            success.value = true;
            paso2.value = true
            error.value = false;
        }
    } catch (err) {
        success.value = false;
        error.value = true;
        Message.value = `${err}`;
    }
}

const RestablecerContraseña = async () => {
    try {
        if (loginStore.email && loginStore.codigo) {

            await loginStore.RestablecerContrasena(loginStore.email, loginStore.codigo, password.value, confirmPassword.value)

            success.value = true;
            error.value = false;
            Message.value = 'Contraseña Restablecida';

            email.value = ''
            codigo.value = 0
            password.value = ''
            confirmPassword.value = ''
            router.push('/login')
        }
    } catch (err) {
        success.value = false;
        error.value = true;
        Message.value = `${err}`;
    }
}

const retroceder = () => {
    email.value = ''
    codigo.value = 0
    paso1.value = false;
    paso2.value = false;
    localStorage.removeItem('email');
    localStorage.removeItem('codigo');
}

onMounted(() => {
    if (loginStore.email != null) {
        paso1.value = true
    }
    if (loginStore.codigo != null) {
        paso2.value = true
    }
})
</script>

<template>
    <div class="container">
        <div v-if="!paso1">
            <h1>Recuperar cuenta</h1>
            <p>Para cambiar tu contraseña debes introducir el correo electronico creado en la pagina de BuscaNet.</p>
            <form @submit.prevent="Solicitar">
                <input v-model="email" type="email" placeholder="ejemplo@gmail.com" required>
                <button type="submit">Enviar</button>
            </form>
        </div>
        <div v-if="paso1 && !paso2">
            <v-icon @click="retroceder"
                style="background-color: red; color: white; border-radius: 50%; padding: 20px">mdi-arrow-left</v-icon>
            <v-card class="py-8 px-6 text-center mx-auto ma-4" elevation="12" max-width="400" width="100%">
                <h3 class="text-h6 mb-4">Verify Your Account</h3>

                <div class="text-body-2">
                    Enviamos un código de verificación a {{ loginStore.email }} <br>

                    Por favor revise su correo electrónico y pegue el código a continuación.
                </div>

                <form @submit.prevent="VerificarCodigo">
                    <v-otp-input v-model="codigo" length="5"></v-otp-input>

                    <v-btn type="submit" class="my-4" color="purple" height="40" text="Verificar" variant="flat"
                        width="70%"></v-btn>
                </form>

                <div class="text-caption">
                    ¿No recibes el codigo? <a href="#" @click="Solicitar">Reenviar</a>
                </div>
            </v-card>
        </div>
        <div v-if="paso1 && paso2">
            <v-icon @click="retroceder"
                style="background-color: red; color: white; border-radius: 50%; padding: 20px">mdi-arrow-left</v-icon>
            <h1>Restablecer contraseña </h1>
            <h4>Recuerda revisar tu Email para obtener el codio de verificacion</h4>

            <form @submit.prevent="RestablecerContraseña">
                <label>Nueva contraseña</label>
                <input v-model="password" type="password" required>
                <label>Confirmar contraseña</label>
                <input v-model="confirmPassword" type="password" required>
                <v-btn type="submit" class="my-4" color="purple" height="40" text="Confirmar" variant="flat"
                    width="70%"></v-btn>
            </form>
        </div>
        <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
            {{ Message }}
        </v-snackbar>

        <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
            {{ Message }}
        </v-snackbar>
    </div>
</template>

<style scoped>
.container {
    max-width: 400px;
    margin: 200px auto;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgb(83, 83, 83);
}

input {
    border-radius: 8px;
    box-shadow: 0 2px 5px rgb(83, 83, 83);
    width: 100%;
    margin: 10px auto;
    padding: 10px;
    text-decoration: none;
}
</style>