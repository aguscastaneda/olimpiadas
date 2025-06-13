import axios from './intance/instance'

class CommentService {
  
  static async getAllByProductId({ productId }) {
    const response = await axios.get('/api/comment', {
      productId,
    })
    return response.data
  }

  static async postComment({ clientId, productId, message  }) {
    const response = await axios.post('/api/comment', {
      clientId,
      productId,
      message
    })
    return response.data
  }

  static async postResponse({ commentId, message  }) {
    const response = await axios.post('/api/comment/response', {
      commentId,
      message
    })
    return response.data
  }

  static async putResponseView(responseId, { message, view }) {
    const response = await axios.put(`/api/comment/response`, {
      responseId,
      message,
      view
    })
    return response.data
  }

  static async putClientResponses({ clientId }) {
    const response = await axios.put(`/api/comment/response/client`, {
      clientId
    })
    return response.data
  }

  static async putCommentView({ commentId }) {
    const response = await axios.put(`/api/comment/${commentId}/comment`)
    return response.data
  }

  static async getCommentNotView() {
    const response = await axios.get('/api/comment/get/comment')
    return response.data
  }

  static async getResponseNotView({ clientId }) {
    const response = await axios.get(`/api/comment/${clientId}/response`)
    return response.data
  }
}

export default CommentService