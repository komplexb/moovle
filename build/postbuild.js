const shell = require('shelljs')
const redirects = require('../utils/redirects.js')

if (process.env.NETLIFY) {
  redirects.forEach(page => {
    shell.exec(`echo "${page.from} ${page.to}" >> static/_redirects`)
  })
}
