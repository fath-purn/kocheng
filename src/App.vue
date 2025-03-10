<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
</script>

<template class="bg-white dark:bg-gray-800">
  <NavBar />
  <RouterView />
</template>
