<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';
import { ref, computed, onMounted } from 'vue'


const loginStore = useLoginStore()
const usuarioStore = useUsuarioStore()

const listaEmpresas = ref<any[]>([])

const DatosEmpresasUsuario = async (id: number) => {

    try {

        await usuarioStore.GetEmpresasByUsuario(id)

        listaEmpresas.value = usuarioStore.empresasUsuario

    } catch (error) {

    }

}


onMounted(() => {
    if (loginStore.usuario?.idUsuario) {
        DatosEmpresasUsuario(loginStore.usuario?.idUsuario)
    } else {
        console.log('No hay un usuario registrado');

    }
})

</script>

<template>

    <div>
        <div class="cont-divisores">
            <div></div>
            <div>Nombre</div>
            <div>Direccion</div>
            <div>Imagen</div>
        </div>
        <div v-if="listaEmpresas.length > 0">
            <div v-for="(empresa, index) in listaEmpresas" :key="index" class="style-form">
                <div class="cont-data-empresa">
                    <p>{{ index+1 }}</p>
                    <p>{{ empresa.empresa.nombre }}</p>
                    <p>{{ empresa.empresa.direccion }}</p>
                    <p>{{ empresa.empresa.imagen }}</p>

                </div>
            </div>
        </div>
        <div v-else>
            <p>No tienes ninguna empesa creada.</p>
        </div>
    </div>
</template>

<style scoped>
.cont-divisores {
    border: 1px solid black;
    display: flex;
    justify-content: space-around;
}

.cont-data-empresa {
    background-color: rgb(226, 232, 255);
    border-radius: 10px;
    margin: 20px;
    padding: 20px;
    box-shadow: 1px 1px 5px black;
    justify-content: space-around;
    display: flex;
}
</style>