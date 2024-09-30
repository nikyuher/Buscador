<template>
    <div>
        <h1>Panel de Administración - Peticiones</h1>

        <!-- Mostramos el listado de peticiones -->
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

        <!-- Si no hay peticiones, mostramos un mensaje -->
        <div v-else>
            <p>No hay peticiones pendientes.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { usePeticionesStore } from '../stores/Peticiones'
import { useLoginStore } from '../stores/Login'

// Instanciamos el store de peticiones
const peticionesStore = usePeticionesStore()
const LoginStore = useLoginStore()

const token = LoginStore.token;
const idUsuario = LoginStore.usuario?.idUsuario;

// Accedemos a las peticiones directamente del store
const peticiones = computed(() => peticionesStore.peticiones);
// Método para aceptar una petición
const aceptarPeticion = async (idPeticion: number) => {
    try {

        console.log(idPeticion, token);


        await peticionesStore.AceptarPeticion(idPeticion)
        alert('Petición aceptada correctamente')
        // Refrescamos las peticiones después de aceptar una
        await peticionesStore.GetAllPeticiones()
    } catch (error) {
        console.error('Error al aceptar la petición:', error)
        alert('Error al aceptar la petición.')
    }
}

// Método para rechazar una petición (en este caso eliminamos la petición)
const rechazarPeticion = async (idPeticion: number) => {
    try {
        if (idUsuario) {
            await peticionesStore.EliminarPeticion(idPeticion)
            alert('Petición rechazada/eliminada correctamente')
            // Refrescamos las peticiones después de rechazar una
            await peticionesStore.GetAllPeticiones()
        }

    } catch (error) {
        console.error('Error al rechazar la petición:', error)
        alert('Error al rechazar la petición.')
    }
}

// Obtenemos las peticiones al montar el componente
onMounted(() => {
    peticionesStore.GetAllPeticiones()
    console.log(peticiones);

})
</script>

<style scoped>
table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
}

table th,
table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}

button {
    margin-right: 10px;
    padding: 6px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>