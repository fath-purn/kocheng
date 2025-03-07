<template>
  <div
    class="overflow-hidden rounded-lg shadow-md transition-transform relative group/image cursor-pointer pointer-events-auto md:pointer-events-none"
    :class="{ 'rotate-y-180': flipped }" @click="toggleFlip">

    <!-- Bagian depan (gambar) -->
    <div class="inset-0 transition-all duration-500 rotate-y-180"
      :class="{ 'opacity-100': !flipped, 'opacity-50': flipped }">
      <img :src="item.url" :alt="item.breeds && item.breeds.length > 0 ? item.breeds[0].name : 'Cat image'"
        class="w-full transition-opacity" @load="handleImageLoaded" @error="handleImageError"
        :class="{ 'opacity-0': loading, 'rotate-y-180': !flipped }">
      <div v-if="!flipped" :class="{ 'rotate-y-180': !flipped }"
        class="absolute bottom-0 z-10 px-5 pb-4 pt-10 w-full text-gray-200 opacity-0 transition-opacity duration-300 ease-in-out group-hover/image:opacity-100 group-hover/image:bg-linear-to-t/oklch from-[#050000bb] from-30% via-[#00000056] via-70% to-[#eeeded09] to-90%">
        <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
          <p class="font-semibold text-right">Name</p>
          <p class="text-left">{{ item.breeds[0]?.name || '-' }}</p>

          <p class="font-semibold text-right">Origin</p>
          <p class="text-left">{{ item.breeds[0]?.origin || '-' }}</p>

          <p class="font-semibold text-right">Temperament</p>
          <p class="text-left">{{ item.breeds[0]?.temperament || '-' }}</p>

          <p class="font-semibold text-right">Description</p>
          <p class="text-left whitespace-normal line-clamp-1">{{ item.breeds[0]?.description || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- Bagian belakang (informasi breed) -->
    <div class="absolute inset-0 z-10 px-5 py-4 w-full text-gray-200 h-full backdrop-brightness-30 snap-y
      transition-all duration-500 ease-in-out overflow-y-auto image-card-back"
      :class="{ 'opacity-100': flipped, 'opacity-0': !flipped, 'rotate-y-180': flipped }">
      <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 p-2">
        <p class="font-semibold text-right">Name</p>
        <p class="text-left">{{ item.breeds[0]?.name || '-' }}</p>

        <p class="font-semibold text-right">Origin</p>
        <p class="text-left">{{ item.breeds[0]?.origin || '-' }}</p>

        <p class="font-semibold text-right">Temperament</p>
        <p class="text-left">{{ item.breeds[0]?.temperament || '-' }}</p>

        <p class="font-semibold text-right">Description</p>
        <p class="text-left whitespace-normal">{{ item.breeds[0]?.description || '-' }}</p>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ImageCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    flipped: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleImageLoaded() {
      this.$emit('image-loaded', this.item.id);
    },
    handleImageError() {
      this.$emit('image-error', this.item.id);
    },
    toggleFlip() {
      this.$emit('toggle-flip', this.item.id);
    },
  },
};
</script>

<style scoped>
.image-card-back {
  -webkit-overflow-scrolling: touch;
  /* Memungkinkan scroll smooth pada perangkat mobile */
  overscroll-behavior: contain;
  /* Mencegah scroll dari elemen parent */
}
</style>
