<template>
  <NavbarUser />

  <div v-if="loading" class="loading-state">
    <p>Loading recipe details...</p>
  </div>

  <div class="container" v-else-if="recipe">
    <div class="back-nav">
      <button @click="goBack" class="btn-back">
        <span class="arrow">←</span> Back
      </button>
    </div>

    <div class="recipe-header">
      <div class="image-wrapper">
        <img :src="recipe.image" :alt="recipe.title" class="hero-image" />
      </div>

      <div class="title-section">
        <div class="badges">
          <span class="badge diet">{{ recipe.diet }}</span>
          <span class="badge category">Recipe</span>
        </div>
        <h1>{{ recipe.title }}</h1>
        <p class="description">{{ recipe.description }}</p>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <img :src="caloriesIcon" alt="Calorie Icon" class="icon" />
          <div class="info-text">
            <span class="label">Calories</span>
            <span class="value">{{ recipe.calories }}</span>
          </div>
        </div>
        <div class="info-box">
          <img :src="proteinIcon" alt="Protein Icon" class="icon" />
          <div class="info-text">
            <span class="label">Protein</span>
            <span class="value">{{ recipe.protein }}g</span>
          </div>
        </div>
        <div class="info-box">
          <img :src="timeIcon" alt="Time Icon" class="icon" />
          <div class="info-text">
            <span class="label">Prep Time</span>
            <span class="value">{{ recipe.prepTime }} min</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="section">
        <h2>Ingredients</h2>
        <ul class="ingredient-list">
          <li v-for="(item, index) in recipe.ingredients" :key="index">
            <span class="dot"></span> {{ item }}
          </li>
        </ul>
      </div>
    </div>

    <div class="content-card">
      <div class="section">
        <h2>Cooking Steps</h2>
        <div class="steps-list">
          <div v-for="(step, index) in recipe.steps" :key="index" class="step-item">
            <div class="step-number">{{ index + 1 }}</div>
            <p>{{ step }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>Recipe not found!</h2>
    <button @click="goBack" class="btn-back" style="margin: 20px auto;">Go Back</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../lib/supabaseClient' // Import Supabase Client
import NavbarUser from '../components/NavbarUser.vue'

// Import asset lokal untuk Icon yang tadinya numpang di objek recipe
import caloriesIcon from '../assets/icons/Calori.svg'
import proteinIcon from '../assets/icons/protein.svg'
import timeIcon from '../assets/icons/clock.svg' 

const route = useRoute()
const router = useRouter()

const recipe = ref(null)
const loading = ref(true)

// Mengambil 1 resep berdasarkan ID dari URL parameter
const fetchRecipeDetails = async () => {
  try {
    loading.value = true
    const currentId = route.params.id

    const { data, error } = await supabase
      .from('resep')
      .select('*')
      .eq('id_resep', currentId)
      .single()

    if (error) throw error

    if (data) {
      // Memetakan (Mapping) data database ke format yang digunakan template HTML
      recipe.value = {
        id: data.id_resep,
        title: data.nama_resep,
        description: data.deskripsi,
        image: data.img_url || 'https://via.placeholder.com/900x400?text=No+Image',
        calories: data.kalori,
        protein: data.protein,
        prepTime: data.prep_time,
        ingredients: Array.isArray(data.bahan) ? data.bahan : [],
        steps: Array.isArray(data.langkah) ? data.langkah : [],
        diet: data.diet ? data.diet.toLowerCase() : 'balanced' // Fallback
      }
    }
  } catch (error) {
    console.error('Error fetching recipe details:', error.message)
    recipe.value = null // Biarkan null agar block "Recipe not found!" muncul
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecipeDetails()
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
/* Tambahan class untuk Loading */
.loading-state {
  text-align: center;
  padding: 100px;
  font-size: 1.2rem;
  color: #666;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
  color: #333;
}

/* Navigation */
.back-nav { margin-bottom: 20px; }
.btn-back {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Header & Image */
.image-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 20px;
  margin-bottom: 30px;
  background-color: #E5E7EB;
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.title-section h1 {
  font-size: 32px;
  margin: 10px 0;
  font-weight: 700;
}
.description { color: #888; margin-bottom: 25px; line-height: 1.5; }

/* Badges */
.badges { display: flex; gap: 10px; }
.badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
}
.diet { background-color: #FF9F59; color: white; }
.category { background-color: #F3F4F6; color: #666; }

/* Info Boxes */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}
.info-box {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
}
.icon { width: 32px; height: 32px; }
.info-text { display: flex; flex-direction: column; }
.label { font-size: 12px; color: #999; }
.value { font-size: 18px; font-weight: 700; }

/* Content Cards */
.content-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  margin-bottom: 25px;
  border: 1px solid #f0f0f0;
}
.section h2 { margin-top: 0; margin-bottom: 20px; font-size: 24px; }

/* Ingredients List */
.ingredient-list { list-style: none; padding: 0; }
.ingredient-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #444;
}
.dot {
  width: 6px;
  height: 6px;
  background: #27AE60;
  border-radius: 50%;
}

/* Steps List */
.step-item {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
}
.step-number {
  min-width: 32px;
  height: 32px;
  background: #27AE60;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
.step-item p { margin: 0; line-height: 1.6; color: #444; padding-top: 4px;}

.not-found { text-align: center; padding: 100px; }
</style>