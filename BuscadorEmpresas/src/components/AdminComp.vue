<script setup lang="ts">
import PanelEmpresas from '@/components/Admin/PanelEmpresas.vue';
import ListaPeticiones from '@/components/Admin/ListPeticiones.vue';
import { ref } from 'vue'

const componenteVisible = ref('ListaPeticiones')
const seleccionado = ref('ListaPeticiones') // Mantiene el elemento seleccionado

const cambiarComponente = (componente: string) => {
  componenteVisible.value = componente
  seleccionado.value = componente // Actualiza el elemento seleccionado
}


</script>

<template>
  <div class="cont-perfil">
    <div class="barra-opciones">
      <p 
        :class="{ activo: seleccionado === 'ListaPeticiones' }" 
        @click="cambiarComponente('ListaPeticiones')"
      >
        Lista de Solicitudes
      </p>
      <p 
        :class="{ activo: seleccionado === 'Empresas' }" 
        @click="cambiarComponente('Empresas')"
      >
        Empresas
      </p>
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
  font-weight: bold; /* Opcional: énfasis adicional */
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
