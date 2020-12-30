<template>
  <div class="container">
    <section class="text-center">
      <input
        v-model="searchQuery"
        type="text"
        class="search-box"
        placeholder="find a hero/villain"
        @keyup="handleEnter"
      />
    </section>
    <section v-if="searchQuery.length === 0" class="feel-lucky">
      <strong>Browse characters starting with this letter...</strong>
      <ul class="feel-lucky-list">
        <li
          v-for="(letter, idx) in iFeelLucky()"
          :key="letter.id"
          class="feel-lucky-list__item"
        >
          <button
            :class="['feel-lucky-list__button', getButtonClass(idx)]"
            @click="searchQuery = letter"
          >
            <strong>{{ letter }}</strong>
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
section {
  @apply my-2;
}
.search-box {
  @apply h-24 border-primary rounded-lg focus:border-red-300 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50 mt-4 md:mt-8;
  @apply text-primary text-3xl sm:text-4xl md:text-7xl placeholder-primary w-full;

  text-align: center;
  border-width: 3px;

  &::placeholder {
    opacity: 0.25;
  }
}

.feel-lucky {
  @apply text-center;
}

.feel-lucky-list {
  @apply grid grid-flow-col-dense mt-5 lg:mt-10;
}
.feel-lucky-list__item {
}

.feel-lucky-list__button {
  @apply rounded-md h-12 md:h-24 w-12 md:w-24 text-white transform rotate-45;

  text-transform: uppercase;

  strong {
    @apply transform -rotate-45 #{!important};

    display: inline-block;
  }
}

.bookmarks-list {
  @apply grid grid-flow-col-dense;
}

.bookmarks__button {
  @apply rounded-md bg-primary-alt text-white p-4;
}
</style>
