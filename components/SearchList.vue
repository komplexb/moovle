<template>
  <section>
    <ul v-if="results.length > 0" class="search-list">
      <li v-for="character in results" :key="character.id">
        <CharacterCard :character="character" />
      </li>
    </ul>
    <div v-else>Sorry we haven't created your hero yet, please try again.</div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import md5 from 'md5'

export default Vue.extend({
  name: 'SearchList',
  props: {
    find: {
      type: String,
      default: '',
      required: true,
    },
    queryType: {
      type: Boolean,
      default: false,
    },
  },
  async fetch() {
    const timestamp = Date.now()
    const hash = this.generateHash(timestamp)
    const params = `${this.queryType ? 'name' : 'nameStartsWith'}=${
      this.find
    }&apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`

    const response = await fetch(
      `${this.$config.baseURL}/characters?${params}`
    ).then((response) => response.json())

    this.results = response.data.results
  },
  data() {
    return {
      results: [],
    }
  },
  watch: {
    find(): void {
      setTimeout(() => {
        this.$fetch()
      }, 200)
    },
    queryType(val): void {
      if (val) {
        setTimeout(() => {
          this.$fetch()
        }, 200)
      }
    },
  },
  methods: {
    // Todo: a mixin would be nice, but we only do this twice
    generateHash(timestamp: Number): String {
      return md5(
        `${timestamp}${this.$config.marvelPrk}${this.$config.marvelPuk}`
      )
    },
  },
})
</script>

<style lang="scss" scoped>
section {
  @apply mt-4 md:mt-8;
}
.search-list {
  @apply grid lg:grid-cols-2 2xl:grid-cols-3;
}
</style>
