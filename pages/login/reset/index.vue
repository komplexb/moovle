<template>
  <div class="mt-12">
    <EmailForm
      button-title="Reset Password"
      @authorize="sendPasswordToken($event)"
    >
    </EmailForm>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data: () => ({}),
  methods: {
    async sendPasswordToken({ email }) {
      try {
        const response = await this.$axios.post('/api/auth/password/reset', {
          email,
        })
        this.$toast.success(response.data.message)
      } catch (err) {
        this.$toast.error(err.response.data.message)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
