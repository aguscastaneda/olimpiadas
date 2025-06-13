const database = require('../database/database')
const ProductInterface = require('../interfaces/product')
const ProductDetailsInterface = require('../interfaces/product.details')
const DiscountedProduct = require('../interfaces/discounted.product')
const LastProduct = require('../interfaces/last.product')

const includeProductDetails = {
  category: true,
  comments: {
    include: {
      response: true
    }
  },
  likes: true,
  favorites: true,
  discount: true
}

const includeDiscountedProduct = {
  product: true
}

const includeLastProduct = {
  product: true
}

class ProductModel {

  static async pauseById(id) {
    return await database.product.update({
      where: {
        id
      },
      data: {
        available: false
      }
    })
  }

  static async count() {
    return await database.product.count()
  }

  static async findMany(offset, limit, { name, category, gender, available }) {
    const products = await database.product.findMany({
      skip: offset,
      take: limit,
      where: {
        name: {
          contains: name
        },
        category: {
          name: category
        },
        gender,
        available
      }
    })
    return products.map(p => new ProductInterface(p))
  }

  static async findManyDiscount({ offset, limit }) {
    const discounts = await database.discount.findMany({
      skip: offset,
      take: limit,
      where: {
        product: {
          available: true
        }
      },
      include: includeDiscountedProduct
    })
    return discounts.map(d => new DiscountedProduct(d))
  }

  static async findManyPopular({ offset, limit }) {
    const products = await database.product.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        visits: 'desc'
      },
      where: {
        available: true
      }
    })
    return products.map(p => new ProductInterface(p))
  }

  static async findManyLast({ offset, limit }) {
    const last = await database.last.findMany({
      skip: offset,
      take: limit,
      where: {
        product: {
          available: true
        }
      },
      include: includeLastProduct
    })
    return last.map(l => new LastProduct(l))
  }

  static async findById(id) {
    const p = await database.product.findFirst({
      where: {
        id
      },
      include: {
        category: true,
        comments: {
          include: {
            response: true
          }
        },
        discount: true,
        favorites: true,
        likes: true
      }
    })
    if (!p)
      return p
    return new ProductDetailsInterface(p)
  }

  static async create({ name, categoryId, price, stock, description, image, percentage, gender }) {
    let discount
    if (percentage) {
      discount = {
        create: {
          percentage
        }
      }
    }
    const product = await database.product.create({
      data: {
        name,
        categoryId,
        price,
        stock,
        description,
        image,
        last: {
          create: {}
        },
        discount,
        gender
      }
    })
    return product
    // return new ProductInterface(product)
  }

  static async update(id, { name, price, stock, available, timesBought, visits, image }) {
    const product = await database.product.update({
      where: {
        id
      },
      data: {
        name,
        price,
        stock,
        available,
        timesBought,
        visits,
        image
      }
    })
    return product
    // return new ProductDetailsInterface(product)
  }
}

module.exports = ProductModel