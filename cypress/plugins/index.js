const path = require('path')
const cypressNuxt = require('cypress-nuxt')

module.exports = async (on, config) => {
  on('file:preprocessor', await filePreprocessor())

  return config
}

function filePreprocessor () {
  require('ts-node').register({
    compilerOptions: {
      // force to compile to what node.js expects
      target: 'ES2018',
      module: 'ESNext' // node expects commonjs format
    }
  })

  return cypressNuxt.plugin({
    loadOptions: {
      rootDir: path.join(__dirname, '../..')
    }
  })
}
