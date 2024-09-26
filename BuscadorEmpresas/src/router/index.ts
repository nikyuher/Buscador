import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatEmpresas from '@/views/CatEmpresas.vue'
import Buscador from '@/views/Buscador.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import { useLoginStore } from '../stores/Login';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Buscador',
      component: Buscador
    },
    {
      path: '/Categoria/:nombre,:idCategoria',
      name: 'CatEmpresas',
      component: () => import('../views/CatEmpresas.vue')
    },
    {
      path: '/Empresa/:idEmpresa',
      name: 'Empresa',
      component: () => import('../views/EmpresasView.vue')
    },
    {
      path: '/Ciudad/:idCiudad',
      name: 'Ciudad',
      component: () => import('../views/CiudadView.vue')
    },
    {
      path: '/Ciudad/:idCiudad/empresas/:idEmpresa',
      name: 'CiudadEmpresas',
      component: () => import('../views/CiudadEmpresasView.vue')
    },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register }
  ]
})

export default router
