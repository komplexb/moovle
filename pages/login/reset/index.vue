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
  middleware: ['auth'],
  data: () => ({}),
  methods: {
    async sendPasswordToken({ email }) {
      try {
        const response = await this.$axios.post('/api/auth/password/reset', {
          email,
        })
        this.$toast.success(response.data.message)
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
