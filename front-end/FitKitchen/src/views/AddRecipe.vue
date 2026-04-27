<script setup>
import { ref } from 'vue'

// Reactive state
const count = ref(0)

// Function logic
function increment() {
  count.value++
}
</script>

<template>
  <div class="container">
    <h1>Count is: {{ count }}</h1>
    <button @click="increment">Increment</button>
  </div>
</template>

<style scoped>
.container {
  text-align: center;
  margin-top: 2rem;
}
</style>
