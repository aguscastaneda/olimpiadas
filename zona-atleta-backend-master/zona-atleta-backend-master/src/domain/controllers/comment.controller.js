const CommentModel = require('../../data/models/comment.model')
const SocketManager = require('../../data/clients/socket.manager')
const SalesManagerModel = require('../../data/models/sales-manager.model')

class CommentController {

  static async getAllByProductId(req, res) {
    try {
      const { productId } = req.body
      const comment = await CommentModel.findMany({ productId })
      console.log(comment)
      return res.json(comment)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async postComment(req, res) {
    try {
      const { clientId, productId, message } = req.body
      const salesManager = (await SalesManagerModel.findMany())[0]
      const comment = await CommentModel.createComment({ clientId, productId, message })
      // console.log(SocketManager.findSalesManagerById(salesManager.id))
      SocketManager.salesManagers[1][0].emit('notification', comment)
      return res.json(comment)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //PUTVIEWCOMMENT()
  //pone visto ✔✔ al comentario del cliente 
  //Pasarle el id del comentario
  static async viewComment(req, res) {
    try {
      const id = parseInt(req.params.id)
      const comment = await CommentModel.putViewComment(id)
      return res.json(comment)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async postResponse(req, res) {
    try {
      const { commentId, message } = req.body
      const response = await CommentModel.createResponse({ commentId, message })
      return res.json(response)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async putResponse(req, res) {
    try {
      const { responseId, message, view } = req.body
      const product = await CommentModel.updateResponse(responseId, { message, view })
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async putViewResponses(req, res) {
    try {
      const { clientId } = req.body
      const product = await CommentModel.updateViewResponse({ clientId })
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //GETNOTVIEWRESPONSE()
  //Devuelve todas las repuestas no vistas de los vendedores hacia el cliente
  //Pasarle id del cliente
  static async notViewResponse(req, res) {
    try {
      const id = parseInt(req.params.id)
      const response = await CommentModel.getNotViewResponse(id)
      return res.json(response)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  //GETNOTVIEWCOMMENT()
  //Devuelve todos los comentarios no vistos de los clientes hacia los vendedores
  static async notViewComment(req, res) {
    try {
      const comment = await CommentModel.getNotViewComment()
      return res.json(comment)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }
}

module.exports = CommentController