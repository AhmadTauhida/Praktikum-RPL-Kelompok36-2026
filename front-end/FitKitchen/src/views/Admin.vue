<template>
  <NavbarAdmin />
  <div class="admin-container">
    
    <div class="page-header">
      
      <div class="header-titles">
        <h1>Recipe Management</h1>
        <p>Manage all recipes in the system</p>
      </div>
        <router-link to="/admin/add-recipe" class="btn-add-link" style="text-decoration: none;">
          <button class="btn-add">
           Add Recipe
          </button>
        </router-link>
      </div>

    <div class="controls-section">
      <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search recipes..." 
          class="search-input"
        />
      </div>
      <div class="filter-placeholder"></div>
    </div>

    <div class="results-info">
      Showing <strong>{{ filteredRecipes.length }}</strong> recipes
    </div>

    <div class="table-container">
      <div class="table-header">
        <div class="col-img">Image</div>
        <div class="col-name">Name</div>
        <div class="col-category">Category</div>
        <div class="col-calories">Calories</div>
        <div class="col-protein">Protein</div>
        <div class="col-actions">Actions</div>
      </div>

      <div class="table-body">
        <div v-for="recipe in filteredRecipes" :key="recipe.id" class="table-row">
          <div class="col-img">
            <img :src="recipe.image" :alt="recipe.title" class="recipe-thumbnail" />
          </div>
          <div class="col-name">
            <h4 class="recipe-title">{{ recipe.title }}</h4>
            <p class="recipe-desc">{{ recipe.description }}</p>
          </div>
          <div class="col-category">
            <span class="badge">{{ getCategory(recipe.id) }}</span>
          </div>
          <div class="col-calories stat-group">
            <img :src="recipe.calIcon" alt="Calories" class="stat-icon" /> 
            <span>{{ recipe.calories }}</span>
          </div>
          <div class="col-protein stat-group">
            <img :src="recipe.proIcon" alt="Protein" class="stat-icon" /> 
            <span>{{ recipe.protein }}g</span>
          </div>
          <div class="col-actions">
            <button class="btn-action edit" @click="editRecipe(recipe.id)" title="Edit">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-action delete" @click="deleteRecipe(recipe.id)" title="Delete">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { recipes } from '../data/recipes.js' 
import NavbarAdmin from '../components/NavbarAdmin.vue'


const searchQuery = ref('')

// Computed property untuk fitur pencarian
const filteredRecipes = computed(() => {
  if (!searchQuery.value) return recipes
  const lowerCaseQuery = searchQuery.value.toLowerCase()
  return recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(lowerCaseQuery) || 
    recipe.description.toLowerCase().includes(lowerCaseQuery)
  )
})

// Mapper fungsi untuk mendapatkan kategori waktu makan berdasarkan ID
const getCategory = (id) => {
  if ([1, 5].includes(id)) return 'Breakfast'
  if ([2, 3, 6].includes(id)) return 'Lunch'
  return 'Dinner'
}

// Simulasi fungsi aksi
const editRecipe = (id) => {
  console.log('Edit recipe clicked for ID:', id)
}

const deleteRecipe = (id) => {
  if(confirm('Are you sure you want to delete this recipe?')) {
    console.log('Delete recipe confirmed for ID:', id)
  }
}
</script>

<style scoped>
.admin-container {
  padding: 2rem 4rem;
  background-color: #fafafa;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #333;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-titles h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #1a1a1a;
}

.header-titles p {
  color: #888;
  margin: 0;
  font-size: 0.95rem;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add:hover {
  background-color: #27ae60;
}

.controls-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #eaeaea;
}

.search-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.search-wrapper svg {
  position: absolute;
  left: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.search-input:focus {
  border-color: #2ecc71;
  background-color: #fff;
}

.filter-placeholder {
  width: 200px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.results-info {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.results-info strong {
  color: #333;
}

/* Data Table Styling */
.table-container {
  background: white;
  border-radius: 12px;
  border: 1px solid #eaeaea;
  overflow: hidden;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 80px 3.5fr 1fr 1fr 1fr 100px;
  align-items: center;
  padding: 1rem 1.5rem;
}

.table-header {
  background-color: #f9f9f9;
  font-weight: 600;
  font-size: 0.85rem;
  color: #555;
  border-bottom: 2px solid #eaeaea;
}

.table-row {
  border-bottom: 1px solid #eaeaea;
  transition: background-color 0.1s;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: #fcfcfc;
}

/* Column specifics */
.recipe-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #f0f0f0;
}

.recipe-title {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
}

.recipe-desc {
  margin: 0;
  font-size: 0.8rem;
  color: #888;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 1rem;
}

.badge {
  background-color: #f0f2f5;
  color: #444;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  display: inline-block;
}

.stat-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #444;
}

.stat-icon {
  width: 16px;
  height: 16px;
}

.col-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-action {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action.edit {
  color: #2ecc71;
}

.btn-action.delete {
  color: #e74c3c;
}

.btn-action:hover {
  background-color: #f0f2f5;
}
</style>