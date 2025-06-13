const BACKEND_URL = process.env.BACKEND_URL

class DiscountedProduct {

  constructor(discount) {
    this.id = discount.product.id
    this.name = discount.product.name
    this.price = discount.product.price
    this.image = `${BACKEND_URL}${discount.product.image}`
    this.percentage = discount.percentage
  }
}

module.exports = DiscountedProduct