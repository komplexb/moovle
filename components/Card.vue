<template>
  <div class="card">
    <div
      :class="[
        'card__image',
        {
          'card__image--unavailable': imageUnavailable(item.thumbnail.path),
        },
      ]"
    >
      <img
        :src="`${item.thumbnail.path}/standard_medium.${item.thumbnail.extension}`"
        :srcset="`${item.thumbnail.path}/standard_xlarge.${item.thumbnail.extension} 2x`"
        :alt="item.name"
      />
    </div>
    <div class="card__details">
      <strong>{{ item.name || item.title }}</strong>
      <p v-if="item.description" class="card__description">
        {{ item.description | formatDescription(true) }}
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
  },
  methods: {
    imageUnavailable(path: String): Boolean {
      return path.includes('image_not_available')
    },
  },
})
</script>

<style lang="scss" scoped>
.card {
  @apply grid grid-cols-3 gap-2 mb-2 p-2 mx-auto;
  @apply w-full xs:w-4/5 md:w-96 lg:h-36;
  @apply border-secondary border-2 rounded-lg shadow-inner shadow-sm;
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
</style>
