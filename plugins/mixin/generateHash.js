import Vue from 'vue'
import md5 from 'md5'

Vue.mixin({
  methods: {
    generateHash (timestamp) {
      return md5(
        `${timestamp}${this.$config.marvelPrk}${this.$config.marvelPuk}`
      )
    }
  }
})
