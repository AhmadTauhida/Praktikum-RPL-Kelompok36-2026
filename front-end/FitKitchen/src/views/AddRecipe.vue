<template>
  <div class="page-container">
    <NavbarAdmin />

      <div class="back-button-wrapper">
      <button @click="$router.back()" class="back-btn">
        <img :src="backButton" alt="Back" class="back-icon" /> Back to Recipes
      </button>
      </div>

    <div class="content-wrapper">
      <h1 class="form-title">Add New Recipe</h1>
      <p class="form-subtitle">Create a new healthy recipe</p>
      
      <div class="form-card">
        <form @submit.prevent="handleSubmit" class="recipe-form">
          <section class="form-section">
            <h2 class="section-heading">Basic Information</h2>
            
            <div class="input-group">
              <label>Recipe Name *</label>
              <input v-model="form.title" type="text" placeholder="e.g., Avocado Toast with Eggs">
            </div>
            
            <div class="input-group">
              <label>Description *</label>
              <textarea v-model="form.description" rows="3" placeholder="Brief description of the recipe"></textarea>
            </div>

            <div class="input-group">
              <label>Image URL</label>
              <input v-model="form.image" type="text" placeholder="https://example.com/image.jpg">
            </div>

            <div class="row-inputs">
              <div class="input-group">
                <label>Calories *</label>
                <input v-model.number="form.calories" type="number" placeholder="0">
              </div>
              <div class="input-group">
                <label>Protein (g) *</label>
                <input v-model.number="form.protein" type="number" placeholder="0">
              </div>
            </div>

            <div class="input-group">
              <label>Prep Time (minutes) *</label>
              <input v-model.number="form.prepTime" type="number" placeholder="e.g., 15">
            </div>
            </section>

          <section class="form-section">
            <div class="flex-header">
              <h2 class="section-heading">Ingredients</h2>
              <button type="button" @click="addIngredient" class="add-btn">+ Add Ingredient</button>
            </div>
            <div v-for="(ing, index) in form.ingredients" :key="'ing-'+index" class="dynamic-input">
              <input v-model="form.ingredients[index]" type="text" placeholder="Ingredient 1">
              <button @click="removeIngredient(index)" type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
          </section>

          <section class="form-section">
            <div class="flex-header">
              <h2 class="section-heading">Cooking Steps</h2>
              <button type="button" @click="addStep" class="add-btn">+ Add Step</button>
            </div>
            <div v-for="(step, index) in form.steps" :key="'step-'+index" class="dynamic-input">
              <span class="step-number">{{ index + 1 }}</span>
              <textarea v-model="form.steps[index]" placeholder="Step 1"></textarea>
              <button @click="removeStep(index)" type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
            </div>
          </section>

          <div class="action-buttons">
            <button type="button" class="cancel-btn" @click="$router.push('/recipes')">Cancel</button>
            <button type="submit" class="submit-btn">Create Recipe</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import NavbarAdmin from '../components/NavbarAdmin.vue'
import { useRouter } from 'vue-router'
import backButton from '../assets/icons/backButton.svg'

const router = useRouter()

// Tambahkan prepTime ke dalam state reactive
const form = reactive({
  title: '', description: '', image: '', calories: '', protein: '', prepTime: '',
  ingredients: [''], steps: ['']
})

const addIngredient = () => form.ingredients.push('')
const removeIngredient = (idx) => form.ingredients.splice(idx, 1)
const addStep = () => form.steps.push('')
const removeStep = (idx) => form.steps.splice(idx, 1)

const handleSubmit = () => console.log("Payload:", form)
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
  
  /* Constraint agar sejajar dengan form */
  width: 100%;
  max-width: 800px; /* Sama dengan max-width .content-wrapper */
  padding: 1.25rem 1rem; /* Padding atas/bawah 1.25rem, kiri/kanan 1rem agar sejajar dengan judul */
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
  justify-content: center; /* Memastikan isi di dalamnya berada di tengah */

}

.back-btn:hover { color: #22C55E; }
.back-icon { width: 1.25rem; height: 1.25rem; }


.form-title { font-size: 1.875rem; font-weight: 700; color: #111827; margin-bottom: 0.25rem; }
.form-subtitle { color: #6B7280; margin-bottom: 2rem; font-size: 1rem; }


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
.input-group input, .input-group textarea { 
  width: 100%; 
  padding: 0.75rem 1rem; 
  border: 1px solid #E5E7EB; 
  border-radius: 0.5rem; 
  background-color: #F9FAFB;
  transition: 0.3s; 
  font-size: 0.875rem;
}
.input-group input:focus, .input-group textarea:focus { border-color: #22C55E; background-color: white; outline: none; }

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

.delete-btn { color: #9CA3AF; background: none; border: none; cursor: pointer; padding: 0.5rem; transition: 0.2s; margin-top: 0.25rem; }
.delete-btn:hover { color: #EF4444; }

/* Action Buttons (Cancel & Create) */
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
.cancel-btn:hover { background: #F3F4F6; }

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
</style>