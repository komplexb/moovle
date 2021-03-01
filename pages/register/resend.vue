<template>
  <div class="mt-12">
    <EmailForm
      button-title="Resend Confirmation Email"
      @authorize="resendToken($event)"
    >
    </EmailForm>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data: () => ({}),
  methods: {
    async resendToken({ email }) {
      try {
        const resendVerification = await this.$axios.post(
          '/api/auth/confirmation/resend',
          { email }
        )

        this.$toast.show(resendVerification.data)
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

<style lang="scss" scoped></style>
