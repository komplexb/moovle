<template>
  <div class="flex flex-col min-h-screen" :class="`page-${$route.name}`">
    <Header></Header>
    <p class="text-center">
      <nuxt-link
        class="text-white align-middle p-4 inline-block"
        to="/"
        title="Back to Home"
      >
        <img src="~/assets/images/moovle-white.png" alt="" class="logo-small" />
      </nuxt-link>
    </p>
    <Nuxt keep-alive />
    <Footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style lang="scss">
.page-favourites {
  background-color: var(--color-primary);
  background-image: linear-gradient(
    315deg,
    var(--color-primary) 0%,
    #f87171 74%
  );
}
.logo-small {
  @apply h-4;

  display: inline-block;
}
</style>
