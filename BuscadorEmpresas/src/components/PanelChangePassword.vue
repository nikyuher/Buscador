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
        <v-card v-if="!paso1" class="py-8 px-6 text-center mx-auto ma-4" elevation="12" max-width="400"
        width="100%">
            <h1>Recuperar cuenta</h1>
            <p>Introduce tu correo electronico con el cual creaste tu cuenta de BuscaNet.</p>
            <form @submit.prevent="Solicitar">
                <input v-model="email" type="email" placeholder="ejemplo@gmail.com" required>
                <div style="display: flex; justify-content: space-between;">
                    <div class="diseño-boton my-4">
                        <router-link to="/login">
                            <v-icon @click="retroceder">
                                mdi-arrow-left
                            </v-icon>
                            atras
                        </router-link>
                    </div>
                    <v-btn type="submit" class="my-4" color="purple"  text="Enviar" variant="flat">
                    </v-btn>
                </div>
            </form>
        </v-card>
        <v-card v-if="paso1 && !paso2" class="py-8 px-6 text-center mx-auto ma-4" elevation="12" max-width="400"
            width="100%">
            <h3 class="text-h6 mb-4">Verify Your Account</h3>

            <div class="text-body-2">
                Enviamos un código de verificación a <strong>{{ loginStore.email }}</strong> <br>
                Por favor revise su correo electrónico y pegue el código a continuación.
            </div>
            <form @submit.prevent="VerificarCodigo">
                <v-otp-input v-model="codigo" length="5"></v-otp-input>

                <v-btn type="submit" class="my-4" color="purple" height="40" text="Verificar" variant="flat"
                    width="70%">
                </v-btn>
            </form>
            <div class="text-caption">
                ¿No recibes el codigo? <a href="#" @click="Solicitar">Reenviar</a>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <div class="diseño-boton">
                    <v-icon @click="retroceder">
                        mdi-arrow-left
                    </v-icon>
                    atras
                </div>
            </div>
        </v-card>
        <v-card v-if="paso1 && paso2" class="py-8 px-6 text-left mx-auto ma-4" elevation="12" max-width="400"
            width="100%">
            <h1>Restablecer contraseña </h1>
            <h4>Recuerda revisar tu Email para obtener el codio de verificacion</h4>
            <form @submit.prevent="RestablecerContraseña">
                <label>Nueva contraseña</label>
                <input v-model="password" type="password" required>
                <label>Confirmar contraseña</label>
                <input v-model="confirmPassword" type="password" required>
                <div style="display: flex; justify-content: space-between;">
                    <div class="diseño-boton my-4" @click="retroceder">
                        <v-icon>
                            mdi-arrow-left
                        </v-icon>
                        atras
                    </div>
                    <v-btn type="submit" class="my-4" color="purple" height="40" text="Confirmar" variant="flat">
                    </v-btn>
                </div>
            </form>
        </v-card>
        <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
            {{ Message }}
        </v-snackbar>

        <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
            {{ Message }}
        </v-snackbar>
    </div>
</template>

<style scoped>
.diseño-boton {
    display: flex;
}

.diseño-boton {
    color: #0b57d0;
    padding: 7px;
    align-items: center;
    height: 30px;
}

a {
    text-decoration: none;
    color: #0b57d0;
}

.diseño-boton:hover {
    border-radius: 10px;
    background-color: rgba(87, 187, 201, 0.205);

}

.container {
    max-width: 400px;
    margin: 200px auto;
    padding: 20px;
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