import { createRouter, createWebHistory } from 'vue-router'

// Import semua halaman yang sudah dibuat
import Landing from '../views/Landing.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Menu from '../views/Menu.vue'
import MealPlanner from '../views/MealPlanner.vue'
import Profile from '../views/Profile.vue'
import Admin from '../views/Admin.vue'
import Calculator from '../views/Calculator.vue'

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
    path: '/admin',
    name: 'Admin',
    component: Admin
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router