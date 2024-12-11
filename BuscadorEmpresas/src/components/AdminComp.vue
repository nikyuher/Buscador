<script setup lang="ts">
import PanelEmpresas from '@/components/Admin/PanelEmpresas.vue';
import ListaPeticiones from '@/components/Admin/ListPeticiones.vue';
import { ref, onMounted, onUnmounted } from 'vue';

const componenteVisible = ref('ListaPeticiones')
const seleccionado = ref('ListaPeticiones') // Mantiene el elemento seleccionado
const mostrarOpciones = ref(false);

const cambiarComponente = (componente: string) => {
  componenteVisible.value = componente
  seleccionado.value = componente // Actualiza el elemento seleccionado
}

const toggleOpciones = () => {
  mostrarOpciones.value = !mostrarOpciones.value;
};

// Verifica el ancho de la ventana y ajusta mostrarOpciones
const checkWindowWidth = () => {
  if (window.innerWidth > 620) {
    mostrarOpciones.value = true; // Muestra siempre las opciones en pantallas grandes
  } else {
    mostrarOpciones.value = false; // Oculta por defecto en pantallas pequeñas
  }
};

onMounted(() => {
  window.addEventListener('resize', checkWindowWidth);
  checkWindowWidth(); // Ejecuta al montarse
});

onUnmounted(() => {
  window.removeEventListener('resize', checkWindowWidth);
});
</script>

<template>
  <div class="cont-perfil">
    <div class="icon-menu">
      <v-icon class="boton-menu" @click="toggleOpciones">mdi-menu</v-icon>
    </div>
    <div class="barra-opciones" :class="{ visible: mostrarOpciones, oculto: !mostrarOpciones }">
      <p :class="{ activo: seleccionado === 'ListaPeticiones' }" @click="cambiarComponente('ListaPeticiones')">
        Lista de Solicitudes
      </p>
      <p :class="{ activo: seleccionado === 'Empresas' }" @click="cambiarComponente('Empresas')">
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
.icon-menu {
  display: none;
  background-color: rgb(80, 91, 114);
  color: white;
  padding: 10px;
  font-size: 20px;
}

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
  /* Opcional: énfasis adicional */
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
.barra-opciones.oculto {
  display: none;
}

.barra-opciones.visible {
  display: block;
}

@media (max-width: 620px) {
  .cont-perfil {
    display: block;
  }

  .icon-menu {
    display: block;
  }
  .barra-opciones{
    width: 100%;
  }
}
</style>
