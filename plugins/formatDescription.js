import Vue from 'vue'
import sanitizeHtml from 'sanitize-html'

Vue.filter('formatDescription', function (value, truncate = false) {
  if (!value) return ''
  value = sanitizeHtml(value.toString(), {
    allowedTags: []
  })

  return truncate ? `${value.slice(0, 100)}...` : value
})
