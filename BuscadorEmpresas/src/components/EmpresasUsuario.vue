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
        <div v-if="listaEmpresas.length > 0">
            <div v-for="(empresa, index) in listaEmpresas" :key="index">
                <div class="cont-data-empresa">
                    <p>ID Empresa Usuario: {{ empresa.idUsuarioEmpresa }}</p>
                    <p>ID Empresa: {{ empresa.idEmpresa }}</p>
                    <p>nombre empresa: {{ empresa.empresa.nombre }}</p>
                </div>
            </div>
        </div>
        <div v-else>
            <p>No tienes ninguna empesa creada.</p>
        </div>
    </div>
</template>

<style scoped>
.cont-data-empresa{

background-color: rgb(226, 232, 255);
border-radius: 10px;
margin: 20px;
padding: 20px;
box-shadow: 5px 5px 10px black
}
</style>