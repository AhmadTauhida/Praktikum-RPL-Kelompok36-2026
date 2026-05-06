import { createRouter, createWebHistory } from 'vue-router'

// Import halaman
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Menu from '../views/Menu.vue'
import MealPlanner from '../views/MealPlanner.vue'
import Profile from '../views/Profile.vue'
import RecipeManagement from '../views/RecipeManagement.vue'
import Calculator from '../views/Calculator.vue'
import UserManagement from '../views/userManagement.vue'
import AddRecipe from '../views/AddRecipe.vue'
import AdminDashboard from '../views/AdminDashboard.vue' 
import editResep from '../views/editResep.vue'

const routes = [
  { path: '/', name: 'Landing', component: Landing },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresGuest: true } 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register,
    meta: { requiresGuest: true, locked: true }
  },

  // Rute untuk User yang Login (State-Locked)
  { 
    path: '/meal-planner', 
    name: 'MealPlanner', 
    component: MealPlanner,
    meta: { requiresAuth: true, locked: true } 
  },
  { 
    path: '/profile', 
    name: 'Profile', 
    component: Profile,
    meta: { requiresAuth: true, locked: true } 
  },
  { 
    path: '/calculator', 
    name: 'Calculator', 
    component: Calculator,
    meta: { requiresAuth: true, locked: true } 
  },

  // Rute Khusus Admin (State-Locked)
  { 
    path: '/admin', 
    name: 'AdminDashboard', 
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true, locked: true } 
  },
  { 
    path: '/admin/add-recipe', 
    name: 'AddRecipe', 
    component: AddRecipe,
    meta: { requiresAuth: true, requiresAdmin: true, locked: true } 
  },
  { 
    path: '/userManagement', 
    name: 'UserManagement', 
    component: UserManagement,
    meta: { requiresAuth: true, requiresAdmin: true, locked: true } 
  },
  {
    path: '/edit-resep/:id',
    name: 'EditResep',
    component: editResep,
    meta: { requiresAuth: true, requiresAdmin: true, locked: true }
  },
    { path: '/RecipeManagement', name: 'RecipeManagement', component: RecipeManagement,
    meta: { requiresAuth: true, requiresAdmin: true, locked: true }
  },

  // Rute Publik lainnya
  { path: '/menu/:id', name: 'MenuDetail', component: Menu },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  const isManualAccess = !from.name;

  // 1. PROTEKSI GUEST (Mencegah user/admin yang sudah login masuk ke Login/Register)
  if (to.meta.requiresGuest && token) {
    // Jika admin iseng ke /login, kembalikan ke dashboard admin. Jika user, ke landing.
    return userRole === 'admin' ? { name: 'AdminDashboard' } : { name: 'Landing' };
  }

  // 2. PROTEKSI AUTHENTICATION
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' };
  }

  // 3. PROTEKSI ADMIN KE HALAMAN USER (Fitur Baru)
  // Membaca logika: "Jika rute ini butuh login, TAPI bukan rute admin, dan yang akses adalah admin"
  if (to.meta.requiresAuth && !to.meta.requiresAdmin && userRole === 'admin') {
    return { name: 'AdminDashboard' }; // Tendang admin ke dashboard
  }

  // 4. PROTEKSI ROLE (User biasa mencoba masuk ke halaman Admin)
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    return { name: 'Landing' };
  }

  // 5. CEK AKSES URL MANUAL (State-Locked)
  // Ditaruh paling bawah agar proteksi auth & role bekerja lebih dulu.
  if (to.meta.locked && isManualAccess) {
    // Jika yang refresh adalah admin, amankan agar tidak terpental jika refresh halaman admin sendiri
    if (userRole === 'admin' && to.name !== 'AdminDashboard') {
      return { name: 'AdminDashboard' };
    } 
    // Jika yang refresh adalah user biasa
    else if (userRole !== 'admin') {
      return { name: 'Landing' };
    }
  }
});

export default router