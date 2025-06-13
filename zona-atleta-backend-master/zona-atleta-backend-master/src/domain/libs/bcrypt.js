const bcrypt = require('bcryptjs')

async function compare(s, hash) {
  return await bcrypt.compare(s, hash)
}

async function hash(s) {
  return await bcrypt.hash(s,10)
}

module.exports = {
  compare,
  hash
}