<template>
  <div>
    <ul>
      <li v-for="character in results" :key="character.id">
        <!--
        <img
          :src="`${character.thumbnail.path}.${character.thumbnail.extension}`"
          alt="character.name"
        />
        -->
        <nuxt-link
          :to="{
            path: `/character/${character.id}`,
            params: { id: character.id },
            props: { character },
          }"
        >
          <strong>{{ character.name }}</strong>
        </nuxt-link>
        <p v-if="character.description">
          {{ character.description | formatDescription(true) }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import md5 from 'md5'

export default Vue.extend({
  name: 'SearchList',
  props: {
    find: {
      type: String,
      default: '',
      required: true,
    },
    queryType: {
      type: Boolean,
      default: false,
    },
  },
  async fetch() {
    const timestamp = Date.now()
    const hash = this.generateHash(timestamp)
    const params = `${this.queryType ? 'name' : 'nameStartsWith'}=${
      this.find
    }&apikey=${this.$config.marvelPuk}&ts=${timestamp}&hash=${hash}`

    const response = await fetch(
      `${this.$config.baseURL}/characters?${params}`
    ).then((response) => response.json())

    this.results = response.data.results
  },
  data() {
    return {
      results: [],
    }
  },
  watch: {
    find(): void {
      setTimeout(() => {
        this.$fetch()
      }, 200)
    },
    queryType(val): void {
      if (val) {
        setTimeout(() => {
          this.$fetch()
        }, 200)
      }
    },
  },
  methods: {
    // Todo: a mixin would be nice, but we only do this twice
    generateHash(timestamp: Number): String {
      return md5(
        `${timestamp}${this.$config.marvelPrk}${this.$config.marvelPuk}`
      )
    },
  },
})
</script>
