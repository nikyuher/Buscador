<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useEmpresaStore } from '../../stores/Empresa';

interface DatosEmpresa {
  idEmpresa: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  imagen: string;
}

const empresaStore = useEmpresaStore();
const nuevaEmpresa = ref<DatosEmpresa>();
const editMode = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const idEmpresa = ref(0)
const nombre = ref('')
const descripcion = ref('')
const direccion = ref('')
const imagen = ref('')

// Cargar las empresas 
onMounted(() => {
  empresaStore.GetAllEmpresas();
});

// limpiar el formulario
const limpiarFormulario = () => {
  idEmpresa.value = 0;
  nombre.value = ''
  descripcion.value = ''
  direccion.value = ''
  imagen.value = ''

  editMode.value = false;
  successMessage.value = '';
  errorMessage.value = '';
};

//  (añadir o editar)
const confirmarEnvio = async () => {
  try {
    // Validar que los campos requeridos no estén vacíos
    if (!nombre.value || !descripcion.value || !direccion.value || !imagen.value) {
      errorMessage.value = 'Por favor, completa todos los campos.';
      return;
    }

    nuevaEmpresa.value = <DatosEmpresa>{
      idEmpresa: idEmpresa.value,
      nombre: nombre.value,
      descripcion: descripcion.value,
      direccion: direccion.value,
      imagen: imagen.value
    }

    if (editMode.value && idEmpresa.value) {
      // Editar empresa


      await empresaStore.PutDatosEmpresa(nuevaEmpresa.value);
      successMessage.value = 'Empresa editada con éxito';
    } else {
      // Añadir nueva empresa
      await empresaStore.CreateEmpresa(nuevaEmpresa.value);

      successMessage.value = 'Empresa creada con éxito';
    }

    limpiarFormulario();
    empresaStore.GetAllEmpresas();
  } catch (error) {
    errorMessage.value = 'Hubo un error en el proceso';
    console.error(error);
  }
};

// seleccionar una empresa y entrar en modo edición
const seleccionarEmpresaParaEditar = (empresa: any) => {
  idEmpresa.value = empresa.idEmpresa;
  nombre.value = empresa.nombre
  descripcion.value = empresa.descripcion
  direccion.value = empresa.direccion
  imagen.value = empresa.imagen
  editMode.value = true;
};

//  eliminar una empresa
const eliminarEmpresa = async (idEmpresa: number) => {
  try {
    await empresaStore.EliminarEmpresa(idEmpresa);
    successMessage.value = 'Empresa eliminada con éxito';
    empresaStore.GetAllEmpresas();
  } catch (error) {
    errorMessage.value = 'Hubo un error al eliminar la empresa';
    console.error(error);
  }
};
</script>


<template>
  <div class="cont-panel-Empresas">
    <h1>Gestión de Empresas</h1>

    <!-- Formulario de añadir/editar empresa -->
    <form @submit.prevent="confirmarEnvio">
      <div>
        <label for="nombre">Nombre de la Empresa:</label>
        <input v-model="nombre" id="nombre" type="text" required />
      </div>

      <div>
        <label for="descripcion">Descripción:</label>
        <textarea v-model="descripcion" id="descripcion" required></textarea>
      </div>

      <div>
        <label for="direccion">Dirección:</label>
        <input v-model="direccion" id="direccion" type="text" required />
      </div>

      <div>
        <label for="imagen">URL de la Imagen:</label>
        <input v-model="imagen" id="imagen" type="text" required />
      </div>

      <div>
        <button type="submit">{{ editMode ? 'Guardar Cambios' : 'Añadir Empresa' }}</button>
        <button type="button" @click="limpiarFormulario">Cancelar</button>
      </div>
    </form>

    <!-- Mensaje error -->
    <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

    <!-- Tabla de empresas -->
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Dirección</th>
          <th>Imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="empresa in empresaStore.listaEmpresas" :key="empresa.idEmpresa">
          <td>{{ empresa.nombre }}</td>
          <td>{{ empresa.descripcion }}</td>
          <td>{{ empresa.direccion }}</td>
          <td><img :src="empresa.imagen" alt="Imagen de la Empresa" width="100" /></td>
          <td>
            <button @click="seleccionarEmpresaParaEditar(empresa)">Editar</button>
            <button @click="eliminarEmpresa(empresa.idEmpresa)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.cont-panel-Empresas {
  background-color: white;
}

form {
  display: flex;
  flex-direction: column;
  margin-left: 15vh;
}

label {
  margin-bottom: 5px;
}

input,
textarea {
  margin-bottom: 10px;
  padding: 5px;
}

h1 {
  text-align: center;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.success-message {
  color: green;
}

.error-message {
  color: red;
}

table {
  width: 80%;
  border-collapse: collapse;
  text-align: center;
  margin-left: 15vh;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
}

img {
  border-radius: 5px;
}
</style>
