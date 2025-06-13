class OrderMessage {
  constructor(orderMessage) {
      this.idOrder = orderMessage.idOrder
      this.message = orderMessage.message
      this.vendedor = orderMessage.vendedor//Si es false el mensaje lo envia el comprador, si es true lo envia el vendedor
      this.view = orderMessage.view
  }
}
  
module.exports = OrderMessage