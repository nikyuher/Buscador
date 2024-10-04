<script setup lang="ts">
import PanelEmpresas from '@/components/Admin/PanelEmpresas.vue';
import ListaPeticiones from '@/components/Admin/ListPeticiones.vue';
import { ref } from 'vue'

const componenteVisible = ref('ListaPeticiones')

const cambiarComponente = (componente: string) => {
  componenteVisible.value = componente
}


</script>

<template>
<div class="cont-perfil">
    <div class="barra-opciones">
      <p @click="cambiarComponente('ListaPeticiones')">Lista de Solicitudes </p>
      <p @click="cambiarComponente('Empresas')">Empresas</p>
    </div>
    <div class="contenido">
      <div v-if="componenteVisible === 'ListaPeticiones'">
        <ListaPeticiones></ListaPeticiones>
      </div>
      <div v-if="componenteVisible === 'Empresas'">
        <PanelEmpresas></PanelEmpresas>
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