class Validator {

  static validateUsername(username) {
    return username.length >= 4
  }

  static validateEmail(email) {
    return email.length > 6 && email.includes('@') && email.includes('.')
  }

  static validatePasswordForLogin(password) {
    return password.length >= 5
  }

  static validatePasswordForRegister(password) {
    let counterNumbers = 0
    for (const char of password) {
      if (!isNaN(char)) {
        counterNumbers++
      }
    }
    return password.length >= 5 && counterNumbers > 0
  }

  static validateLogin(username, password) {
    return this.validateUsername(username) && this.validatePasswordForLogin(password)
  }

  static validateRegister(username, email, password, passwordRepeat) {
    return this.validateUsername(username) && this.validateEmail(email) && this.validatePasswordForRegister(password) && password === passwordRepeat
  }

  static validateRegisterSalesManager(username, password, passwordRepeat) {
    return this.validateUsername(username) && this.validatePasswordForRegister(password) && password === passwordRepeat
  }
}

export default Validator