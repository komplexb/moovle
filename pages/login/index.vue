<template>
  <authentication-form
    :options="{
      buttonTitle: 'Sign In',
      forgetPassword: true,
    }"
    @authorize="handleAuthorize($event)"
  />
</template>

<script>
export default {
  layout: 'auth',
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    async login({ email, password }) {
      try {
        this.$toast.show('Logging in...')
        const response = await this.$auth.loginWith('local', {
          data: {
            email,
            password,
          },
        })
        this.$toast.success(response.data.message)
        await this.$router.push('/admin')
      } catch (error) {
        this.$toast.error(error.response.data.message, { duration: 5000 })
      }
    },
  },
}
</script>
