<template>
  <section>
    <div v-if="$fetchState.pending" class="flex justify-center">
      <img src="~/assets/images/loader.gif" alt="Loading" />
    </div>
    <div v-else-if="$fetchState.error" class="flex justify-center">
      <p v-if="$fetchState.error.message.includes('timed out')">
        {{ $fetchState.error.message }}. The Marvel API may be down, please try
        again later.
      </p>
      <p v-else>
        There was an error loading this page. Please refresh to try again or
        come back later.
      </p>
    </div>
    <template v-else>
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
      <p v-else class="text-center">
        Sorry we haven't created your hero yet, please try again.
      </p>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import sanitizeHtml from 'sanitize-html'

let debounceTimeoutId: any

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
    const params = `?${this.queryType ? 'name' : 'nameStartsWith'}=${
      this.cleanQuery
    }`
    const auth = `&apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`

    // @ts-ignore
    const response = await this.$http
      .$get(`${this.$config.baseURL}/characters${params}${auth}`)
      .then((response: Response) => response)

    this.results = response?.data?.results || []
  },
  data() {
    return {
      cleanQuery: this.find,
      debounceTimeoutId,
      results: [],
    }
  },
  watch: {
    find(val, oldVal): void {
      if (val.length === 0) return

      if (val !== oldVal) this.fetchNow()
    },
  },
  methods: {
    fetchNow(yes = false): void {
      this.cleanQuery = sanitizeHtml(this.find.trim(), {
        allowedTags: [],
      })

      // cancel queued fetches
      clearTimeout(this.debounceTimeoutId)
      if (yes) {
        this.$fetch()
      } else {
        this.debounceTimeoutId = setTimeout(() => {
          this.$fetch()
        }, 300)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
section {
  @apply mt-8;
}
.search-list {
  @apply grid lg:grid-cols-2 2xl:grid-cols-3;
}
</style>
