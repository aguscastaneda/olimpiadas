const { Router } = require('express')

const OrderMessageController = require('../../domain/controllers/order.message.controller')
const router = Router()

router.get('/:id', OrderMessageController.getAll)//Pasarle el id de la orden por parametro, devuelve todos los mensajes de la orden
router.post('/:id', OrderMessageController.post)//pasarle el id de la orden por parametro, en el body el mensaje y vendedor: darle_valor (true si el mensaje lo manda el vendedor, false si lo manda el comprador) 
router.get('/:id/order-message', OrderMessageController.getNotViewClients)//Pasarle el id del cliente por parametro, devuelve todos los mensajes de las ordenes que no vio el cliente
router.put('/:id', OrderMessageController.putView)//pasarle el id de la orden por parametro, en el body mandarle tipo: darle_valor(true si quien accede a la orden es el comprador, y false si quien accede a la orden es alguien de ventas)
router.get('/', OrderMessageController.getNotViewSales)//Devuelve todos los mensajes de todas las ordenes que el equipo de venta no haya visto

module.exports = router