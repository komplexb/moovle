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
        type="text"
        class="bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-primary transition duration-500 px-3 pb-3"
      />
    </div>
    <button
      class="bg-primary hover:bg-red-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
      type="submit"
    >
      {{ buttonTitle }}
    </button>
  </form>
</template>

<script>
export default {
  name: 'EmailForm',
  props: {
    buttonTitle: {
      type: String,
      default: 'Log In',
      required: true,
    },
  },
  data: () => ({
    form: {
      email: '',
    },
  }),
}
</script>

<style lang="scss" scoped>
input {
  @apply focus:ring-red-200 focus:ring-opacity-10;
}
</style>
