import axios from './intance/instance'

class ClientService {

  static async getAllRequest() {
    const response = await axios.get('/api/client/')
    return response.data
  }

  static async getByIdRequest(id) {
    const response = await axios.get(`/api/client/${id}`)
    return response.data
  }

  static async deleteByIdRequest(id) {
    const response = await axios.delete(`/api/client/${id}`)
    return response.data
  }

  static async confirmPassword(id, password) {
    const response = await axios.post(`/api/client/${id}/confirm`, {
      password
    })
    return response.data
  }

  static async putByIdRequest(id, { username, email, password, newPassword }) {
    const response = await axios.put(`/api/client/${id}`, {
      username,
      email,
      password,
      newPassword
    })
    return response.data
  }

  static async getProducts(id) {
    const response = await axios.get(`/api/client/${id}/products`)
    return response.data
  }

  static async postProduct(id, productId, { amount }) {
    const response = await axios.post(`/api/client/${id}/products/${productId}`, {
      amount
    })
    return response.data
  }

  static async deleteProduct(id, productId) {
    const response = await axios.delete(`/api/client/${id}/products/${productId}`)
    return response.data
  }

  static async putProduct(id, productId, { amount }) {
    const response = await axios.put(`/api/client/${id}/products/${productId}`, {
      amount
    })
    return response.data
  }

  static async getOrders(id) {
    const response = await axios.get(`/api/client/${id}/orders`)
    return response.data
  }

  static async postOrderByOneProduct(id, productId, { paymentMethod, address, amount }) {
    const response = await axios.post(`/api/client/${id}/orders`, {
      paymentMethod,
      address,
      productId,
      amount
    })
    return response.data
  }

  static async postOrderByManyProduct(id, { paymentMethod, address }) {
    const response = await axios.post(`/api/client/${id}/orders-many`, {
      paymentMethod,
      address
    })
    return response.data
  }

  static async postLike(id, productId) {
    const response = await axios.post(`/api/client/${id}/like/${productId}`)
    return response.data
  }

  static async deleteLike(id, productId) {
    const response = await axios.delete(`/api/client/${id}/like/${productId}`)
    return response.data
  }

  static async getFavorites(id) {
    const response = await axios.get(`/api/client/${id}/favorite`)
    return response.data
  }

  static async postFavorite(id, productId) {
    const response = await axios.post(`/api/client/${id}/favorite/${productId}`)
    return response.data
  }

  static async deleteFavorite(id, productId) {
    const response = await axios.delete(`/api/client/${id}/favorite/${productId}`)
    return response.data
  }

  static async getNotifications(id) {
    const response = await axios.get(`/api/client/${id}/notifications`)
    return response.data
  }

  static async sendEmailsDiscountRequest() {
    const response = await axios.post(`/api/client/send-email/discount`)
    return response.data
  }
}

export default ClientService