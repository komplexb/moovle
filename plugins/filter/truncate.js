import Vue from 'vue'

Vue.filter('truncate', function (value, length = 90) {
  if (!value) return ''

  return value.length > length ? `${value.slice(0, length)}...` : value
})
