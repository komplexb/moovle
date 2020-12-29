<template>
  <div class="container text-center">
    <div>
      <input
        v-model="searchQuery"
        type="text"
        class="search-box"
        placeholder="find a hero/villain"
        @keyup="handleEnter"
      />
    </div>
    <section v-if="searchQuery.length === 0" class="feel-lucky">
      <h2>Browse characters starting with this letter...</h2>
      <ul class="search-list px-40">
        <li
          v-for="(letter, idx) in iFeelLucky()"
          :key="letter.id"
          class="search-list__item"
        >
          <button
            :class="['search-list__button', getButtonClass(idx)]"
            @click="searchQuery = letter"
          >
            {{ letter }}
          </button>
        </li>
      </ul>
    </section>
    <SearchList v-else :find="searchQuery" :query-type="findName" />
    <footer v-if="false">
      <div class="favourites">
        <h2>Your favourites</h2>

        <ul class="bookmarks-list">
          <li
            v-for="hero in ['Thor', 'Gommorah', 'Iron Man', 'Thanos', 'Ultron']"
            :key="hero.id"
            class="bookmarks__item"
          >
            <button :class="['bookmarks__button']">
              {{ hero }}
            </button>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Index',
  data() {
    return {
      searchQuery: '',
      findName: false,
    }
  },
  computed: {},
  methods: {
    iFeelLucky(): [] {
      // Load Chance
      const Chance = require('chance')
      const chance = new Chance()

      return chance.unique(chance.letter, 4)
    },
    getButtonClass(idx: number): Object {
      return {
        'btn--primary': idx === 0,
        'btn--primary-alt': idx === 1,
        'btn--secondary': idx === 2,
        'btn--secondary-alt': idx === 3,
      }
    },
    handleEnter(e: KeyboardEvent): void {
      this.findName = e.key === 'Enter'
    },
  },
})
</script>

<style lang="scss">
.search-box {
  @apply h-24 border-primary rounded-lg focus:border-red-300 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50 mt-4 md:mt-8;
  @apply text-primary text-3xl md:text-7xl placeholder-primary w-full;

  border-width: 2px;
  text-align: center;

  &::placeholder {
    opacity: 0.25;
  }
}

.search-list {
  @apply grid grid-cols-4 gap-4;
}
.search-list__item {
}

.search-list__button {
  @apply rounded-md h-24 w-24 text-white;

  text-transform: uppercase;
}

.bookmarks-list {
  @apply grid grid-flow-col-dense;
  // grid-cols-4 gap-4;
}

.bookmarks__button {
  @apply rounded-md bg-primary-alt text-white p-4;
}
</style>
