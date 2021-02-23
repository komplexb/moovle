<template>
  <div class="flex flex-col min-h-screen" :class="`page-${$route.name}`">
    <header>
      <nav>
        <ul>
          <li v-if="!$auth.loggedIn">
            <nuxt-link to="/login">Login</nuxt-link>
          </li>
          <li v-if="!$auth.loggedIn">
            <nuxt-link to="/register">Register</nuxt-link>
          </li>
          <li v-if="$auth.loggedIn">
            <nuxt-link to="/login/reset">Reset Password</nuxt-link>
          </li>
          <li v-if="$auth.loggedIn">
            <button class="button--link" @click="$auth.logout()">Logout</button>
          </li>
        </ul>
      </nav>
    </header>
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

export default Vue.extend({
  computed: {
    isCharacterPage(): Boolean {
      return this.$route.name === 'character-id'
    },
  },
})
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
