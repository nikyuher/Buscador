<script setup lang="ts">
import { useLoginStore } from '@/stores/Login';
import { useUsuarioStore } from '@/stores/Usuario';
import { ref, computed, onMounted } from 'vue'


const loginStore = useLoginStore()
const usuarioStore = useUsuarioStore()

const ListaPeticiones = ref<any[]>([])

const DatosPeticionesUsuario = async (id: number) => {

    try {

        await usuarioStore.GetPeticionesByUsuario(id)

        ListaPeticiones.value = usuarioStore.peticionesUsuario

    } catch (error) {

    }

}

onMounted(() => {
    if (loginStore.usuario?.idUsuario) {
        DatosPeticionesUsuario(loginStore.usuario?.idUsuario)
    } else {
        console.log('No hay un usuario registrado');

    }
})

</script>

<template>

    <div>
        <div v-if="ListaPeticiones.length > 0">
            <div v-for="(peticion, index) in ListaPeticiones" :key="index">
                <div class="cont-data-peticion">
                    <p>ID Peticion: {{ peticion.idPeticion }}</p>
                    <p>nombre : {{ peticion.nombreEmpresa }}</p>
                    <p>descripcion : {{ peticion.descripcionEmpresa }}</p>
                    <p>direccion : {{ peticion.direccionEmpresa }}</p>
                    <p>imagen : {{ peticion.imagenEmpresaURL }}</p>
                </div>
            </div>
        </div>
        <div v-else>
            <p>¡No tienes ninguna peticion pediente!</p>
        </div>
    </div>
</template>

<style scoped>
.cont-data-peticion{

    background-color: rgb(226, 232, 255);
    border-radius: 10px;
    margin: 20px;
    padding: 20px;
    box-shadow: 5px 5px 10px black
}
</style>