<!-- <script setup lang="ts">
import { ref, onMounted } from 'vue';

const displayText = ref('');
const fullText = 'On Progres!!';
const typingSpeed = 100; // miliseconds per character

onMounted(() => {
  let currentIndex = 0;

  const typeNextCharacter = () => {
    if (currentIndex < fullText.length) {
      displayText.value += fullText.charAt(currentIndex);
      currentIndex++;
      setTimeout(typeNextCharacter, typingSpeed);
    }
  };

  // Start typing animation after a short delay
  setTimeout(typeNextCharacter, 500);
});
</script>

<template>
  <main class="flex items-center justify-center bg-white dark:bg-gray-800">
    <div class="container mx-auto h-screen flex flex-col items-center justify-center">
      <h1 class="text-4xl font-bold text-center text-gray-800 dark:text-white relative">
        <span>{{ displayText }}</span>
        <span class="cursor" aria-hidden="true"></span>
      </h1>
    </div>
  </main>
</template>

<style scoped>
.cursor {
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background-color: currentColor;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  from,
  to {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style> -->

<script setup lang="ts">
import MovieLanding from '@/components/MovieLanding.vue';

</script>

<template>
  <main class="flex items-center justify-center bg-white dark:bg-gray-800">
    <div class="container mx-auto">
      <MovieLanding />
    </div>
  </main>
</template>
