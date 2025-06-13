
class SocketManager {

  constructor() {
    this.clients = {} // objetos donde el id del cliente es la clave y el valor una lista con sus conexiones sockets
    this.salesManagers = {} // ''
  }

  addClient(client, socket) {
    if (!this.clients[client.id]) {
      this.clients[client.id] = [socket]
    } else {
      this.clients[client.id] = [...this.clients[client.id], socket]
    }
  }

  addSalesManager(salesManager, socket) {
    if (!this.salesManagers[salesManager.id]) {
      this.salesManagers[salesManager.id] = [socket]
    } else {
      this.salesManagers[salesManager.id] = [...this.salesManagers[salesManager.id], socket]
    }
  }

  findClientById(id) {
    const client = this.clients[id]
    return client
  }

  findSalesManagerById(id) {
    const salesManager = this.salesManagers[id]
    return salesManager
  }
}

module.exports = new SocketManager()