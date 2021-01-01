<template>
  <div
    :class="[
      'card',
      {
        'card--comic': isComic,
      },
    ]"
  >
    <div
      :class="[
        'card__image',
        {
          'card__image--unavailable': imageUnavailable,
        },
      ]"
    >
      <img
        :src="imageSize('default')"
        :srcset="`${imageSize('retina')} 2x`"
        :alt="imageUnavailable ? 'Image Unavailable' : item.name"
      />
    </div>
    <div class="card__details">
      <strong :class="{ truncate: item.description }">{{
        item.name || item.title
      }}</strong>
      <p v-if="item.description" class="card__description">
        {{ item.description | stripHtml | truncate }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Card',
  props: {
    item: {
      type: Object,
      default: () => ({}),
      required: true,
    },
    options: {
      type: Object,
      default: () => ({}),
      required: false,
    },
  },
  computed: {
    imageUnavailable(): Boolean {
      return this.item.thumbnail.path.includes('image_not_available')
    },
    imageFormat(): String {
      return this.isComic ? 'portrait' : 'standard'
    },
    isComic(): Boolean {
      return this.options?.cardType === 'comic'
    },
  },
  methods: {
    imageSize(size = 'default'): Object {
      const { path, extension } = this.item.thumbnail
      const sizes = {
        portrait: {
          default: 'portrait_incredible',
          retina: 'portrait_uncanny',
        },
        standard: {
          default: 'standard_medium',
          retina: 'standard_xlarge',
        },
      }
      // @ts-ignore
      return `${this.stripHttps(path)}/${
        // @ts-ignore
        sizes[this.imageFormat][size]
      }.${extension}`
    },
    stripHttps(path: String): String {
      // strip protocol to force https on prod
      return path.replace('http:', '')
    },
  },
})
</script>

<style lang="scss" scoped>
.card {
  @apply grid grid-cols-3 gap-2 mb-2 p-2 mx-auto; // position
  @apply w-full xs:w-4/5 md:w-96 lg:h-36; // size
  @apply border-secondary border-2 rounded-lg shadow-inner shadow-sm; // styles
}

.card__details {
  @apply col-span-2;
  display: flex;
  flex-direction: column;
  justify-content: center;

  strong {
    @apply md:text-lg text-primary-alt;
  }

  p {
    @apply text-secondary-alt;

    word-break: break-word;
  }
}

.card__image {
  display: flex;
  align-items: center;

  img {
    @apply object-cover h-20 w-20 sm:h-24 sm:w-24 rounded-full;
  }
}
.card__image--unavailable {
  img {
    @apply rounded-none object-left-bottom;
  }
}

.card--comic {
  @apply h-40 w-full; // size
  img {
    @apply object-cover h-32 w-24 rounded-sm transition-all;
  }

  &:hover {
    img {
      @apply shadow-md transform scale-150;
    }
  }
}
</style>
