<template>
  <div class="flex flex-col min-h-screen" :class="`page-${$route.name}`">
    <p class="text-center">
      <template v-if="isCharacterPage">
        <nuxt-link
          class="text-white align-middle p-4 inline-block"
          to="/"
          title="Back to Home"
        >
          <img
            src="~/assets/images/moovle-white.png"
            alt=""
            class="logo-small"
          />
        </nuxt-link>
      </template>
      <Logo v-else />
    </p>
    <Nuxt keep-alive />
    <footer class="mt-auto p-4">
      <div class="text-center text-primary font-semibold">
        <a href="https://byronbuckley.com" target="_blank">Byron Buckley ©</a>
      </div>
      <p class="text-center text-xs">Data provided by Marvel. © 2014 Marvel</p>
    </footer>
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
  @apply transition transition-colors bg-secondary;

  background-image: linear-gradient(
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
