import { createRouter, createWebHistory } from 'vue-router'

import Buscador from '@/views/Buscador.vue'

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
      component: () => import('../views/SolicitudesView.vue')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/PanelAdmin',
      name: 'PanelAdmin',
      component: () => import('../views/PanelAdmin.vue')
    },
    {
      path: '/Perfil',
      name: 'Perfil',
      component: () => import('../views/PerfilView.vue')
    },
    {
      path: '/ChangePassword',
      name: 'ChangePassword',
      component: () => import('../views/ChangePasswordView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/ErrorUrlView.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
