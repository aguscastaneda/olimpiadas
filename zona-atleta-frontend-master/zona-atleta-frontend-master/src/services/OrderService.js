import axios from './intance/instance'

class OrderService {

  static async getOrdersRequest() {
    const response = await axios.get('/api/order')
    return response.data
  }

  static async getByIdRequest(id) {
    const response = await axios.get(`/api/order/${id}`)
    return response.data
  }

  static async postOrderRequest({ products }) {
    const response = await axios.post('/api/order', {
      products
    })
    return response.data
  }

  static async putRequest(id, { state, address }) {
    const response = await axios.put(`/api/order/${id}`, {
      address,
      state
    })
    return response.data
  }

  static async getCheck(id) {
    const response = await axios.get(`/api/order/${id}/check`)
    return response.data
  }
}

export default OrderService