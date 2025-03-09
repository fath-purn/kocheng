<template>
  <header class="fixed bottom-4 z-50 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit">
    <div class="mx-auto px-10 p-3 rounded-full bg-gray-900 text-gray-200">
      <ul class="flex flex-row items-center m-auto gap-3 text-center">
        <li class="hover:text-gray-200 py-2"
          :class="{ 'hidden md:inline text-gray-200 font-semibold': isActiveHome, 'text-gray-500': !isActiveHome }">
          <RouterLink to="/" class="pl-3">Home</RouterLink>
        </li>
        <li class="hover:text-gray-200 py-2"
          :class="{ 'hidden md:inline text-gray-200 font-semibold': isActiveCat, 'text-gray-500': !isActiveCat }">
          <RouterLink to="/cat">Cat</RouterLink>
        </li>
        <li class="group/breed flex flex-row items-center gap-2" :class="{ 'hidden': !isActiveCat }">
          <p class="text-gray-500 group-hover/breed:text-gray-200 group-hover/breed:font-bold">Breed</p>
          <select
            class="group/edit w-0 group-hover/breed:w-50 duration-300 transition-all ease-in-out border border-gray-900 group-hover/breed:border-gray-800 rounded-lg p-2 bg-gray-900 text-gray-200 focus:outline-2 focus:outline-offset-2 focus:outline-gray-900 active:bg-gray-800"
            @change="handleChange($event)">
            <option value="" class="rounded-lg py-2 pl-4 text-gray-500 hover:bg-gray-100 hover:text-black shadow-md">All
              Breeds</option>
            <option v-for="option in options" :key="option.value" :value="option.value"
              class="rounded-lg py-2 pl-4 text-gray-500 hover:bg-gray-100 hover:text-black shadow-md">{{ option.text }}
            </option>
          </select>
        </li>
        <!-- <li class="group/item flex flex-row items-center gap-2">
          <p class="text-gray-500 group-hover/item:text-gray-200 group-hover/item:font-bold">Search</p>
          <input type="text"
            class="group/edit w-0 group-hover/item:w-50 duration-300 transition-all ease-in-out border border-gray-900 group-hover/item:border-gray-800 rounded-lg p-2"
            placeholder="Search" @change="handleChangeSearch($event)" />
        </li> -->
      </ul>
    </div>
  </header>
</template>

<script lang="ts">
interface Breed {
  id: string;
  name: string;
}

export default {
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
      options: [] as Array<{ value: string, text: string }>,
      dataFetched: false
    }
  },
  watch: {
    // Watch for route changes to fetch data only when on the cat route
    '$route.path'(newPath) {
      if (newPath === '/cat' && !this.dataFetched) {
        this.fetchBreedData();
      }
    }
  },
  mounted() {
    // Only fetch data on initial load if we're on the cat page
    if (this.isActiveCat && !this.dataFetched) {
      this.fetchBreedData();
    }
  },
  methods: {
    fetchBreedData() {
      fetch(`${this.apiUrl}/breeds?api_key=${this.apiKey}`)
        .then(response => response.json())
        .then(data => {
          this.options = data.map((item: Breed) => ({
            value: item.id,
            text: item.name
          }));
          this.dataFetched = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleChange(event: Event) {
      const selectedValue = (event.target as HTMLSelectElement).value || '';
      this.$router.push({ query: { breeds_ids: selectedValue } });
    },
    handleChangeSearch(event: Event) {
      const searchValue = (event.target as HTMLInputElement).value || '';
      this.$router.push({ query: { search: searchValue } });
    }
  },
  computed: {
    isActiveHome() {
      return this.$route.path === '/'
    },
    isActiveAbout() {
      return this.$route.path === '/about'
    },
    isActiveCat() {
      return this.$route.path === '/cat'
    },
  }
}
</script>
