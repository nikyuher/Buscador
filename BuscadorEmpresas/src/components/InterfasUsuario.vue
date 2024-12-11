<script setup lang="ts">
import ListaEmpresas from '@/components/Usuario/EmpresasUsuario.vue'
import ListaPeticiones from '@/components/Usuario/PeticionesUsuario.vue'
import DatosUsuario from '@/components/Usuario/DatosUsuario.vue'

import { ref } from 'vue'

const componenteVisible = ref('DatosUsuario')
const seleccionado = ref('DatosUsuario') // Mantiene el elemento seleccionado

const cambiarComponente = (componente: string) => {
  componenteVisible.value = componente
  seleccionado.value = componente // Actualiza el elemento seleccionado
}


</script>

<template>
  <div class="cont-perfil">
    <div class="barra-opciones">
      <p :class="{ activo: seleccionado === 'DatosUsuario' }" @click="cambiarComponente('DatosUsuario')">
        Información Usuario
      </p>
      <p :class="{ activo: seleccionado === 'ListaPeticiones' }" @click="cambiarComponente('ListaPeticiones')">
        Mis solicitudes
      </p>
      <p :class="{ activo: seleccionado === 'ListaEmpresas' }" @click="cambiarComponente('ListaEmpresas')">
        Mis empresas
      </p>
    </div>
    <div class="contenido">
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
  background-color: rgb(80, 91, 114);
  width: 300px;
  color: rgb(219, 219, 219);
  padding: 30px;
}

.barra-opciones p {
  transition: color 0.3s ease;
}

.barra-opciones p:hover {
  color: rgb(255, 255, 255);
  cursor: pointer;
}

.barra-opciones p.activo {
  color: white;
  font-weight: bold;
  /* Opcional: para mayor énfasis */
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
@media (max-width: 430px) {
.cont-perfil{
  display: grid;
}
.barra-opciones{
  width: 100%;
}
}
</style>
