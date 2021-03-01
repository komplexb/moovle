<template>
  <div class="mt-12">
    <ChangePasswordForm
      button-title="Change password"
      @authorize="changePassword($event)"
    />
  </div>
</template>

<script>
export default {
  layout: 'auth',
  middleware: ['auth'],
  name: 'Confirmation',
  data: () => ({}),
  methods: {
    async changePassword({ password }) {
      try {
        const verification = await this.$axios.post(
          '/api/auth/password/change',
          {
            token: this.$route.query.token,
            password,
          }
        )
        this.$toast.success(verification.data.message, {
          onComplete: this.$router.push('/login'),
        })
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
