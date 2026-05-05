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
  { path: '/register', name: 'Register', component: Register },
  
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

  // Rute Publik lainnya
  { path: '/menu/:id', name: 'MenuDetail', component: Menu },
  { path: '/RecipeManagement', name: 'RecipeManagement', component: RecipeManagement },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from) => {
  // 1. Ambil data dari localStorage
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole') 

  // 2. STATE-LOCKED NAVIGATION CHECK
  const isDirectUrlAccess = !from.name;

  if (to.meta.locked && isDirectUrlAccess) {
    return { name: 'Landing' } 
  }

  // 3. LOGIKA PROTEKSI ADMIN
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    return { name: 'Landing' }
  }

  // 4. LOGIKA PROTEKSI USER UMUM
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' } 
  }

  // 5. LOGIKA GUEST 
  if (to.meta.requiresGuest && token) {
    return { name: 'Landing' } 
  }

  // WAJIB: Izinkan navigasi jika tidak ada kondisi yang terpenuhi di atas
  return true 
})

export default router