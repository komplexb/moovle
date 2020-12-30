<template>
  <ul v-if="comics.length > 0" class="comics">
    <li v-for="comic in comics" :key="comic.id">
      <a :href="comicLink(comic)" :title="comic.title" target="_blank">
        <Card :item="comic" :options="options" />
      </a>
    </li>
  </ul>
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
  },
  async fetch() {
    const timestamp = Date.now()
    // @ts-ignore
    const hash = this.generateHash(timestamp)
    const auth = `?apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`
    const params = `&orderBy=-onsaleDate&limit=6` // show recent n comics in descending order

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
    }
  },
  methods: {
    comicLink(comic: Object): String {
      // @ts-ignore
      return comic.urls[0]?.url || ''
    },
  },
})
</script>

<style scoped>
.comics {
  a {
    display: inline-block;
  }
}
</style>
