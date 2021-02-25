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
      const resendVerification = await this.$axios.post(
        '/api/auth/confirmation/resend',
        { email }
      )

      this.$toast.show(resendVerification.data)
    },
  },
}
</script>

<style lang="scss" scoped></style>
