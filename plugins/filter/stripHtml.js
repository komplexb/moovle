import Vue from 'vue'
import sanitizeHtml from 'sanitize-html'

Vue.filter('stripHtml', function (value) {
  if (!value) return ''

  // some descriptions contain HTML
  // Try "Captain America" Sam Wilson
  return sanitizeHtml(value.toString(), {
    allowedTags: []
  })
})
