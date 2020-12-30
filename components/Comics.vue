<template>
  <ul v-if="comics.length > 0" class="comics">
    <li v-for="comic in comics" :key="comic.id">
      <Card :item="comic" />
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Comics',
  props: {
    id: {
      type: String,
      required: true,
      default: '',
    },
  },
  async fetch() {
    const timestamp = Date.now()
    // @ts-ignore
    const hash = this.generateHash(timestamp)
    const auth = `?apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`
    const params = `&orderBy=-onsaleDate&limit=5` // show last 5 comics in descending order

    const response = await fetch(
      `${this.$config.baseURL}/characters/${this.id}/comics${auth}${params}`
    ).then((response) => response.json())

    this.comics = response.data.results
  },
  data() {
    return {
      comics: [],
    }
  },
})
</script>

<style scoped></style>
