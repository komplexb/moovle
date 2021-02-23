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
      <ul v-if="results.length > 0" class="favourites-list">
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
            <Card class="bg-white" :item="character" />
          </nuxt-link>
        </li>
      </ul>
      <p
        v-else-if="results.length === 0 && $fetchState.pending"
        class="text-center"
      >
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

<script>
export default {
  layout: 'favourites',
  async fetch() {
    // @ts-ignore
    const response = await this.$http
      .$get(`/api/favourites`)
      .then((response) => response)

    this.results = response
  },
  // middleware: ['auth'],
  data() {
    return {
      results: [],
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.favourites-list {
  @apply grid lg:grid-cols-2 2xl:grid-cols-3;
}
</style>
