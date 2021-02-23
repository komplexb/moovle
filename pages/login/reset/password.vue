<template>
  <div class="mt-12">
    <ChangePasswordForm
      button-title="Change password"
      @authorize="changePassword($event)"
    >
    </ChangePasswordForm>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  name: 'Confirmation',
  data: () => ({}),
  mounted() {
    this.token = this.$route.query.token
  },
  methods: {
    async changePassword({ password }) {
      try {
        const verification = await this.$axios.post(
          '/api/auth/password/change',
          {
            token: this.token,
            password,
          }
        )
        this.$toast.success(verification.data.message, {
          onComplete: this.$router.push('/login'),
        })
      } catch (err) {
        this.$toast.error(err.response.data.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
