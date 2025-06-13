const OrderMessageModel = require('../../data/models/order.message.model')
class OrderMessageController {
  //GETALL()
  //Usar cuando queremos obtener todos los mensajes de una orden
  //Mandarle por parametros el id de la orden
  static async getAll(req, res) {
    try {
      const id = parseInt(req.params.id)
      const orderMessages = await OrderMessageModel.findById(id)
      return res.json(orderMessages)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //GETNOTVIEWCLIENTS()
  //Usar cuando queremos obtener todos los mensajes que no vio el cliente de las ordenes 
  //Pasarle por parametros el id del cliente
  static async getNotViewClients(req, res) {
    try {
      const id = parseInt(req.params.id)
      const orderMessages = await OrderMessageModel.cantNotifysClient(id)
      return res.json(orderMessages)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //GETNOTVIEWSALES()
  //Usar cuando queremos obtener todos los mensajes de las ordenes que no fueron vistos por ventas 
  static async getNotViewSales(req, res) {
    try {
      const orderMessages = await OrderMessageModel.cantNotifysSold()
      return res.json(orderMessages)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //POST()
  //Usar cuando el vendedor o el comprador envian un nuevo mensaje en la orden
  //Pasarle por parametros el id de la orden
  //Pasarle por body message, vendedor
  //message teniendo el contenido del mensaje a enviar
  //vendedor teniendo true or false dependiendo quien envia el mensaje
  static async post(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { message, vendedor } = req.body
      const orderMessages = await OrderMessageModel.create(id, { message, vendedor })
      return res.json(orderMessages)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //PUTVIEW()
  //Usarlo cuando queremos marcar mensajes como visto por el vendedor o comprador 

  //Si al req.body.tipo le damos valor false quiere decir que los mensajes están siendo vistos por equipo de ventas
  //Esto permite que los mensajes de la orden id mandados por el comprador dejen de sumarse como notificaciones para los vendedores al marcarlas con visto ✔✔

  //Si al req.body.tipo le damos valor true quiere decir que los mensajes están siendo vistos por el cliente
  //Esto permite que los mensajes de la orden id mandados por el equipo de ventas se dejen de sumar como notificaciones para el cliente al marcarlas con visto ✔✔

  //Pasarle por parametro el id de la orden
  static async putView(req, res) {
    try {
      const id = parseInt(req.params.id)
      const tipo = req.body.tipo //si req.body.tipo es false el mensaje es de tipo comprador, si es true tipo vendedor
      const orderMessages = await OrderMessageModel.putViewOrderMessage(id, { vendedor: tipo })
      return res.json(orderMessages)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

}
module.exports = OrderMessageController