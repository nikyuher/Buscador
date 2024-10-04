<script setup lang="ts">
import ListaEmpresas from '@/components/Usuario/EmpresasUsuario.vue'
import ListaPeticiones from '@/components/Usuario/PeticionesUsuario.vue'
import DatosUsuario from '@/components/Usuario/DatosUsuario.vue'

import { ref } from 'vue'

const componenteVisible = ref('DatosUsuario')

const cambiarComponente = (componente: string) => {
  componenteVisible.value = componente
}

</script>

<template>
  <div class="cont-perfil">
    <div class="barra-opciones">
      <p @click="cambiarComponente('DatosUsuario')">Información Usuario</p>
      <p @click="cambiarComponente('ListaPeticiones')">Mis solicitudes</p>
      <p @click="cambiarComponente('ListaEmpresas')">Mis empresas</p>
    </div>
    <div class="contenido">
      <!-- Muestra el componente correspondiente según la opción seleccionada -->
      <div v-if="componenteVisible === 'DatosUsuario'">
        <DatosUsuario></DatosUsuario>
      </div>
      <div v-if="componenteVisible === 'ListaPeticiones'">
        <ListaPeticiones></ListaPeticiones>
      </div>
      <div v-if="componenteVisible === 'ListaEmpresas'">
        <ListaEmpresas></ListaEmpresas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.barra-opciones {
  background-color: rgb(131, 81, 177);
  width: 300px;
  color: rgb(219, 219, 219);
  padding: 30px;
}
.barra-opciones p:hover {
  color: rgb(255, 255, 255);
  cursor: pointer;
}

.cont-perfil {
  display: flex;
  background-color: rgb(255, 255, 255);
  min-height: 600px;
}

.contenido {
  flex-grow: 1;
  padding: 20px;
}
</style>
