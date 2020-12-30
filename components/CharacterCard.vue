<template>
  <nuxt-link
    :to="{
      path: `/character/${character.id}`,
      params: { id: character.id },
      props: { character },
    }"
  >
    <div class="character">
      <div
        :class="[
          'character__image',
          {
            'character__image--unavailable': imageUnavailable(
              character.thumbnail.path
            ),
          },
        ]"
      >
        <img
          :src="`${character.thumbnail.path}/standard_medium.${character.thumbnail.extension}`"
          :srcset="`${character.thumbnail.path}/standard_xlarge.${character.thumbnail.extension} 2x`"
          :alt="character.name"
        />
      </div>
      <div class="character__details">
        <strong>{{ character.name }}</strong>
        <p v-if="character.description" class="character__description">
          {{ character.description | formatDescription(true) }}
        </p>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CharacterCard',
  props: {
    character: {
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
.character {
  @apply grid grid-cols-3 gap-2 mb-2 p-2 mx-auto;
  @apply w-full xs:w-4/5 md:w-96 lg:h-36;
  @apply border-secondary border-2 rounded-lg shadow-inner shadow-sm;
}

.character__details {
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

.character__image {
  display: flex;
  align-items: center;

  img {
    @apply object-cover h-20 w-20 sm:h-24 sm:w-24 rounded-full;
  }
}
.character__image--unavailable {
  img {
    @apply rounded-none object-left-bottom;
  }
}
</style>
