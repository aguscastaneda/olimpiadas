const database = require('../database/database')
const OrderMessage = require('../interfaces/order.message')
class OrderMessageModel {

  //Devuelve del id de la orden todos los mensajes
  static async findById(id) {
    const orderMessages = await database.orderMessage.findMany({
      where: {
        orderId: id
      }
    })
    return orderMessages.map(o => new OrderMessage(o))
  }

  //Recibe el id de la orden, un mensaje, y vendedor(true si manda el msj el vendedor||false si manda el msj el comprador)
  // crea un nuevo mensaje
  static async create(orderId, { message, vendedor }) {
    const orderMessages = await database.orderMessage.create({
      data: {
        orderId,        
        message,
        vendedor //Si es false el mensaje lo envia el comprador, si es true lo envia el vendedor
      }
    })
    return orderMessages
  }

  //Aca mediante las ordenes que tengan el id del cliente 
  //Podemos obtener
  //mensajes enviados por los vendedores no vistos por el cliente sobre las ordenes del mismo
  static async cantNotifysClient(clientId) {
    const orderMessages = await database.orderMessage.findMany({
      where: {
        order: {
          clientId
        },
        vendedor: true,
        view: false
      }
    })
    return orderMessages
  }

  //Aca al consultar recibimos todos los mensajes de las ordenes que no fueron vistos por los vendedores
  static async cantNotifysSold() {
    const orderMessages = await database.orderMessage.findMany({
      where: {
        vendedor: false,
        view: false
      }
    })
    return orderMessages
  }

  //Aca mediante el id de la orden y mediante un "tipo" el cual es verdadero o falso
  //Podemos marcar como visto los mensajes 
  //tipo: debe ser true si los mensajes están siendo vistos por el comprador
  //tipo: debe ser false si los mensajes están siendo vistos por el vendedor
  static async putViewOrderMessage(orderId, { vendedor }) {
    const orderMessages = await database.orderMessage.updateMany({
      where: {
        orderId,
        vendedor
      },
      data: {
        view: true
      }
    })
    return orderMessages
  }
}
module.exports = OrderMessageModel