<template>
  <section>
    <div
      v-if="$fetchState.pending && pageCount === 0"
      class="flex justify-center"
    >
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
        <li
          v-for="(character, i) in results"
          :key="character.id"
          v-observe-visibility="
            i === results.length - 1 ? lazyLoadResults : false
          "
        >
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
      <div
        v-if="$fetchState.pending && pageCount > 0"
        class="flex justify-center"
      >
        <img src="~/assets/images/loader.gif" alt="Loading" />
      </div>
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
    findName: {
      type: Boolean,
      default: false,
    },
  },
  async fetch() {
    const timestamp = Date.now()
    // @ts-ignore
    const hash = this.generateHash(timestamp)
    const cleanQuery = sanitizeHtml(this.find.trim(), {
      allowedTags: [],
    })
    const params = `?${
      this.findName ? 'name' : 'nameStartsWith'
    }=${cleanQuery}&offset=${this.pageCount}`
    const auth = `&apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`

    // @ts-ignore
    const response = await this.$http
      .$get(`${this.$config.baseURL}/characters${params}${auth}`)
      .then((response: Response) => response)

    const { results = [], total = 0, count = 0 } = response?.data

    this.pageCount += count
    this.pageTotal = total
    this.results = this.results.concat(results)
  },
  data() {
    return {
      currentPage: 1,
      debounceTimeoutId,
      results: [],
      pageCount: 0,
      pageTotal: 0,
    }
  },
  watch: {
    find(val, oldVal): void {
      if (val.length === 0) return

      if (val !== oldVal) {
        this.resetSearchResults()

        this.fetchNow()
      }
    },
  },
  methods: {
    resetSearchResults(): void {
      this.results = []
      this.pageCount = 0
      this.pageTotal = 0
    },
    fetchNow(yes = false): void {
      // cancel queued fetches
      clearTimeout(this.debounceTimeoutId)
      if (yes) {
        this.resetSearchResults()
        this.$fetch()
      } else {
        this.debounceTimeoutId = setTimeout(() => {
          this.$fetch()
        }, 300)
      }
    },
    lazyLoadResults(isVisible: Boolean) {
      const theresMore = this.pageCount < this.pageTotal
      if (isVisible && theresMore) {
        this.fetchNow()
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
