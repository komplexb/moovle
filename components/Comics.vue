<template>
  <section>
    <h1>Recent comics</h1>
    <template v-if="comics.length > 0">
      <ul class="comics">
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
    <p v-else>
      <strong>{{ context.character }}</strong> doesn't have any comics.
    </p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'

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
    const timestamp = Date.now()
    // @ts-ignore
    const hash = this.generateHash(timestamp)
    const auth = `?apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`
    const params = `&orderBy=-onsaleDate&limit=${this.fetchLimit}` // show recent n comics in descending order

    const response = await fetch(
      `${this.$config.baseURL}/characters/${this.id}/comics${auth}${params}`
    ).then((response) => response.json())

    this.comics = response.data.results
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
