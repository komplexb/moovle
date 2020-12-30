<template>
  <div class="container px-4 m:px-40">
    <strong>{{ character.name }}</strong>
    <p>
      {{ description | formatDescription }}
    </p>
    <strong>Learn More</strong>
    <ul>
      <li v-for="detail in character.urls" :key="detail.id">
        <a :href="detail.url" target="_blank">{{
          detail.type | formatLinks
        }}</a>
      </li>
    </ul>
    <img
      v-if="isImageReady"
      :src="`${character.thumbnail.path}/portrait_incredible.${character.thumbnail.extension}`"
      :srcset="`${character.thumbnail.path}/portrait_uncanny.${character.thumbnail.extension} 2x`"
      :alt="imageUnavailable ? 'Image Unavailable' : character.name"
    />
    <Chart :stats="stats" />
    <Comics :id="id" />
    <a :href="comicLink" target="_blanks">{{
      `View All ${stats.values[0]} ${character.name} Comics`
    }}</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
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
    // @ts-ignore
    const hash = this.generateHash(timestamp)
    const params = `?apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`

    const response = await fetch(
      `${this.$config.baseURL}/characters/${this.id}${params}`
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
    comicLink(): String {
      // @ts-ignore
      const comiclink = this.character?.urls?.find(
        (el: { type: string; url: string }) => el.type === 'comiclink'
      )
      return comiclink?.url || ''
    },
    description(): String {
      // @ts-ignore
      return this.character?.description || 'No description provided.'
    },
    isImageReady(): Boolean {
      // @ts-ignore
      return this.character?.thumbnail
    },
    imageUnavailable(): Boolean {
      // @ts-ignore
      return this.character.thumbnail.path.includes('image_not_available')
    },
  },
})
</script>
