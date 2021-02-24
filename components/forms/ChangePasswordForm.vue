<template>
  <div>
    <form class="flex flex-col" @submit.prevent="$emit('authorize', form)">
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
          autofocus
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-primary transition duration-500 px-3 pb-3"
        />
      </div>
      <div class="mb-6 pt-3 rounded bg-gray-200">
        <label
          class="block text-gray-700 text-sm font-bold mb-2 ml-3"
          for="passwordCheck"
          >Re-enter password</label
        >
        <input
          id="passwordCheck"
          v-model="form.passwordCheck"
          placeholder="same passphrase"
          type="password"
          required
          class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-primary transition duration-500 px-3 pb-3"
        />
      </div>
      <button :disabled="!validatePassword" class="button" type="submit">
        {{ buttonTitle }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ChangePasswordForm',
  props: {
    buttonTitle: {
      required: true,
    },
  },
  data: () => ({
    form: {
      password: '',
      passwordCheck: '',
    },
  }),
}
</script>

<style lang="scss" scoped></style>
