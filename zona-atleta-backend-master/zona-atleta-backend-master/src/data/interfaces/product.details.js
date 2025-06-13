const BACKEND_URL = process.env.BACKEND_URL

class ProductDetails {

  constructor(product) {
    this.id = product.id
    this.name = product.name
    this.price = product.price
    this.image = `${BACKEND_URL}${product.image}`
    this.description = product.description
    this.comments = product.comments
    this.likes = product.likes.length
    this.available = product.available
    this.visits = product.visits
    this.favorites = product.favorites.length
    this.stock = product.stock
    this.timesBought = product.timesBought
    this.gender = product.gender
    this.discount = product.discount ? product.discount.percentage : null
  }
}

module.exports = ProductDetails