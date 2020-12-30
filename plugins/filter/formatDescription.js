import Vue from 'vue'
import sanitizeHtml from 'sanitize-html'

Vue.filter('formatDescription', function (value, truncate = false) {
  if (!value) return ''

  // some descriptions contain HTML
  // Try "Captain America" Sam Wilson
  value = sanitizeHtml(value.toString(), {
    allowedTags: []
  })

  // short descriptions on home page
  return truncate ? `${value.slice(0, 100)}...` : value
})
