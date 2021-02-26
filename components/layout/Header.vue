<template>
  <header>
    <div class="container relative">
      <button class="toggle-nav font-bold" @click="navVisible = !navVisible">
        {{ navVisible ? 'Close' : 'Menu' }}
      </button>
    </div>
    <nav :class="[{ show: navVisible }, '']">
      <ul class="container">
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li v-if="!$auth.loggedIn">
          <nuxt-link to="/login">Login</nuxt-link>
        </li>
        <li v-if="!$auth.loggedIn">
          <nuxt-link to="/register">Register</nuxt-link>
        </li>
        <li v-if="$auth.loggedIn && $auth.hasScope('favourites')">
          <nuxt-link to="/favourites">Favourite Heroes</nuxt-link>
        </li>
        <li v-if="$auth.loggedIn">
          <nuxt-link to="/login/reset">Reset Password</nuxt-link>
        </li>
        <li v-if="$auth.loggedIn">
          <button class="" @click="$auth.logout()">Logout</button>
        </li>
        <li v-if="$auth.loggedIn" class="user">
          {{ user.email }}
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Header',
  data() {
    return {
      navVisible: false,
    }
  },
  computed: {
    user(): String {
      // @ts-ignore
      return this.$auth.user?.user
    },
  },
})
</script>

<style scoped lang="scss">
.user {
  @apply text-xl;

  color: var(--color-secondary);
  padding: 14px 16px;
  text-align: center;
  font-weight: bold;
}
.toggle-nav {
  @apply py-2 px-4 text-primary rounded-md border-2 top-2;

  border-color: currentColor;
  position: absolute;

  .page-favourites & {
    @apply text-white;
  }
}
nav {
  @apply mt-16;

  padding-left: 0 !important;
  padding-right: 0 !important;
  display: none;
  overflow: hidden;
  background-color: var(--color-primary-alt);
  position: relative;

  &.show {
    display: block;
  }

  /* Style navigation menu links */
  button,
  a {
    color: white;
    padding: 14px 16px;
    text-decoration: none;
    font-size: 17px;
    display: block;
    width: 100%;
    text-align: left;

    &:hover {
      background-color: var(--color-secondary);
      color: var(--color-primary-alt);
    }
  }
}
</style>
