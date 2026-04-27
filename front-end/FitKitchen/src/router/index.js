import { createRouter, createWebHistory } from 'vue-router'

// Import semua halaman yang sudah dibuat
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



const routes = [
  {
    path: '/',
    name: 'Landing',
    component: Landing
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/menu/:id', 
    name: 'MenuDetail',
    component: Menu
  },
  {
    path: '/meal-planner',
    name: 'MealPlanner',
    component: MealPlanner
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: Calculator
  },
  {
    path: '/RecipeManagement',
    name: 'RecipeManagement',
    component: RecipeManagement
  },
  // router/index.js
{
  path: '/admin/add-recipe',
  name: 'AddRecipe',
  component: AddRecipe 
},
  {
    path: '/userManagement',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const userRole = localStorage.getItem('userRole')

  if (to.meta.requiresAdmin && (!isAuthenticated || userRole !== 'admin')) {
    next('/login') // Tendang ke login jika belum login/bukan admin
  } else {
    next()
  }
})

export default router