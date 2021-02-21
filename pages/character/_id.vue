<template>
  <div class="pg-character container" :data-cy-bg-styled="bgStyled">
    <div v-if="$fetchState.error" class="flex justify-center">
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
      <header>
        <h1>{{ character.name }}</h1>
      </header>
      <main class="grid md:grid-cols-7 gap-4 pb-6">
        <div class="content-block md:col-span-2">
          <img
            v-if="isImageReady"
            ref="characterImg"
            class="character-image"
            :class="{
              'character-image--unavailable': imageUnavailable,
            }"
            :src="`${characterImagePath}/portrait_incredible.${character.thumbnail.extension}`"
            :srcset="`${characterImagePath}/portrait_uncanny.${character.thumbnail.extension}
          2x`"
            :alt="imageUnavailable ? 'Image Unavailable' : character.name"
            @load="isImageLoaded = true"
          />
          <h1 v-show="imageUnavailable" class="sm:hidden mb-4 text-center">
            Character Image Unavailable
          </h1>
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
              comicCount,
              character: character.name,
            }"
            @comicsLoaded="isComicsLoaded = true"
          />
        </div>
      </main>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import analyze from 'rgbaster'

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
    // @ts-ignore
    const response = await this.$http
      .$get(`/api/marvel/character/${this.id}`)
      .then((response: Response) => response)

    this.character = response.data.results[0]
  },
  data() {
    return {
      // ToDo:
      // {id} more flexible passed as props:
      // https://router.vuejs.org/guide/essentials/passing-props.html#boolean-mode
      // but requires extending router config:
      // https://nuxtjs.org/docs/2.x/features/file-system-routing#extending-the-router
      id: this.$route.params.id,
      bgStyled: false,
      character: {
        name: '',
      },
      isImageLoaded: false,
      isComicsLoaded: false,
    }
  },
  computed: {
    // only toggle background colors after the profile image and comics are loaded
    canToggleBackground(): Boolean {
      return (
        this.isImageLoaded && (this.isComicsLoaded || this.comicCount === 0)
      )
    },
    comicCount(): Number {
      // @ts-ignore
      return this.stats.values[0]
    },
    characterImagePath(): String {
      // @ts-ignore
      return this.character?.thumbnail?.path.replace('http:', '') || ''
    },
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
  watch: {
    canToggleBackground(val: Boolean): void {
      if (val) this.setBackgroundColors()
    },
  },
  activated() {
    this.$nextTick(() => {
      // toggle bg colors on cached pages
      // will fail the first time
      this.setBackgroundColors()
    })
  },
  methods: {
    async setBackgroundColors() {
      // @ts-ignore
      const path = this.$refs.characterImg?.currentSrc || ''

      if (!path) return
      await analyze(path, {
        scale: 0.3,
      })
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
            this.bgStyled = true
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
  head() {
    // @ts-ignore
    const title = `${this.character?.name} | Moovle` || 'Moovle'
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
      ],
    }
  },
})
</script>

<style lang="scss" scoped>
.character-image {
  @apply rounded-md;

  width: 100%;

  &--unavailable {
    @apply hidden sm:inline-block;
  }
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
