<template>
  <NavbarUser />

  <div class="menu-detail-page" v-if="recipe">
    
    <button @click="goBack" class="btn-back">← Back</button>

    <img :src="recipe.image" :alt="recipe.title" class="hero-image" />
    <span class="diet-badge">{{ recipe.diet }}</span>
    <h1>{{ recipe.title }}</h1>
    <p class="desc">{{ recipe.description }}</p>

    <div class="info-boxes">
      <div class="box">🔥 {{ recipe.calories }} cal</div>
      <div class="box">💪 {{ recipe.protein }}g protein</div>
      <div class="box">⏱️ {{ recipe.prepTime }}</div>
    </div>

    <div class="ingredients-section">
      <h2>Ingredients</h2>
      <ul>
        <li v-for="(item, index) in recipe.ingredients" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="steps-section">
      <h2>Cooking Steps</h2>
      <ol>
        <li v-for="(step, index) in recipe.steps" :key="index">
          {{ step }}
        </li>
      </ol>
    </div>

  </div>
  
  <div v-else>
    <h2>Recipe not found!</h2>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recipes } from '../data/recipes.js'
import NavbarUser from '../components/NavbarUser.vue'

const route = useRoute()
const router = useRouter()

// Mencari resep yang ID-nya sama dengan ID di URL
const recipe = computed(() => {
  // route.params.id bertipe string, jadi kita ubah ke Number agar cocok dengan id di recipes.js
  const currentId = Number(route.params.id)
  return recipes.find(r => r.id === currentId)
})

const goBack = () => {
  router.back() // Kembali ke halaman sebelumnya (Landing)
}
</script>

<style scoped>
/* Tambahkan CSS kamu di sini untuk menyamai desain yang kamu inginkan */
.menu-detail-page { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
.hero-image { width: 100%; border-radius: 16px; object-fit: cover; }
.info-boxes { display: flex; gap: 20px; margin: 20px 0; }
.box { padding: 15px; border: 1px solid #eee; border-radius: 12px; }
</style>