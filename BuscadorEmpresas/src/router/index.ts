import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatEmpresas from '@/views/CatEmpresas.vue'
import Buscador from '@/views/Buscador.vue'
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import { useLoginStore } from '../stores/Login';
import PanelAdmin from '@/views/PanelAdmin.vue';

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
    {
      path: '/Solicitudes',
      name: 'Solicitudes',
      component: () => import('../views/Solicitudes.vue')
    },
    { path: '/Login', name: 'Login', component: Login },
    { path: '/Register', name: 'Register', component: Register },
    {
      path: '/PanelAdmin',
      name: 'PanelAdmin',
      component: PanelAdmin,
      beforeEnter: (to, from, next) => {
        const loginStore = useLoginStore();
        if (loginStore.rol) {
          next();
        } else {
          next('/Login');
        }
      }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();
  if (to.path === '/PanelAdmin' && !loginStore.rol) {
    next('/Login');
  } else {
    next();
  }
})

export default router
