<template>
  <div class="mt-12">
    <div v-if="confirmationStatus === 'verified'" cols="12">
      <nuxt-link to="/login" class="button"> Go to login page </nuxt-link>
    </div>
    <div v-else-if="confirmationStatus === 'unverified'" cols="12">
      <nuxt-link to="/register/confirmation/resend" class="button">
        Resend a verification token
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  name: 'Confirmation',
  data: () => ({
    resend: false,
    confirmationStatus: false,
    snackbarMessage: '',
  }),
  mounted() {
    if (this.$route.query?.token) {
      // invoke as page loads
      this.checkToken()
    } else {
      this.$router.push('/register/confirmation/resend')
    }
  },
  methods: {
    // confirm the account by verify the token sent via email at the following routes
    // => /auth/confirmation/resend
    // => /auth/register
    async checkToken() {
      let verification
      try {
        verification = await this.$axios.post('/api/auth/confirmation/', {
          token: this.$route.query.token,
        })
        if (verification.data.confirmationStatus === 'verified') {
          await this.$router.push('/login')
          this.$toast.success(verification.data.message)
        } else if (verification.data.confirmationStatus === 'unverified') {
          await this.$router.push('/register/confirmation/resend')
          this.$toast.error(
            'Confirmation email has expired, please try again.',
            {
              duration: 10000,
            }
          )
        }
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

<style lang="scss" scoped></style>
