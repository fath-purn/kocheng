<template>
  <main class="mx-auto p-2 md:p-4 bg-white dark:bg-gray-800 h-1000">
    <h1>Popular</h1>
    <LoadingSpinner v-if="isLoading && dataMoviePopular.length === 0" />

    <div class="flex flex-row items-center w-full overflow-x-auto">
      <div v-for="item in dataMoviePopular" :key="item.id" class="flex-shrink-0">
        <img class="" :src="`${apiKeyImage}${item.backdrop_path}`" :alt="item.original_title" />
        <div class="ml-4">
          <h2 class="text-lg font-semibold">{{ item.original_title }}</h2>
        </div>
      </div>
    </div>

    <div v-if="error" class="text-red-500">
      <p>{{ error }}</p>
    </div>

    <div class="mt-4 p-2 fixed top-0 right-0 bg-gray-100 rounded text-xs text-gray-600" v-if="showDebug">
      <p>Images Count: {{ dataMoviePopular.length }}</p>
      <p>Loading Images: {{ loadingImages.length }}</p>
      <p>Page: {{ page }}</p>
      <p>Loading More: {{ loadingMore }}</p>
      <p>Has More: {{ hasMore }}</p>
      <p>Flipped: {{ flippedItems.length }}</p>
    </div>
  </main>
</template>

<script lang="ts">
import LoadingSpinner from './LoadingSpinner.vue'

interface DataMoviePopular {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export default {
  components: {
    LoadingSpinner,
  },
  setup() {
    const apiUrl = import.meta.env.VITE_API_URL_TMDB
    const apiKey = import.meta.env.VITE_API_KEY_TMDB
    const apiKeyImage = import.meta.env.VITE_API_URL_TMDB_IMAGE
    return {
      apiUrl,
      apiKey,
      apiKeyImage
    }
  },
  data() {
    return {
      dataMoviePopular: [] as DataMoviePopular[],
      showDebug: true,
      isLoading: false,
      loadingMore: false,
      error: null as string | null,
      loadingImages: [] as string[],
      currentRequest: null as AbortController | null,
      page: 1,
      hasMore: true,
      lastBreedId: '',
      flippedItems: [] as string[],
    }
  },
  mounted() {
    this.fetchData();
    this.apiKeyImage = import.meta.env.VITE_API_URL_TMDB_IMAGE;
  },
  methods: {
    fetchData() {
      if ((this.isLoading || this.loadingMore) || !this.hasMore) return;

      if (this.dataMoviePopular.length === 0) {
        this.isLoading = true;
      } else {
        this.loadingMore = true;
      }

      this.error = null;

      if (this.currentRequest) {
        this.currentRequest.abort();
      }

      const controller = new AbortController();
      this.currentRequest = controller;

      fetch(
        `${this.apiUrl}/movie/popular`,
        {
          signal: controller.signal,
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }
          return response.json();
        })
        .then((newData) => {
          console.log("newData", `${this.apiKeyImage}${newData.results.backdrop_path}`)
          if (this.page === 1 && newData.length < 15) {
            this.hasMore = false;
          }

          if (newData.length === 0) {
            this.hasMore = false;
          } else {
            const existingIds = new Set(this.dataMoviePopular.map((item) => item.id));
            const uniqueData = newData.results.filter((item: DataMoviePopular) => !existingIds.has(item.id));

            if (uniqueData.length === 0) {
              this.hasMore = false; // Tidak ada data baru yang unik, matikan infinite scroll
            } else {
              this.dataMoviePopular.push(...uniqueData);
              const newIds = uniqueData.map((item: DataMoviePopular) => item.id);
              this.loadingImages.push(...newIds);
              this.page++;
            }
          }
        })
        .catch((error) => {
          if (error.name === 'AbortError') {
            console.log('Fetch aborted');
            return;
          }
          console.log(`${this.apiUrl}/person/popular`);
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
  }
}
</script>
