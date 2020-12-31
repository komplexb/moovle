<template>
  <div :class="`page-${$route.name}`">
    <p v-if="isCharacterPage" class="text-center py-2 mb-2">
      <nuxt-link class="text-white align-middle" to="/" title="Back to Home">
        <img src="~/assets/images/moovle-white.png" alt="" class="logo-small" />
      </nuxt-link>
    </p>
    <Logo v-else />
    <Nuxt keep-alive />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    isCharacterPage(): Boolean {
      return this.$route.name === 'character-id'
    },
  },
})
</script>

<style lang="scss">
.page-character-id {
  @apply transition transition-colors;
  background: linear-gradient(
    45deg,
    var(--start-bg, --color-primary-alt),
    var(--end-bg, --color-secondary-alt)
  );
}
.logo-small {
  @apply h-4;

  display: inline-block;
}
</style>
