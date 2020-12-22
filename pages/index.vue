<template>
  <div class="container">
    <div>
      <Logo />
      <input type="text" class="search-box" placeholder="find your hero" />
    </div>
    <h2>Browse</h2>
    <ul class="search-list">
      <li
        v-for="(letter, idx) in alpha"
        :key="letter.id"
        class="search-list__item"
      >
        <button :class="['search-list__button', `bg-${getButtonColor()}`]">
          {{ letter }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import Chance from 'chance'

export default Vue.extend({
  name: 'Index',

  computed: {
    alpha(): [] {
      const alphabet = require('alphabet')
      return alphabet.upper
    },
  },
  methods: {
    // Load Chance
    getButtonColor(): String {
      const Chance = require('chance')

      // Instantiate Chance so it can be used
      const chance = new Chance()
      const colors = ['primary', 'primary-alt', 'secondary', 'secondary-alt']
      return chance.pickone(colors)
    },
  },
})
</script>

<style lang="scss">
.container {
  @apply min-h-screen text-center mx-auto;
}

.search-box {
  @apply h-24 border-primary rounded-lg focus:border-red-300 focus:ring-2 focus:ring-red-200 focus:ring-opacity-50 mt-4 md:mt-8;
  @apply text-primary text-3xl md:text-7xl placeholder-primary;

  border-width: 2px;
  width: 75vw;
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

  &.bg-secondary {
    @apply text-black;
  }
}
</style>
