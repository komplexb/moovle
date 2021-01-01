<template>
  <div class="container">
    <header>
      <h1>{{ character.name }}</h1>
    </header>
    <main class="grid md:grid-cols-7 gap-4 pb-6">
      <div class="content-block md:col-span-2">
        <img
          v-if="isImageReady"
          loading="lazy"
          class="character-image"
          :src="`${characterImagePath}/portrait_incredible.${character.thumbnail.extension}`"
          :srcset="`${characterImagePath}/portrait_uncanny.${character.thumbnail.extension} 2x`"
          :alt="imageUnavailable ? 'Image Unavailable' : character.name"
        />
        <Chart :stats="stats" />
        <div class="toast">
          <a :href="characterLinks.detail" target="_blank"
            >Learn more about <strong>{{ character.name }}</strong>
          </a>
        </div>
      </div>
      <div class="content-block md:col-span-5">
        <h1>Description</h1>
        <p>
          {{ description | stripHtml }}
        </p>
        <Comics
          :id="id"
          :context="{
            comicLink: characterLinks.comic,
            comicCount: stats.values[0],
            character: character.name,
          }"
        />
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import analyze from 'rgbaster'
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
    characterLinks(): Object {
      const comic =
        // @ts-ignore
        this.character?.urls?.find(
          (el: { type: string; url: string }) => el.type === 'comiclink'
        ).url || ''

      const detail =
        // @ts-ignore
        this.character?.urls?.find(
          (el: { type: string; url: string }) => el.type === 'detail'
        ).url || ''
      return {
        comic,
        detail,
      }
    },
    description(): String {
      // @ts-ignore
      return this.character?.description || 'No description provided.'
    },
    imageUnavailable(): Boolean {
      // @ts-ignore
      return this.characterImagePath.includes('image_not_available')
    },
    isImageReady(): Boolean {
      // @ts-ignore
      return this.character?.thumbnail
    },
    characterImagePath(): String {
      // @ts-ignore
      return this.character?.thumbnail?.path.replace('http:', '')
    },
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
  },
  mounted() {
    this.$nextTick(function () {
      this.setBackgroundColors()
    })
  },
  updated() {
    this.$nextTick(function () {
      this.setBackgroundColors()
    })
  },
  methods: {
    async setBackgroundColors() {
      // @ts-ignore
      const path = `${this.characterImagePath}.${this.character?.thumbnail?.extension}`
      await analyze(path)
        .then((colors: []) => {
          if (document) {
            document.documentElement.style.setProperty(
              '--start-bg',
              // @ts-ignore
              colors[0].color
            )
            document.documentElement.style.setProperty(
              '--end-bg',
              // @ts-ignore
              colors[colors.length - 1].color
            )
          }
        })
        .catch((e: Error) => {
          console.error("Can't analyze unavailable image", e)
        })
    },
    stripHttps(path: String): String {
      // strip protocol to force https on prod
      return path.replace('http:', '')
    },
  },
})
</script>

<style lang="scss" scoped>
.character-image {
  @apply rounded-md;

  width: 100%;
}

header {
  @apply rounded-lg shadow-md p-2 mb-4 h-28 bg-white flex items-center justify-center;

  h1 {
    @apply text-3xl md:text-5xl text-black font-black;

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
