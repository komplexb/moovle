<template>
  <div class="container px-4 m:px-40">
    <h1>{{ character.name }}</h1>
    <p v-if="description.length > 0">
      {{ character.description | formatDescription }}
    </p>
    <strong>Learn More</strong>
    <ul>
      <li v-for="detail in character.urls" :key="detail.id">
        <a :href="detail.url" target="_blank">{{
          detail.type | formatLinks
        }}</a>
      </li>
    </ul>
    <Chart :stats="stats" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import md5 from 'md5'
// @ts-ignore
import Bars from 'vuebars'
Vue.use(Bars)

export default Vue.extend({
  name: 'Character',
  filters: {
    formatLinks(val: String): String {
      if (!val) return ''

      val = val.toString()
      if (val === 'comiclink') {
        return 'Comics'
      }

      val = val.charAt(0).toUpperCase() + val.slice(1)
      return `Character ${val}`
    },
  },
  async fetch() {
    const timestamp = Date.now()
    const hash = this.generateHash(timestamp)
    const params = `${this.id}?apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`

    const response = await fetch(
      `${this.$config.baseURL}/characters/${params}`
    ).then((response) => response.json())

    this.character = response.data.results[0]
  },
  data() {
    return {
      // ToDo:
      // more flexible passed as props:
      // https://router.vuejs.org/guide/essentials/passing-props.html#boolean-mode
      // but requires extending router config:
      // https://nuxtjs.org/docs/2.x/features/file-system-routing#extending-the-router
      id: this.$route.params.id,
      character: {},
    }
  },
  computed: {
    stats(): {} {
      // @ts-ignore
      const { comics, series, stories } = this.character
      return {
        labels: ['comics', 'series', 'stories'],
        values: [
          comics?.available || 0,
          series?.available || 0,
          stories?.available || 0,
        ],
      }
    },
    comics(): {} {
      const {
        // @ts-ignore
        comics: { items },
        // @ts-ignore
        urls,
      } = this.character

      const comiclink = urls.find(
        (el: { type: string; url: string }) => el.type === 'comiclink'
      )
      return {
        items,
        url: comiclink?.url || '',
      }
    },
    description(): String {
      // @ts-ignore
      return this.character?.description || ''
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
