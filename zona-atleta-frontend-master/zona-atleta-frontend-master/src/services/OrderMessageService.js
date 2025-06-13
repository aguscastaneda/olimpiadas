import axios from './intance/instance'

class OrderMessageService {

  static async post({ orderId, message, vendedor }) {
    const response = await axios.post(`/api/order-message/${orderId}`, {
      message,
      vendedor
    })
    return response.data
  }

  static async put({ orderId, vendedor }) {
    const response = await axios.put(`/api/order-message/${orderId}`, {
      tipo: vendedor
    })
    return response.data
  }

  static async getNotifys() {
    const response = await axios.get(`/api/order-message`)
    return response.data
  }

  static async getNotifysClient(clientId) {
    const response = await axios.get(`/api/order-message/${clientId}/order-message`)
    return response.data
  }
}

export default OrderMessageService