<template>
  <main class="container mx-auto p-4">
    <!-- Loading state awal -->
    <div v-if="isLoading && data.length === 0" class="flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-gray-600 text-lg">Loading images...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md my-4">
      <p class="font-bold">Error</p>
      <p>{{ error }}</p>
      <button @click="fetchData()" class="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition">
        Try Again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="data.length === 0" class="text-center py-20">
      <p class="text-gray-600 text-lg">No images found</p>
      <p class="text-gray-500">Try selecting a different breed</p>
    </div>

    <!-- Column-based masonry layout -->
    <div v-else class="flex flex-col md:flex-row gap-4">
      <!-- Kolom 1 -->
      <div class="flex-1 flex flex-col gap-4">
        <div v-for="item in columns[0]" :key="item.id"
          class="overflow-hidden rounded-lg shadow-md transition-transform relative group/image cursor-pointer"
          :class="{ 'rotate-y-180': flippedItems.includes(item.id) }" @click="toggleFlip(item.id)">

          <!--ketika belum di klik akan menampilkan yang dibawah ini  -->
          <div class="inset-0 transition-all duration-500 rotate-y-180"
            :class="{ 'opacity-100': !flippedItems.includes(item.id), 'opacity-50': flippedItems.includes(item.id) }">
            <img :src="item.url" :alt="item.breeds && item.breeds.length > 0 ? item.breeds[0].name : 'Cat image'"
              class="w-full transition-opacity " @load="handleImageLoaded(item.id)" @error="handleImageError(item.id)"
              :class="{ 'opacity-0': loadingImages.includes(item.id), 'rotate-y-180': !flippedItems.includes(item.id) }">
            <div
              class="absolute bottom-0 z-10 px-5 pb-4 pt-10 w-full text-gray-200 opacity-0 transition-opacity duration-300 ease-in-out group-hover/image:opacity-100 group-hover/image:bg-linear-to-t/oklch from-[#050000bb] from-30% via-[#00000056] via-70% to-[#eeeded09] to-90%"
              :class="{ 'hidden': flippedItems.includes(item.id) }">
              <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1"
                :class="{ 'rotate-y-180': !flippedItems.includes(item.id) }">
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

          <!-- Ketika di klik akan muncul dan bisa di-scroll -->
          <div class="absolute bottom-0 z-10 px-5 py-4 w-full text-gray-200 h-full backdrop-brightness-30 snap-y
            transition-all duration-500 ease-in-out"
            :class="{ 'opacity-100': flippedItems.includes(item.id), 'opacity-0': !flippedItems.includes(item.id), 'rotate-y-180': flippedItems.includes(item.id) }">

            <!-- Tambahkan `overflow-auto` & `max-h-full` di div ini -->
            <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 overflow-auto max-h-full p-2">
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


          <div v-if="loadingImages.includes(item.id)" class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

      </div>

      <!-- Kolom 2 (hanya tampil di md screens ke atas) -->
      <div class="flex-1 flex flex-col gap-4">
        <div v-for="item in columns[1]" :key="item.id"
          class="overflow-hidden rounded-lg shadow-md transition-transform relative group/image cursor-pointer"
          :class="{ 'rotate-y-180': flippedItems.includes(item.id) }" @click="toggleFlip(item.id)">

          <!--ketika belum di klik akan menampilkan yang dibawah ini  -->
          <div class="inset-0 transition-all duration-500 rotate-y-180"
            :class="{ 'opacity-100': !flippedItems.includes(item.id), 'opacity-50': flippedItems.includes(item.id) }">
            <img :src="item.url" :alt="item.breeds && item.breeds.length > 0 ? item.breeds[0].name : 'Cat image'"
              class="w-full transition-opacity " @load="handleImageLoaded(item.id)" @error="handleImageError(item.id)"
              :class="{ 'opacity-0': loadingImages.includes(item.id), 'rotate-y-180': !flippedItems.includes(item.id) }">
            <div
              class="absolute bottom-0 z-10 px-5 pb-4 pt-10 w-full text-gray-200 opacity-0 transition-opacity duration-300 ease-in-out group-hover/image:opacity-100 group-hover/image:bg-linear-to-t/oklch from-[#050000bb] from-30% via-[#00000056] via-70% to-[#eeeded09] to-90%"
              :class="{ 'hidden': flippedItems.includes(item.id) }">
              <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1"
                :class="{ 'rotate-y-180': !flippedItems.includes(item.id) }">
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

          <!-- Ketika di klik akan muncul dan bisa di-scroll -->
          <div class="absolute bottom-0 z-10 px-5 py-4 w-full text-gray-200 h-full backdrop-brightness-30 snap-y
            transition-all duration-500 ease-in-out"
            :class="{ 'opacity-100': flippedItems.includes(item.id), 'opacity-0': !flippedItems.includes(item.id), 'rotate-y-180': flippedItems.includes(item.id) }">

            <!-- Tambahkan `overflow-auto` & `max-h-full` di div ini -->
            <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 overflow-auto max-h-full p-2">
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

          <div v-if="loadingImages.includes(item.id)" class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

        </div>
      </div>

      <!-- Kolom 3 (hanya tampil di lg screens ke atas) -->
      <div class="flex-1 flex flex-col gap-4">
        <div v-for="item in columns[2]" :key="item.id"
          class="overflow-hidden rounded-lg shadow-md transition-transform relative group/image cursor-pointer"
          :class="{ 'rotate-y-180': flippedItems.includes(item.id) }" @click="toggleFlip(item.id)">

          <!--ketika belum di klik akan menampilkan yang dibawah ini  -->
          <div class="inset-0 transition-all duration-500 rotate-y-180"
            :class="{ 'opacity-100': !flippedItems.includes(item.id), 'opacity-50': flippedItems.includes(item.id) }">
            <img :src="item.url" :alt="item.breeds && item.breeds.length > 0 ? item.breeds[0].name : 'Cat image'"
              class="w-full transition-opacity " @load="handleImageLoaded(item.id)" @error="handleImageError(item.id)"
              :class="{ 'opacity-0': loadingImages.includes(item.id), 'rotate-y-180': !flippedItems.includes(item.id) }">
            <div
              class="absolute bottom-0 z-10 px-5 pb-4 pt-10 w-full text-gray-200 opacity-0 transition-opacity duration-300 ease-in-out group-hover/image:opacity-100 group-hover/image:bg-linear-to-t/oklch from-[#050000bb] from-30% via-[#00000056] via-70% to-[#eeeded09] to-90%"
              :class="{ 'hidden': flippedItems.includes(item.id) }">
              <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1"
                :class="{ 'rotate-y-180': !flippedItems.includes(item.id) }">
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

          <!-- Ketika di klik akan muncul dan bisa di-scroll -->
          <div class="absolute bottom-0 z-10 px-5 py-4 w-full text-gray-200 h-full backdrop-brightness-30 snap-y
            transition-all duration-500 ease-in-out"
            :class="{ 'opacity-100': flippedItems.includes(item.id), 'opacity-0': !flippedItems.includes(item.id), 'rotate-y-180': flippedItems.includes(item.id) }">

            <!-- Tambahkan `overflow-auto` & `max-h-full` di div ini -->
            <div class="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 overflow-auto max-h-full p-2">
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

          <div v-if="loadingImages.includes(item.id)" class="absolute inset-0 flex items-center justify-center">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>

        </div>
      </div>
    </div>

    <!-- Loading spinner untuk infinite scroll -->
    <div v-if="loadingMore && hasMore" class="flex justify-center my-8">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Debug info -->
    <div class="mt-4 p-2 fixed top-0 right-0 bg-gray-100 rounded text-xs text-gray-600" v-if="showDebug">
      <p>Current Breed ID: {{ currentBreedId }}</p>
      <p>Images Count: {{ data.length }}</p>
      <p>Loading Images: {{ loadingImages.length }}</p>
      <p>Page: {{ page }}</p>
      <p>Loading More: {{ loadingMore }}</p>
      <p>Has More: {{ hasMore }}</p>
      <p>Flipped: {{ flippedItems.length }}</p>
    </div>
  </main>
