const ClientModel = require('../../data/models/client.model')
const SalesManagerModel = require('../../data/models/sales-manager.model')
const { createAccesToken, verifyAccesToken } = require('../libs/jwt')
const { compare, hash } = require('../libs/bcrypt')
const { sendEmailVerification, sendEmailRegister, sendEmailPasswordReset } = require('../libs/resend')

const PROFILES = {
  CLIENT: 1,
  SALES_MANAGER: 2
}

class AuthController {

  static async login(req, res) {
    try {
      const { username, password } = req.body
      const clientFound = await ClientModel.findByUsername(username)
      if (!clientFound)
        return res.status(403).json({ message: 'Nombre de usuario o contraseña incorrectos' })
      const match = await compare(password, clientFound.password)
      if (!match)
        return res.status(403).json({ message: 'Nombre de usuario o contraseña incorrectos' })
      const token = await createAccesToken({
        id: clientFound.id,
        username: clientFound.username,
        profile: clientFound.profile,
      })
      res.cookie('token', token)
      return res.status(200).json({ id: clientFound.id, username: clientFound.username, profile: clientFound.profile })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async loginSalesManager(req, res) {
    try {
      const { username, password } = req.body
      const salesManagerFound = await SalesManagerModel.findByUsername(username)
      if (!salesManagerFound)
        return res.status(403).json({ message: 'Nombre de usuario o contraseña incorrectos' })
      const match = await compare(password, salesManagerFound.password)
      if (!match)
        return res.status(403).json({ message: 'Nombre de usuario o contraseña incorrectos' })
      const token = await createAccesToken({
        id: salesManagerFound.id,
        username: salesManagerFound.username,
        profile: salesManagerFound.profile,
      })
      res.cookie('token', token)
      return res.status(200).json({ id: salesManagerFound.id, username: salesManagerFound.username, profile: salesManagerFound.profile })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async googleLogin(req, res) {
    try {
      const { username, email } = req.body
      const clientFound = await ClientModel.findByUsernameOrEmail(username, email)
      let client
      if (clientFound) {
        client = clientFound
      } else {
        client = await ClientModel.create(username, email, '')
      }
      const token = await createAccesToken({
        id: client.id,
        username: client.username,
        profile: client.profile,
      })
      res.cookie('token', token)
      return res.status(200).json({ id: client.id, username: client.username, profile: client.profile })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async createVerifyToken(req, res) {
    try {
      const verifyCode = Math.floor(Math.random() * 9000) + 1000
      const tokenVerifyCode = await createAccesToken({
        verifyCode
      })
      res.cookie('tokenVerifyCode', tokenVerifyCode)
      return res.status(200).json({ message: 'El codigo de verificacion fue establecido' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async validateVerifyToken(req, res) {
    try {
      const { code } = req.body
      const { tokenVerifyCode } = req.cookies
      const { verifyCode } = await verifyAccesToken(tokenVerifyCode)
      if (parseInt(code) !== verifyCode)
        return res.status(403).json({ message: 'El codigo ingresado no es valido' })
      res.cookie('tokenVerifyCode', '', {
        expires: new Date(0)
      })
      return res.status(200).json({ message: 'El codigo de verificacion fue enviado' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async sendEmailVerification(req, res) {
    try {
      const { email } = req.body
      const { tokenVerifyCode } = req.cookies
      const { verifyCode } = await verifyAccesToken(tokenVerifyCode)
      console.log(email)
      await sendEmailVerification(email, verifyCode)
      console.log('email enviado')
      // console.log(data, error)
      // if (error)
        // return res.status(500).json({ message: 'Error' })
      console.log('Email sent')
      return res.status(200).json({ message: 'Email enviado' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async sendEmailRegister(req, res) {
    try {
      const { email } = req.body
      await sendEmailRegister(email)
      console.log('Email sent')
      return res.status(200).json({ message: 'Email enviado' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async validateRegister(req, res) {
    try {
      const { username, email } = req.body
      const clientFound = await ClientModel.findByUsernameOrEmail(username, email)
      if (clientFound)
        return res.status(403).json({ message: 'Nombre de usuario o correo electronico en uso' })
      return res.status(200).json({ message: 'OK' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async register(req, res) {
    try {
      const { username, email, password } = req.body
      const encrypt = await hash(password)
      const newClient = await ClientModel.create(username, email, encrypt)
      const token = await createAccesToken({
        id: newClient.id,
        username: newClient.username,
        profile: newClient.profile,
      })
      res.cookie('token', token)
      return res.status(200).json({ id: newClient.id, username: newClient.username, profile: newClient.profile })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async registerSalesManager(req, res) {
    try {
      const { username, password } = req.body
      const selesManagerFound = await SalesManagerModel.findByUsername(username)
      if (selesManagerFound)
        return res.status(403).json({ message: 'Nombre de usuario ya esta en uso' })
      const encrypt = await hash(password)
      const newSalesManager = await SalesManagerModel.create(username, encrypt)
      const token = await createAccesToken({
        id: newSalesManager.id,
        username: newSalesManager.username,
        profile: newSalesManager.profile,
      })
      res.cookie('token', token)
      return res.status(200).json({ id: newSalesManager.id, username: newSalesManager.username, profile: newSalesManager.profile })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async logout(req, res) {
    res.cookie('token', '', {
      expires: new Date(0)
    })
    return res.sendStatus(200)
  }

  static async verify(req, res) {
    const { token } = req.cookies
    if (!token)
      return res.status(401).json({ message: 'No token' })
    const { id, username, profile } = await verifyAccesToken(token)
    if (profile.id === PROFILES.CLIENT) {
      const client = await ClientModel.findById(id)
      if (!client)
        return res.status(400).json({ message: 'Token no valido' })
      return res.json({ id, username, profile })
    }
    const salesManager = await SalesManagerModel.findById(id)
    if (!salesManager)
      return res.status(400).json({ message: 'Token no valido' })
    return res.json({ id, username, profile })
  }
}

module.exports = AuthController