<template>
  <div :class="`page-${$route.name}`">
    <nuxt-link v-if="isCharacterPage" to="/">Back</nuxt-link>
    <Logo v-else />
    <Nuxt keep-alive />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    isCharacterPage(): Boolean {
      return this.$route.name === 'character-id'
    },
  },
})
</script>

<style scoped></style>
