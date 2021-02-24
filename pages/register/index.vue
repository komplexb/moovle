<template>
  <authentication-form
    :options="{
      buttonTitle: 'Register',
      forgetPassword: false,
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
    async register(email, password) {
      try {
        await this.$axios.post('/api/auth/register', {
          email,
          password,
        })

        const user = await this.$auth.loginWith('local', {
          data: {
            email,
            password,
          },
        })

        if (user) {
          await this.$router.push('/login')
        }
      } catch (error) {
        this.$toast.error(error.response.data.message)
      }
    },
    handleAuthorize({ email, password }) {
      this.$toast.show('Registering')
      this.register(email, password)
    },
  },
}
</script>
