const OrderModel = require('../../data/models/order.model')
const ClientModel = require('../../data/models/client.model')
const SocketManager = require('../../data/clients/socket.manager')
const { createPDF } = require('../libs/pdfkit')

class OrderController {

  static async getAll(req, res) {
    try {
      const orders = await OrderModel.findMany()
      return res.json(orders)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const order = await OrderModel.findById(id)
      return res.json(order)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async putById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { state, address } = req.body
      const order = await OrderModel.update(id, state, address)
      // const comment = await ClientModel.createNotification(order.clientId, `Su pedido esta en camino`)
      // const socket = SocketManager.findClientById(order.clientId).socket
      // if (socket && state === 'confirmado') {
      //   socket.emit('notification', { message: comment.message, date: comment.date })
      // }
      return res.json(order)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async getCheck(req, res) {
    try {
      const id = parseInt(req.params.id)
      const order = await OrderModel.findById(id)

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=invoice.pdf"
      })

      createPDF((data) => {
        stream.write(data)
      }, () => {
        stream.end()
      }, order)

      return res.json({ message: 'Send' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }
}

module.exports = OrderController