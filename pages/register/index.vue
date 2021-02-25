<template>
  <authentication-form
    :options="{
      buttonTitle: 'Register',
      forgetPassword: false,
    }"
    @authorize="register($event)"
  />
</template>

<script>
export default {
  layout: 'auth',
  middleware: ['isLoggedIn'],
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    async register({ email, password }) {
      this.$toast.show('Registering')
      try {
        // sign up
        await this.$axios.post('/api/auth/register', {
          email,
          password,
        })

        // then try to login which will trigger the verification email
        // on first attempt to login
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
  },
}
</script>
