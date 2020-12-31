<template>
  <div :class="`page-${$route.name}`">
    <p v-if="isCharacterPage" class="text-center">
      <nuxt-link to="/">Back</nuxt-link>
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
</style>
