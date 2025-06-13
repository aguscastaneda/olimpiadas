const jwt = require('jsonwebtoken')

const SECRET = process.env.TOKEN_SECRET

class ValidatorToken {

  static validateToken(req, res, next) {
    const { token } = req.cookies
    
    if (!token) return res.status(401).json({ message: 'No token, no acceso pa' })

    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'El token no es valido sinwenwencha' })
      req.user = user
      next()
    })
  }
}


module.exports = ValidatorToken