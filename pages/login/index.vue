<template>
  <AuthenticationForm
    :options="{
      buttonTitle: 'Sign In',
      forgetPassword: true,
      passwordRules: false,
    }"
    @authorize="login($event)"
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
    async login({ email, password }) {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email,
            password,
          },
        })
        this.$toast.success('Logged In', {
          onComplete: this.$router.push(this.$route.query?.previousPath || '/'),
        })
      } catch (error) {
        // display express-validator messages
        if (error.response.data?.validation) {
          error.response.data.validation.forEach(({ msg, param }) => {
            this.$toast.show(`${msg} for ${param}.`)
          })
        } else {
          this.$toast.show(error.response.data.message, { duration: 5000 })
        }
      }
    },
  },
}
</script>
