<template>
  <main class="mx-auto p-2 md:p-4">
    <LoadingSpinner v-if="isLoading && data.length === 0" />
    <ErrorState v-else-if="error" :error="error" @retry="fetchData" />
    <EmptyState v-else-if="data.length === 0" />

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <ImageColumn v-for="(column, index) in columns" :key="index" :items="column" :loading-images="loadingImages"
        :flipped-items="flippedItems" @image-loaded="handleImageLoaded" @image-error="handleImageError"
        @toggle-flip="toggleFlip" />
    </div>

    <div v-if="loadingMore && hasMore" class="flex justify-center my-8">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div class="mt-4 p-2 fixed top-0 right-0 bg-gray-100 rounded text-xs text-gray-600" v-if="showDebug">
      <p>Current Breed ID: {{ currentBreedId }}</p>
      <p>Images Count: {{ data.length }}</p>
      <p>Loading Images: {{ loadingImages.length }}</p>
      <p>Page: {{ page }}</p>
      <p>Loading More: {{ loadingMore }}</p>
      <p>Has More: {{ hasMore }}</p>
      <p>Flipped: {{ flippedItems.length }}</p>
      <p>Columns: {{ columnCount }}</p>
    </div>
  </main>
</template>

<script lang="ts">
import LoadingSpinner from './LoadingSpinner.vue';
import ErrorState from './ErrorState.vue';
import EmptyState from './EmptyState.vue';
import ImageColumn from './ImageColumn.vue';

interface Breed {
  id: string;
  name: string;
  description: string;
  origin: string;
  temperament: string;
}

interface Data {
  breeds: Breed[];
  id: string;
  url: string;
}

export default {
  components: {
    LoadingSpinner,
    ErrorState,
    EmptyState,
    ImageColumn,
  },
  setup() {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT
    const apiKey = import.meta.env.VITE_API_KEY
    return {
      apiUrl,
      apiKey,
    }
  },
  data() {
    return {
      data: [] as Data[],
      isLoading: false,
      loadingMore: false,
      error: null as string | null,
      loadingImages: [] as string[],
      showDebug: true,
      currentRequest: null as AbortController | null,
      page: 1,
      hasMore: true,
      lastBreedId: '',
      flippedItems: [] as string[],
    }
  },
  // In your main component
  computed: {
    currentBreedId() {
      return this.$route.query.breeds_ids || '';
    },
    columnCount() {
      // Return different column counts based on screen size
      // These are tailwind breakpoints: sm = 640px, md = 768px, lg = 1024px
      if (window.innerWidth < 640) return 1; // Mobile - single column
      if (window.innerWidth < 1024) return 2; // Tablet - two columns
      return 3; // Desktop - three columns
    },
    columns() {
      const result: Data[][] = Array(this.columnCount).fill([]).map(() => []);
      this.data.forEach((item, index) => {
        const columnIndex = index % this.columnCount;
        result[columnIndex].push(item);
      });
      return result;
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    this.handleResize(); // Initialize column count on mount
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    if (this.currentRequest) {
      this.currentRequest.abort();
    }
  },
  watch: {
    '$route.query.breeds_ids': {
      handler(newBreedId) {
        if (newBreedId !== this.lastBreedId) {
          this.data = [];
          this.page = 1;
          this.hasMore = true;
          this.lastBreedId = newBreedId as string;
          this.fetchData();
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleScroll() {
      if (!this.isScrollNearBottom() || this.loadingMore || !this.hasMore) return;
      this.fetchData();
    },
    isScrollNearBottom(threshold = 200) {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      return scrollTop + clientHeight >= scrollHeight - threshold;
    },
    fetchData() {
      if ((this.isLoading || this.loadingMore) || !this.hasMore) return;

      if (this.data.length === 0) {
        this.isLoading = true;
      } else {
        this.loadingMore = true;
      }

      this.error = null;

      const breedId = this.currentBreedId;

      if (this.currentRequest) {
        this.currentRequest.abort();
      }

      const controller = new AbortController();
      this.currentRequest = controller;

      fetch(
        `${this.apiUrl}/images/search?limit=15&breed_ids=${breedId}&page=${this.page}&size=small&api_key=${this.apiKey}`,
        {
          signal: controller.signal,
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then((newData) => {
          if (this.page === 1 && newData.length < 15) {
            // Jika di halaman pertama jumlah data kurang dari 15, matikan infinite scroll
            this.hasMore = false;
          }

          if (newData.length === 0) {
            this.hasMore = false;
          } else {
            const existingIds = new Set(this.data.map((item) => item.id));
            const uniqueData = newData.filter((item: Data) => !existingIds.has(item.id));

            this.data.push(...uniqueData);
            const newIds = uniqueData.map((item: Data) => item.id);
            this.loadingImages.push(...newIds);
            this.page++;
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('Fetch aborted');
            return;
          }
          console.error('Fetch error:', error);
          this.error = `Failed to load images: ${error.message}`;
        })
        .finally(() => {
          if (this.currentRequest === controller) {
            this.isLoading = false;
            this.loadingMore = false;
            this.currentRequest = null;
          }
        });
    },
    // Add this method to handle window resizing
    handleResize() {
      // Force recomputation of columns when window is resized
      this.$forceUpdate();
    },
    handleImageLoaded(imageId: string) {
      this.loadingImages = this.loadingImages.filter(id => id !== imageId);
    },
    handleImageError(imageId: string) {
      this.loadingImages = this.loadingImages.filter(id => id !== imageId);
      console.error(`Failed to load image: ${imageId}`);
    },
    toggleFlip(id: string) {
      if (this.flippedItems.includes(id)) {
        this.flippedItems = this.flippedItems.filter(itemId => itemId !== id);
      } else {
        this.flippedItems.push(id);
      }
    },
  },
};
</script>
