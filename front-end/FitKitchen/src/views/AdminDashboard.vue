<template>
  <NavbarAdmin />
  <main class="dashboard-content">

    
    <header class="page-header">
      <h1>Admin Dashboard</h1>
      <p>Welcome back! Here's what's happening today.</p>
    </header>

    <section class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <div class="icon-wrapper green-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <span class="badge positive">+12.5%</span>
        </div>
        <div class="stat-card-body">
          <h2>1247</h2>
          <p>Total Users</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <div class="icon-wrapper orange-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
          </div>
          <span class="badge positive">+8.2%</span>
        </div>
        <div class="stat-card-body">
          <h2>8</h2>
          <p>Total Recipes</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <div class="icon-wrapper green-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <span class="badge positive">+5.1%</span>
        </div>
        <div class="stat-card-body">
          <h2>892</h2>
          <p>Active Users</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <div class="icon-wrapper blue-light">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
          </div>
          <span class="badge positive">+24</span>
        </div>
        <div class="stat-card-body">
          <h2>24</h2>
          <p>New This Month</p>
        </div>
      </div>
    </section>

    <section class="main-grid">
      
      <div class="content-card recent-recipes">
        <div class="card-header">
          <h3>Recent Recipes</h3>
          <router-link to="/RecipeManagement" class="view-all">View All</router-link>
        </div>
        <div class="recipe-list">
          <div v-for="recipe in recentRecipes" :key="recipe.id" class="recipe-item">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-img" />
            <div class="recipe-info">
              <h4>{{ recipe.title }}</h4>
              <p>{{ recipe.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <aside class="side-panel">
        
        <div class="content-card quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <router-link to="/admin/add-recipe" class="btn-action primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add New Recipe
            </router-link>
            <router-link to="/RecipeManagement" class="btn-action secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              Manage Recipes
            </router-link>
            <router-link to="/userManagement" class="btn-action secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Manage Users
            </router-link>
          </div>
        </div>

        <div class="info-card">
          <div class="info-header">
            <svg class="chef-hat" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
              <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"></path>
              <line x1="6" y1="17" x2="18" y2="17"></line>
            </svg>
            <h3>FitKitchen Admin</h3>
          </div>
          <p>Manage your recipe platform efficiently with powerful admin tools.</p>
          <div class="last-updated">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            Last updated: Today
          </div>
        </div>

      </aside>
    </section>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { recipes } from '../data/recipes.js' 
import NavbarAdmin from '../components/NavbarAdmin.vue';

// Mengambil 5 resep teratas untuk ditampilkan di dashboard
const recentRecipes = computed(() => {
  return recipes.slice(0, 5)
})
</script>

<style scoped>
/* Base Layout */
.dashboard-content {
  padding: 2.5rem 4rem;
  background-color: #FAFAFA;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  color: #1A1A1A;
}

/* Header */
.page-header {
  margin-bottom: 2rem;
}
.page-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.page-header p {
  color: #6B7280;
  font-size: 0.95rem;
}

/* Stats Grid (Top Cards) */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #F3F4F6;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-wrapper.green-light { background-color: #DCFCE7; }
.icon-wrapper.orange-light { background-color: #FFEDD5; }
.icon-wrapper.blue-light { background-color: #DBEAFE; }

.badge.positive {
  background-color: #DCFCE7;
  color: #16A34A;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 20px;
}

.stat-card-body h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-card-body p {
  color: #6B7280;
  font-size: 0.85rem;
}

/* Main Content Grid */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

/* Generic Card Styles */
.content-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #F3F4F6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.card-header h3, .quick-actions h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

/* Recent Recipes Section */
.view-all {
  color: #22C55E;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
}

.recipe-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.recipe-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.recipe-img {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid #F3F4F6;
}

.recipe-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.recipe-info p {
  font-size: 0.85rem;
  color: #6B7280;
}

/* Side Panel (Kanan) */
.side-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Quick Actions Section */
.quick-actions h3 {
  margin-bottom: 1.25rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-action {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-action.primary {
  background-color: #22C55E;
  color: white;
}

.btn-action.primary:hover {
  background-color: #16A34A;
}

.btn-action.secondary {
  background-color: #F9FAFB;
  color: #111827;
  border: 1px solid #F3F4F6;
}

.btn-action.secondary:hover {
  background-color: #F3F4F6;
}

/* Info Card */
.info-card {
  background: linear-gradient(90deg, #E8F5E9 0%, #FFF3E0 100%);
  border: 1px solid #DCFCE7;
  border-radius: 12px;
  padding: 1.5rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.info-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.info-card p {
  font-size: 0.85rem;
  color: #6B7280;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.last-updated {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #9CA3AF;
}
</style>