import { createRouter, createWebHistory } from 'vue-router';
import { useLoginStore } from '@/stores/Login'; // Ajusta la ruta si es necesario
import Buscador from '@/views/Buscador.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Buscador',
      component: Buscador,
    },
    {
      path: '/Categoria/:nombre,:idCategoria',
      name: 'CatEmpresas',
      component: () => import('@/views/CatEmpresas.vue'),
    },
    {
      path: '/Empresa/:idEmpresa',
      name: 'Empresa',
      component: () => import('@/views/EmpresasView.vue'),
    },
    {
      path: '/Ciudad/:idCiudad',
      name: 'Ciudad',
      component: () => import('@/views/CiudadView.vue'),
    },
    {
      path: '/Solicitudes',
      name: 'Solicitudes',
      component: () => import('@/views/SolicitudesView.vue'),
      meta: { requiresAuth: true }, // Protegida
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('@/views/Register.vue'),
    },
    {
      path: '/PanelAdmin',
      name: 'PanelAdmin',
      component: () => import('@/views/PanelAdmin.vue'),
      meta: { requiresAuth: true }, // Protegida
    },
    {
      path: '/Perfil',
      name: 'Perfil',
      component: () => import('@/views/PerfilView.vue'),
      meta: { requiresAuth: true }, // Protegida
    },
    {
      path: '/ChangePassword',
      name: 'ChangePassword',
      component: () => import('@/views/ChangePasswordView.vue'),
    },
    {
      path: '/Resultado/:empresa/:idCiudad?',
      name: 'Resultado',
      component: () => import('@/views/ResultadosView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/ErrorUrlView.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Validación de token antes de cada navegación
router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();

  if (loginStore.token) {
    loginStore.checkTokenValidity();
  }

  if (to.meta.requiresAuth && !loginStore.token) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;