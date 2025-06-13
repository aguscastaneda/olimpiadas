const BACKEND_URL = process.env.BACKEND_URL

class Product {

  constructor(product) {
    this.id = product.id
    this.name = product.name
    this.price = product.price
    this.image = `${BACKEND_URL}${product.image}`
    this.details = `${BACKEND_URL}/api/product/${product.id}`
  }
}

module.exports = Product