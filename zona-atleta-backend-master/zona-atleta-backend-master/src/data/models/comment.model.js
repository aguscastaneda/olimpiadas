const database = require('../database/database')
const Comment = require('../interfaces/comments')
class CommentResponseModel {

  static async createComment({ clientId, productId, message }) {
    const comment = await database.comment.create({
      data: {
        clientId,
        productId,
        message
      }
    })
    return comment
  }

  static async createResponse({ commentId, message }) {
    const response = await database.response.create({
      data: {
        commentId,
        message
      }
    })
    return response
  }

  static async updateResponse(responseId, { message, view }) {
    const response = await database.response.update({
      where: {
        id: responseId
      },
      data: {
        message,
        view
      }
    })
    return response
  }

  static async updateViewResponse({ clientId }) {
    const response = await database.response.updateMany({
      where: {
        comment: {
          clientId
        }
      },
      data: {
        view: true
      }
    })
    return response
  }


  //PUTVIEWRESPONSE()
  //Recibe el id de la respuesta 
  //Devuelve la respuesta marcada como vista ✔✔ por el cliente
  static async putViewResponse(clientId) {
    const response = await database.response.updateMany({
      where: {
        comment: {
          clientId
        }
      },
      data: {
        view: true
      }
    })
    return response
  }

  //GETNOTVIEWCOMMENT()
  //Devuelve todos los comentarios de los clientes que no fueron vistos por los vendedores
  static async getNotViewComment() {
    const comment = await database.comment.findMany({
      where: {
        view: false
      }
    })
    return comment
  }

  //GETNOTVIEWRESPONSE()
  //Recibe id que es igual al id del cliente
  //Devuelve todas las respuestas de los comentarios del cliente que no fueron vistas por el mismo
  static async getNotViewResponse(clientId) {
    const response = await database.response.findMany({
      where: {
        comment: {
          clientId
        },
        view: false
      }
    })
    return response
  }

  //PUTVIEWCOMMENT()
  //Recibe el id del comentario
  //Devuelve el comentario marcado como visto por el vendedor 
  static async putViewComment(id) {
    const comment = await database.comment.update({
      where: {
        id
      },
      data: {
        view: true
      }
    })
    return comment
  }
  static async findMany({ productId }) {
    const comments = await database.comment.findMany({
      where: {
        productId
      }
    })
    return comments
  }
}

module.exports = CommentResponseModel