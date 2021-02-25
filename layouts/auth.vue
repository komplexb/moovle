<template>
  <div
    class="page-auth flex flex-col min-h-screen"
    :class="`page-${$route.name}`"
  >
    <header class="max-w-lg mx-auto">
      <nuxt-link
        class="text-white align-middle p-4 inline-block"
        to="/"
        title="Back to Home"
      >
        <img src="~/assets/images/moovle-white.png" alt="" class="logo-small" />
      </nuxt-link>
    </header>
    <main
      class="bg-white w-11/12 md:w-96 mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl"
    >
      <section>
        <h3 class="font-bold text-2xl">Welcome to Moovle</h3>
        <p class="text-gray-600 pt-2">
          {{ formDescriptions }}
        </p>
      </section>

      <section class="mt-10">
        <Nuxt keep-alive />
      </section>
    </main>
    <div
      v-if="$route.name === 'login'"
      class="max-w-lg mx-auto text-center mt-12 mb-6"
    >
      <p class="text-white">
        Don't have an account?
        <nuxt-link to="/register" class="text-white font-bold hover:underline">
          Sign up</nuxt-link
        >.
      </p>
    </div>
    <Footer class="footer--auth" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    formDescriptions(): String {
      const description = {
        login: 'Sign in to your account.',
        register: 'Register for an account.',
        'login-reset':
          'Enter your email address to receive a link to reset your password.',
        'register-resend': `Can't find your confirmation email? Enter your email address to get a new one.`,
        'login-reset-confirmation': `Change your password`,
        'login-reset-password':
          'Password should be at least 8 characters, including a number, symbol and capital letter.',
      }
      // @ts-ignore
      return description[this.$route?.name]
    },
  },
})
</script>

<style lang="scss">
.page-auth {
  background-color: var(--color-primary);
  background-image: linear-gradient(
    315deg,
    var(--color-primary) 0%,
    #f87171 74%
  );
}
</style>
