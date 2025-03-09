<template>
  <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md my-4">
    <p class="font-bold">Error</p>
    <p>{{ error }}</p>
    <button @click="onRetry" class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
      Try Again
    </button>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ErrorState',
  props: {
    error: {
      type: String,
      required: true,
    },
  },
  methods: {
    onRetry() {
      this.$emit('retry');
    },
  },
};
</script>
