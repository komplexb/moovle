import md5 from 'md5'

function generateHash(timestamp: Date) {
  return md5(`${timestamp}${process.env.MARVEL_PRK}${process.env.MARVEL_PUK}`)
}

export { generateHash }
