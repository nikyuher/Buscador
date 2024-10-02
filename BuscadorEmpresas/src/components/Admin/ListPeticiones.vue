<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePeticionesStore } from '@/stores/Peticiones'
import { useLoginStore } from '@/stores/Login'

const peticionesStore = usePeticionesStore()
const LoginStore = useLoginStore()

const token = LoginStore.token;
const idUsuario = LoginStore.usuario?.idUsuario;

const peticiones = computed(() => peticionesStore.peticiones);
const aceptarPeticion = async (idPeticion: number) => {
    try {

        console.log(idPeticion, token);


        await peticionesStore.AceptarPeticion(idPeticion)
        alert('Petición aceptada correctamente')
        await peticionesStore.GetAllPeticiones()
    } catch (error) {
        console.error('Error al aceptar la petición:', error)
        alert('Error al aceptar la petición.')
    }
}

const rechazarPeticion = async (idPeticion: number) => {
    try {
        if (idUsuario) {
            await peticionesStore.EliminarPeticion(idPeticion)
            alert('Petición rechazada/eliminada correctamente')
            await peticionesStore.GetAllPeticiones()
        }

    } catch (error) {
        console.error('Error al rechazar la petición:', error)
        alert('Error al rechazar la petición.')
    }
}

onMounted(() => {
    peticionesStore.GetAllPeticiones()
    console.log(peticiones);

})
</script>

<template>
    <div>
        <h1>Panel de Administración - Peticiones</h1>
        <div v-if="peticiones.length">
            <table>
                <thead>
                    <tr>
                        <th>ID Petición</th>
                        <th>Nombre Empresa</th>
                        <th>Descripción</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="peticion in peticiones" :key="peticion.idPeticion">
                        <td>{{ peticion.idPeticion }}</td>
                        <td>{{ peticion.nombreEmpresa }}</td>
                        <td>{{ peticion.descripcionEmpresa }}</td>
                        <td>{{ peticion.direccionEmpresa }}</td>
                        <td>
                            <button @click="aceptarPeticion(peticion.idPeticion)">Aceptar</button>
                            <button @click="rechazarPeticion(peticion.idPeticion)">Rechazar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else>
            <p>No hay peticiones pendientes.</p>
        </div>
    </div>
</template>