</template>

<script lang="ts">
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
  name: 'SimpanComponent',
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
      flippedItems: [] as string[], // Menyimpan ID elemen yang dibalik
    }
  },
  computed: {
    currentBreedId() {
      return this.$route.query.breeds_ids || '';
    },
    // Membagi data ke dalam 3 kolom berdasarkan index
    columns() {
      const result: Data[][] = [[], [], []];

      this.data.forEach((item, index) => {
        // Untuk mobile, semua masuk kolom 0
        // Untuk tablet, bagi ke kolom 0 dan 1
        // Untuk desktop, bagi ke kolom 0, 1, dan 2
        const columnIndex = index % 3;
        result[columnIndex].push(item);
      });

      return result;
    }
  },
  watch: {
    '$route.query.breeds_ids': {
      handler(newBreedId) {
        console.log(`Route changed: New breed ID: ${newBreedId}`);

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
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.currentRequest) {
      this.currentRequest.abort();
    }
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
      console.log(`Fetching data for breed ID: ${breedId}, page: ${this.page}`);

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
          console.log(`Received ${newData.length} images for breed ID: ${breedId}, page: ${this.page}`);

          if (newData.length === 0) {
            this.hasMore = false;
          } else {
            this.data.push(...newData);

            const newIds = newData.map((item: Data) => item.id);
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

    handleImageLoaded(imageId: string) {
      // Remove this image from loading state
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
}
</script>
