<template>
  <authentication-form
    button-title="Sign In"
    @authorize="handleAuthorize($event)"
  ></authentication-form>
</template>

<script>
export default {
  layout: 'auth',
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    async login(email, password) {
      try {
        this.$toast.show('Logging in...')
        const response = await this.$auth.loginWith('local', {
          data: {
            email,
            password,
          },
        })
        this.$toast.success(response.data.message)
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    handleAuthorize({ email, password }) {
      console.warn(email, password)
      this.login(email, password)
    },
  },
}
</script>
