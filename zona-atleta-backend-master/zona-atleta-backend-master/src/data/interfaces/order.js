const Product = require('./product')

const BACKEND_URL = process.env.BACKEND_URL

class Order {

  constructor(order) {
    this.id = order.id
    this.date = order.date
    this.state = order.state
    this.address = order.address
    this.paymentId = order.paymentId
    this.paymentMethod = order.paymentMethod
    this.products = order.products.map(p => ({ ...(new Product(p.product)), amount: p.amount }))
    this.orderMessages = order.orderMessages
  }
}

module.exports = Order