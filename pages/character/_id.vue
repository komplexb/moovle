<template>
  <div class="container px-4 m:px-40">
    <h1>{{ character.name }}</h1>
    <p v-if="description.length > 0">{{ character.description }}</p>
    <strong>Learn More</strong>
    <ul>
      <li v-for="detail in character.urls" :key="detail.id">
        <a :href="detail.url" target="_blank">{{
          detail.type | formatLinks
        }}</a>
      </li>
    </ul>
    <bars
      class="bar"
      :data="stats.values"
      :label-size="0.1"
      :auto-draw="true"
      :width="150"
      :height="75"
      :padding="2"
      :label-rotate="0"
    >
    </bars>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import md5 from 'md5'
import { toHeaderCase } from 'js-convert-case'
import Bars from 'vuebars'
Vue.use(Bars)

export default Vue.extend({
  name: 'Character',
  filters: {
    formatLinks(val: String): String {
      if (val === 'comiclink') {
        return 'Comics'
      }
      return `Character ${toHeaderCase(val)}`
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
      const { comics, events, series, stories } = this.character
      return {
        labels: ['comics', 'events', 'series', 'stories'],
        values: [
          comics?.available || 0,
          events?.available || 0,
          series?.available || 0,
          stories?.available || 0,
        ],
      }
    },
    comics(): {} {
      const {
        comics: { items },
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
      return this.character?.description || ''
    },
  },
  methods: {
    // a mixin would be nice, but we only do this twice
    generateHash(timestamp: Number): String {
      return md5(
        `${timestamp}${this.$config.marvelPrk}${this.$config.marvelPuk}`
      )
    },
  },
})
</script>

<style lang="scss">
svg.bar {
  width: 200px;

  /* .container {
    min-height: unset;
    max-width: none;
    width: unset;
    margin: unset;
  } */

  @apply pl-1 pb-1 border-l-2 border-b-2 border-gray-500 rounded-sm;

  #bar-id-0 {
    fill: var(--color-primary);
  }
  #bar-id-1 {
    fill: var(--color-primary-alt);
  }
  #bar-id-2 {
    fill: var(--color-secondary);
  }
  #bar-id-3 {
    fill: var(--color-secondary-alt);
  }
}
</style>
