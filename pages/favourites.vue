<template>
  <section class="container">
    <header>
      <h1>Favourite Heroes</h1>
    </header>
    <main class="content-block">
      <div v-if="$fetchState.pending" class="flex justify-center">
        <img src="~/assets/images/loader.gif" alt="Loading" />
      </div>
      <div v-else-if="$fetchState.error" class="flex justify-center">
        <p v-if="$fetchState.error.message.includes('timed out')">
          {{ $fetchState.error.message }}. The Marvel API may be down, please
          try again later.
        </p>
        <p v-else>
          There was an error loading this page. Please refresh to try again or
          come back later.
        </p>
      </div>
      <template v-else>
        <ul v-if="results.length > 0" class="favourites-list">
          <li v-for="(character, i) in results" :key="character.id">
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
        <p v-else class="text-center">
          Looks like you don't have any favourites.
        </p>
        <div v-if="$fetchState.pending" class="flex justify-center">
          <img src="~/assets/images/loader.gif" alt="Loading" />
        </div>
      </template>
    </main>
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
  middleware: ['auth'],
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

header {
  @apply rounded-lg shadow-md p-2 mb-4 h-28 bg-white flex items-center justify-center;

  h1 {
    @apply text-3xl sm:text-4xl md:text-5xl text-black font-black;

    font-family: 'Titillium Web', sans-serif;
    text-transform: uppercase;
    word-break: break-all;
  }
}
.content-block {
  @apply bg-white rounded-lg shadow-md p-2;

  p {
    @apply text-primary-alt font-semibold;
  }
}
</style>
