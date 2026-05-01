<template>
  <div class="page-container">
    <NavbarAdmin />

    <div class="back-button-wrapper">
      <button @click="$router.back()" class="back-btn">
        <img :src="backButton" alt="Back" class="back-icon" /> Back to Recipes
      </button>
    </div>

    <div class="content-wrapper">
      <h1 class="form-title">Edit Recipe</h1>
      <p class="form-subtitle">Update recipe information</p>
      
      <div v-if="fetching" class="loading-state">
        <p>Loading recipe data...</p>
      </div>

      <div v-else class="form-card">
        <form @submit.prevent="handleSubmit" class="recipe-form">
          
          <section class="form-section">
            <h2 class="section-heading">Basic Information</h2>
            
            <div class="input-group">
              <label>Recipe Name *</label>
              <input v-model="form.nama_resep" type="text" placeholder="e.g., Avocado Toast with Eggs" required>
            </div>
            
            <div class="input-group">
              <label>Description *</label>
              <textarea v-model="form.deskripsi" rows="3" placeholder="Brief description of the recipe" required></textarea>
            </div>

            <!-- Tambahan Form Kategori Diet -->
            <div class="input-group">
              <label>Diet Categories * <span class="help-text-inline">(Select at least one)</span></label>
              <div class="checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" value="Balanced" v-model="form.kategori_diet"> Balanced
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Keto" v-model="form.kategori_diet"> Keto
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Paleo" v-model="form.kategori_diet"> Paleo
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" value="Vegetarian" v-model="form.kategori_diet"> Vegetarian
                </label>
              </div>
            </div>

            <div class="input-group">
              <label>Image URL</label>
              <input v-model="form.img_url" type="text" placeholder="https://example.com/image.jpg">
            </div>

            <div class="row-inputs">
              <div class="input-group">
                <label>Calories *</label>
                <input v-model.number="form.kalori" type="number" placeholder="0" required>
              </div>
              <div class="input-group">
                <label>Protein (g) *</label>
                <input v-model.number="form.protein" type="number" step="0.1" placeholder="0" required>
              </div>
            </div>

            <div class="input-group">
              <label>Prep Time (minutes) *</label>
              <input v-model.number="form.prep_time" type="number" placeholder="e.g., 15" required>
            </div>
          </section>

          <section class="form-section">
            <div class="flex-header">
              <h2 class="section-heading">Ingredients</h2>
              <button type="button" @click="addIngredient" class="add-btn">+ Add Ingredient</button>
            </div>
            <div v-for="(ing, index) in form.bahan" :key="'ing-'+index" class="dynamic-input">
              <input v-model="form.bahan[index]" type="text" :placeholder="`Ingredient ${index + 1}`" required>
              <button @click="removeIngredient(index)" type="button" class="delete-btn" title="Remove">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </section>

          <section class="form-section">
            <div class="flex-header">
              <h2 class="section-heading">Cooking Steps</h2>
              <button type="button" @click="addStep" class="add-btn">+ Add Step</button>
            </div>
            <div v-for="(step, index) in form.langkah" :key="'step-'+index" class="dynamic-input">
              <span class="step-number">{{ index + 1 }}</span>
              <textarea v-model="form.langkah[index]" :placeholder="`Step ${index + 1}`" required></textarea>
              <button @click="removeStep(index)" type="button" class="delete-btn" title="Remove">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </section>

          <div class="action-buttons">
            <button type="button" class="cancel-btn" @click="$router.push('/RecipeManagement')">Cancel</button>
            <button type="submit" class="submit-btn" :disabled="loading">
              {{ loading ? 'Updating...' : 'Update Recipe' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../lib/supabaseClient'
import NavbarAdmin from '../components/NavbarAdmin.vue'
import backButton from '../assets/icons/backButton.svg'

const router = useRouter()
const route = useRoute()

const recipeId = route.params.id

const loading = ref(false)
const fetching = ref(true)

const form = reactive({
  nama_resep: '',
  deskripsi: '',
  img_url: '',
  kalori: null,
  protein: null,
  prep_time: null,
  kategori_diet: [], // Array untuk checkbox
  bahan: [''],
  langkah: ['']
})

const fetchRecipeData = async () => {
  try {
    fetching.value = true
    const { data, error } = await supabase
      .from('resep')
      .select('*')
      .eq('id_resep', recipeId)
      .single()

    if (error) throw error

    if (data) {
      form.nama_resep = data.nama_resep
      form.deskripsi = data.deskripsi
      form.img_url = data.img_url || ''
      form.kalori = data.kalori
      form.protein = data.protein
      form.prep_time = data.prep_time
      
      // Load kategori_diet dari database ke state form
      form.kategori_diet = Array.isArray(data.kategori_diet) ? data.kategori_diet : []
      
      form.bahan = Array.isArray(data.bahan) && data.bahan.length > 0 ? data.bahan : ['']
      form.langkah = Array.isArray(data.langkah) && data.langkah.length > 0 ? data.langkah : ['']
    }
  } catch (error) {
    console.error('Error fetching recipe:', error.message)
    alert('Gagal mengambil data resep.')
  } finally {
    fetching.value = false
  }
}

onMounted(() => {
  if (recipeId) {
    fetchRecipeData()
  } else {
    alert("ID resep tidak ditemukan!")
    router.push('/RecipeManagement')
  }
})

const addIngredient = () => form.bahan.push('')
const removeIngredient = (idx) => {
  if (form.bahan.length > 1) form.bahan.splice(idx, 1)
}

const addStep = () => form.langkah.push('')
const removeStep = (idx) => {
  if (form.langkah.length > 1) form.langkah.splice(idx, 1)
}

const handleSubmit = async () => {
  // Validasi kategori diet
  if (form.kategori_diet.length === 0) {
    alert("Please select at least one diet category!")
    return
  }

  try {
    loading.value = true

    const cleanBahan = form.bahan.filter(item => item.trim() !== '')
    const cleanLangkah = form.langkah.filter(item => item.trim() !== '')

    const payload = {
      nama_resep: form.nama_resep,
      deskripsi: form.deskripsi,
      img_url: form.img_url,
      kalori: form.kalori,
      protein: form.protein,
      prep_time: form.prep_time,
      kategori_diet: form.kategori_diet, // Sertakan array kategori saat update
      bahan: cleanBahan,
      langkah: cleanLangkah,
      updated_at: new Date().toISOString() 
    }

    const { error } = await supabase
      .from('resep')
      .update(payload)
      .eq('id_resep', recipeId)

    if (error) throw error

    alert('Recipe updated successfully!')
    router.push('/RecipeManagement') 
  } catch (error) {
    console.error('Error updating recipe:', error.message)
    alert('Gagal memperbarui resep.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-container { min-height: 100vh; background-color: #F9FAFB; padding-bottom: 3rem; }
.content-wrapper { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }

.back-btn { 
  display: flex; 
  align-items: center; 
  justify-content: flex-start;
  gap: 0.5rem; 
  color: #111827; 
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: 0.2s; 
  width: 100%;
  max-width: 800px;
  padding: 1.25rem 1rem;
  margin: 0;
}

.back-button-wrapper { 
  background-color: #FFFFFF;
  border-bottom: 1px solid #E5E7EB; 
  position: sticky;
  top: 0;
  z-index: 1000; 
  width: 100%;
  display: flex;
  justify-content: center;
}

.back-btn:hover { color: #22C55E; }
.back-icon { width: 1.25rem; height: 1.25rem; }

.form-title { font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
.form-subtitle { color: #6B7280; margin-bottom: 2rem; font-size: 1rem; }

.loading-state { text-align: center; padding: 3rem; color: #6B7280; font-size: 1.125rem; }

.form-card { 
  background: white; 
  padding: 2.5rem; 
  border-radius: 1rem; 
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); 
  border: 1px solid #E5E7EB;
}

.form-section { margin-bottom: 2.5rem; }
.section-heading { font-size: 1.125rem; font-weight: 600; color: #111827; margin-bottom: 1.25rem; }

.input-group { margin-bottom: 1.25rem; }
.input-group label { display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
/* Pengecualian checkbox agar ukurannya tidak memanjang 100% */
.input-group input:not([type="checkbox"]), .input-group textarea { 
  width: 100%; 
  padding: 0.75rem 1rem; 
  border: 1px solid #E5E7EB; 
  border-radius: 0.5rem; 
  background-color: #F9FAFB;
  transition: 0.3s; 
  font-size: 0.875rem;
}
.input-group input:focus, .input-group textarea:focus { border-color: #22C55E; background-color: white; outline: none; }

/* Styling Checkbox Group (Sama dengan AddRecipe) */
.help-text-inline { font-weight: normal; color: #6B7280; font-size: 0.75rem; margin-left: 4px; }
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 0.5rem 0;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #111827;
  cursor: pointer;
  font-weight: 500;
}
.checkbox-label input[type="checkbox"] {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: #22C55E;
  cursor: pointer;
}

.row-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.flex-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }

.add-btn { 
  background: #22C55E; 
  color: white; 
  padding: 0.5rem 1rem; 
  border-radius: 0.5rem; 
  font-weight: 500; 
  font-size: 0.875rem; 
  border: none;
  cursor: pointer;
  transition: 0.2s; 
}
.add-btn:hover { background: #16A34A; }

.dynamic-input { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; align-items: flex-start; }
.dynamic-input input, .dynamic-input textarea { 
  flex: 1; 
  padding: 0.75rem 1rem; 
  border: 1px solid #E5E7EB; 
  border-radius: 0.5rem; 
  background-color: #F9FAFB;
}
.step-number { 
  background: #22C55E; 
  color: white; 
  min-width: 2rem; 
  height: 2rem; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 50%; 
  font-weight: 600; 
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.delete-btn { 
  background: none; 
  border: none; 
  cursor: pointer; 
  padding: 0.5rem; 
  transition: 0.2s; 
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-btn svg { transition: stroke 0.2s; }
.delete-btn:hover svg { stroke: #B91C1C; }

.action-buttons { display: flex; gap: 1rem; margin-top: 3rem; }
.cancel-btn { 
  flex: 1; 
  background: #F9FAFB; 
  color: #111827; 
  border: none; 
  padding: 0.875rem; 
  border-radius: 0.5rem; 
  font-weight: 600; 
  font-size: 0.875rem;
  cursor: pointer;
  transition: 0.2s; 
}
.cancel-btn:hover { background: #E5E7EB; }

.submit-btn { 
  flex: 1; 
  background: #22C55E; 
  color: white; 
  border: none; 
  padding: 0.875rem; 
  border-radius: 0.5rem; 
  font-weight: 600; 
  font-size: 0.875rem;
  cursor: pointer;
  transition: 0.2s; 
}
.submit-btn:hover { background: #16A34A; }
.submit-btn:disabled { background: #9CA3AF; cursor: not-allowed; }
</style>