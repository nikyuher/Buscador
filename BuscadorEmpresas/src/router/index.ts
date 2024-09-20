import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CatEmpresas from '@/views/CatEmpresas.vue'
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
      path: '/CatEmpresas/:idCategoria',
      name: 'CatEmpresas',
      component: () => import('../views/CatEmpresas.vue')
    },
    {
      path: '/Empresa/:idEmpresa',
      name: 'Empresa',
      component: () => import('../views/EmpresasView.vue')
    }
  ]
})

export default router
