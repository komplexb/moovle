<template>
  <section>
    <h1>Recent comics</h1>
    <template v-if="$fetchState.pending">
      <div class="flex justify-center">
        <img src="~/assets/images/loader.gif" alt="Loading" />
      </div>
    </template>
    <template v-else-if="$fetchState.error">
      <p>Error while fetching comics. Please refresh try again.</p>
    </template>
    <template v-else>
      <template v-if="comics.length > 0">
        <ul class="comics mt-1">
          <li v-for="comic in comics" :key="comic.id">
            <a :href="getComicLink(comic)" :title="comic.title" target="_blank">
              <Card :item="comic" :options="options" />
            </a>
          </li>
        </ul>
        <div v-if="context.comicCount > fetchLimit" class="toast">
          <a :href="context.comicLink" target="_blank">
            View all {{ context.comicCount }} comics featuring
            <strong>{{ context.character }}</strong>
          </a>
        </div>
      </template>
      <p v-else class="text-primary-alt">
        <strong>{{ context.character }}</strong> doesn't have any comics.
      </p>
    </template>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { CookieStorage } from 'cookie-storage'
const cookieStorage = new CookieStorage()

export default Vue.extend({
  name: 'Comics',
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
    context: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  async fetch() {
    const params = `?orderBy=-onsaleDate&limit=${this.fetchLimit}` // show recent n comics in descending order

    // @ts-ignore
    // set bearer token for server-side validation
    this.$http.setHeader(
      'Authorization',
      cookieStorage.getItem('auth._token.local')
    )
    // @ts-ignore
    const response = await this.$http
      .$get(`/api/marvel/comics/${this.id}${params}`)
      .then((response: Response) => response)

    this.comics = response.data.results

    this.$nextTick(function () {
      // flag for toggling bg colors
      this.$emit('comicsLoaded')
    })
  },
  data() {
    return {
      comics: [],
      options: {
        cardType: 'comic',
      },
      fetchLimit: 6,
    }
  },
  methods: {
    getComicLink(comic: Object): String {
      // @ts-ignore
      return comic.urls[0]?.url || ''
    },
  },
})
</script>

<style scoped lang="scss">
.comics {
  @apply grid lg:grid-cols-2 gap-x-4;

  a {
    // display: inline-block;
  }
}
</style>
