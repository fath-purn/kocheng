<template>
  <div class="min-h-screen bg-gray-400 dark:bg-gray-900">
    <button @click="toggleTheme" class="p-2 rounded-lg bg-gray-500 dark:bg-gray-700">
      <font-awesome-icon :icon="isDark ? 'sun' : 'moon'" />
      {{ isDark ? 'Switch to Light' : 'Switch to Dark' }}
    </button>

    <!-- Rest of your content -->
    <div class="p-4 bg-white dark:bg-gray-800 text-black dark:text-white">
      Content with theme support
    </div>
  </div>
</template>
<script lang="ts">


export default {
  data() {
    return {
      isDark: false
    }
  },
  mounted() {
    // Check saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      // Follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  },
  methods: {
    setTheme(theme: string) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      this.isDark = theme === 'dark';
    },
    toggleTheme() {
      this.setTheme(this.isDark ? 'light' : 'dark');
    }
  }
}
</script>
