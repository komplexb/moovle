<template>
  <authentication-form
    :options="{
      buttonTitle: 'Sign In',
      forgetPassword: true,
    }"
    @authorize="login($event)"
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
        this.$toast.success(response.data.message, {
          onComplete: this.$router.push('/'),
        })
      } catch (error) {
        this.$toast.error(error.response.data.message, { duration: 5000 })
      }
    },
  },
}
</script>
