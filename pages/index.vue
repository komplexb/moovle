<template>
  <div class="container">
    <section class="text-center">
      <label class="hidden" for="search-box">Search Box</label>
      <input
        id="search-box"
        v-model="searchQuery"
        type="text"
        class="search-box"
        placeholder="find a hero/villain"
        @keyup="handleEnter"
      />
    </section>
    <section class="feel-lucky">
      <strong>Browse characters starting with this letter...</strong>
      <ul class="feel-lucky-list">
        <li
          v-for="(letter, idx) in iFeelLucky"
          :key="letter.id"
          class="feel-lucky-list__item"
        >
          <button
            :class="['feel-lucky-list__button', getButtonClass(idx)]"
            @click="handleLucky(letter)"
          >
            <strong>{{ letter }}</strong>
          </button>
        </li>
      </ul>
    </section>
    <SearchList
      v-if="searchQuery.length > 0"
      ref="searchList"
      :find="searchQuery"
      :query-type="findName"
    />
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
  computed: {
    iFeelLucky(): [] {
      // Load Chance
      const Chance = require('chance')
      const chance = new Chance()

      return chance.unique(chance.letter, 4)
    },
  },
  methods: {
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
      // @ts-ignore
      // use enter key to search for exact name
      if (this.findName && this.searchQuery.length > 0) {
        this.$nextTick(() => {
          // @ts-ignore
          this.$refs.searchList.fetchNow(true)
        })
      }
    },
    handleLucky(query: string): void {
      // @ts-ignore
      this.searchQuery = query
      this.$nextTick(() => {
        // @ts-ignore
        this.$refs.searchList.fetchNow(true)
      })
    },
  },
})
</script>

<style lang="scss">
section {
  @apply my-2;
}
.search-box {
  @apply h-24 mt-4 md:mt-8 w-full; // dimensions
  @apply border-primary rounded-lg focus:border-red-300 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50;
  @apply text-primary text-3xl sm:text-4xl md:text-7xl placeholder-primary;

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
</style>
