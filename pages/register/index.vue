<template>
  <AuthenticationForm
    :options="{
      buttonTitle: 'Register',
      forgetPassword: false,
      passwordRules: true,
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
      try {
        // sign up
        const res = await this.$axios.post('/api/auth/register', {
          email,
          password,
        })

        if (res.status === 200)
          this.$toast.success('Check your email to verify your account.')
      } catch (error) {
        // display express-validator messages
        if (error.response.data?.validation) {
          error.response.data.validation.forEach(({ msg, param }) => {
            this.$toast.show(`${msg} for ${param}.`)
          })
        } else {
          this.$toast.show(error.response.data.message)
        }
      }
    },
  },
}
</script>
