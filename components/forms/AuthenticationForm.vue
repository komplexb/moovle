<template>
  <form class="flex flex-col" @submit.prevent="$emit('authorize', form)">
    <div class="mb-6 pt-3 rounded bg-gray-200">
      <label class="block text-gray-700 text-sm font-bold mb-2 ml-3" for="email"
        >Email</label
      >
      <input
        id="email"
        v-model="form.email"
        placeholder="dont@me.com"
        type="email"
        required
        autofocus
        class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-primary transition duration-500 px-3 pb-3"
      />
    </div>
    <div class="mb-6 pt-3 rounded bg-gray-200">
      <label
        class="block text-gray-700 text-sm font-bold mb-2 ml-3"
        for="password"
        >Password</label
      >
      <input
        id="password"
        v-model="form.password"
        placeholder="try a passphrase"
        type="password"
        required
        class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-primary transition duration-500 px-3 pb-3"
      />
    </div>
    <div v-if="options.forgetPassword" class="flex justify-end">
      <nuxt-link
        to="/login/reset"
        class="text-sm text-primary hover:text-red-700 hover:underline mb-6"
        >Forgot your password?
      </nuxt-link>
    </div>
    <button :disabled="!isValid" class="button" type="submit">
      {{ options.buttonTitle }}
    </button>
  </form>
</template>

<script>
export default {
  name: 'AuthenticationForm',
  props: {
    options: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data: () => ({
    form: {
      email: '',
      password: '',
    },
  }),
  computed: {
    isValid() {
      const { password, email } = this.form
      const isEmpty = password.trim().length === 0 || email.trim().length === 0

      return !isEmpty && password.trim() !== email.trim()
    },
  },
  mounted() {},
  methods: {},
}
</script>
<style lang="scss" scoped>
input {
  @apply focus:ring-red-200 focus:ring-opacity-10;
}
</style>
