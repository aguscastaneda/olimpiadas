const database = require('../database/database')
const Order = require('../interfaces/order')

class OrderModel {

  static async findMany() {
    const orders = await database.order.findMany()
    return orders
  }

  static async findById(id) {
    const order = await database.order.findFirst({
      where: {
        id
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        },
        client: true,
        orderMessages: true
      }
    })
    return {
      ...order,
      products: order.products.map(p => ({ ...p.product, amount: p.amount }))
    }
  }

  static async update(id, state, address) {
    const order = await database.order.update({
      where: {
        id
      },
      data: {
        state,
        address
      },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    })
    return new Order(order)
  }


  static async updateIDPayment(id, paymentId) {
    const order = await database.order.update({
      where: {
        id
      },
      data: {
        paymentId
      }
    })
    return order
  }
}


module.exports = OrderModel