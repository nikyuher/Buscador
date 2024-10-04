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

const success = ref(false);
const error = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const idEmpresa = ref(0)
const nombre = ref('')
const descripcion = ref('')
const direccion = ref('')
const imagen = ref('')

onMounted(() => {
  empresaStore.GetAllEmpresas();
});

const limpiarFormulario = () => {
  idEmpresa.value = 0;
  nombre.value = ''
  descripcion.value = ''
  direccion.value = ''
  imagen.value = ''

  editMode.value = false;
};

const confirmarEnvio = async () => {
  try {
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

      await empresaStore.PutDatosEmpresa(nuevaEmpresa.value);
      success.value = true;
      error.value = false;
      successMessage.value = 'Empresa editada con éxito';
    } else {
      await empresaStore.CreateEmpresa(nuevaEmpresa.value);

      success.value = true;
      error.value = false;
      successMessage.value = 'Empresa creada con éxito';
    }

    limpiarFormulario();
    empresaStore.GetAllEmpresas();
  } catch (err) {

    success.value = false;
    error.value = true;
    errorMessage.value = 'Hubo un error en el proceso';
    console.error(err);
  }
};

const seleccionarEmpresaParaEditar = (empresa: any) => {
  idEmpresa.value = empresa.idEmpresa;
  nombre.value = empresa.nombre
  descripcion.value = empresa.descripcion
  direccion.value = empresa.direccion
  imagen.value = empresa.imagen
  editMode.value = true;

  subirTop();

};

const eliminarEmpresa = async (idEmpresa: number) => {
  try {
    await empresaStore.EliminarEmpresa(idEmpresa);
    success.value = true;
    error.value = false;
    successMessage.value = 'Empresa eliminada con éxito';
    empresaStore.GetAllEmpresas();
  } catch (err) {
    success.value = false;
    error.value = true;
    errorMessage.value = 'Hubo un error al eliminar la empresa';
    console.error(err);
  }
};

const subirTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>


<template>
  <div class="cont-panel-Empresas">
    <h1>Gestión de Empresas</h1>
    <div class="cont-form">
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
          <button class="aceptar" type="submit">{{ editMode ? 'Guardar Cambios' : 'Añadir Empresa' }}</button>
          <button class="denegar" type="button" @click="limpiarFormulario">Cancelar</button>
        </div>
        <v-snackbar v-model="success" color="green" timeout="2000" location="top" absolute>
          {{ successMessage }}
        </v-snackbar>

        <v-snackbar v-model="error" color="red" timeout="2000" location="top" absolute>
          {{ errorMessage }}
        </v-snackbar>
      </form>
    </div>
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
            <button class="edit" @click="seleccionarEmpresaParaEditar(empresa)"><v-icon>mdi-pen</v-icon></button>
            <button class="denegar" @click="eliminarEmpresa(empresa.idEmpresa)"><v-icon>mdi-delete</v-icon></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <button class="btn-subir-top" @click="subirTop">
    <v-icon>mdi-arrow-up</v-icon>
  </button>
</template>

<style scoped>
.btn-subir-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  background-color: #49bd44;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 10px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.btn-subir-top:hover {
  background-color: #45a049;
}


.cont-form {
  border-bottom: 1px solid rgb(134, 134, 134);
  display: flex;
  padding: 20px;
  align-items: center;
  width: 85%;
  justify-content: center;
  margin: 20px auto;
}

.cont-panel-Empresas {
  background-color: white;
}

label {
  margin-bottom: 5px;
}

input,
textarea {
  margin-bottom: 10px;
  padding: 5px;
  margin: 10px;
  width: 100%;
  border: 1px solid black;

}

h1 {
  text-align: center;
}

.aceptar {
  padding: 10px;
  background-color: #49bd44;
  color: white;
}

.edit {
  padding: 10px;
  background-color: #fab83e;
  color: white;
}

.denegar {
  padding: 10px;
  background-color: #ff3535;
  color: white;
}

.aceptar:hover {
  background-color: #45a049;
}

.edit:hover {
  background-color: #c27816;
}

.denegar:hover {
  background-color: #861010;
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
</style>
