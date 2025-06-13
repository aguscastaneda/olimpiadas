const jwt = require('jsonwebtoken')

const SECRET = process.env.TOKEN_SECRET

function createAccesToken(payload) {
  return new Promise((res, rej) => {
    jwt.sign(
      payload,
      SECRET,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) rej(err)
        res(token)
      }
    )
  })
}

function verifyAccesToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, user) => {
      if (err)
        reject(err)
      resolve(user)
    })
  })
}

module.exports = { createAccesToken, verifyAccesToken }