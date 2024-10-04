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
            <h2 style="margin: 5px 50px 30px 50px;">Mis Empresas</h2>
            <table>
                <thead>
                    <tr>
                        <th> Nº</th>
                        <th>Nombre</th>
                        <th>Direccion</th>
                        <th>Imagen</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(empresa, index) in listaEmpresas" :key="index" class="style-form">
                        <td>{{ index + 1 }}</td>
                        <td>{{ empresa.empresa.nombre }}</td>
                        <td>{{ empresa.empresa.direccion }}</td>
                        <td><img :src="empresa.empresa.imagen" alt="Imagen Empresa" width="100" /></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else style="text-align: center; margin: 20px;">
            <h2 style="margin: 5px 50px 30px 50px;">Mis Empresas</h2>
            <p>No tienes ninguna empesa creada.</p>
        </div>
    </div>
</template>

<style scoped>
label {
    margin-bottom: 5px;
}

table {
    width: 80%;
    border-collapse: collapse;
    text-align: center;
    margin: auto;
}

th,
td {
    border: 1px solid black;
    padding: 8px;
}

img {
  border-radius: 5px;
}

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