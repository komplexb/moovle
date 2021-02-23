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
            <nuxt-link to="/favourites">Favourite Heroes</nuxt-link>
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
