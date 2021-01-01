<template>
  <section>
    <ul v-if="results.length > 0" class="search-list">
      <li v-for="character in results" :key="character.id">
        <nuxt-link
          :to="{
            path: `/character/${character.id}`,
            params: { id: character.id },
            props: { character },
          }"
        >
          <Card :item="character" />
        </nuxt-link>
      </li>
    </ul>
    <div v-else>Sorry we haven't created your hero yet, please try again.</div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

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
    // @ts-ignore
    const hash = this.generateHash(timestamp)
    const auth = `?apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`
    const params = `&${this.queryType ? 'name' : 'nameStartsWith'}=${this.find}`

    const response = await fetch(
      `${this.$config.baseURL}/characters${auth}${params}`
    ).then((response) => response.json())

    this.results = response.data.results
  },
  data() {
    return {
      results: [],
    }
  },
  watch: {
    find(val): void {
      // single characters are likely a "i feel lucky" query
      // so fetch now, else throttle fetch
      if (val.length === 1) {
        this.$fetch()
      } else {
        setTimeout(() => {
          this.$fetch()
        }, 200)
      }
    },
    queryType(val): void {
      if (val) {
        setTimeout(() => {
          this.$fetch()
        }, 200)
      }
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
