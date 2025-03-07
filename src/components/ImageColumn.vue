<template>
  <div class="flex-1 flex flex-col gap-4">
    <ImageCard v-for="item in items" :key="item.id" :item="item" :loading="loadingImages.includes(item.id)"
      :flipped="flippedItems.includes(item.id)" @image-loaded="handleImageLoaded" @image-error="handleImageError"
      @toggle-flip="toggleFlip" />
  </div>
</template>

<script lang="ts">
import ImageCard from './ImageCard.vue';

export default {
  name: 'ImageColumn',
  components: {
    ImageCard,
  },
  props: {
    items: {
      type: Array as () => Array<{ id: string }>,
      required: true,
    },
    loadingImages: {
      type: Array,
      required: true,
    },
    flippedItems: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleImageLoaded(imageId: string) {
      this.$emit('image-loaded', imageId);
    },
    handleImageError(imageId: string) {
      this.$emit('image-error', imageId);
    },
    toggleFlip(imageId: string) {
      this.$emit('toggle-flip', imageId);
    },
  },
};
</script>
