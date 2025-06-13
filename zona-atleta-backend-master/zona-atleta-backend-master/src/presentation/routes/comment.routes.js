const { Router } = require('express')
const CommentResponseController = require('../../domain/controllers/comment.controller')

const router = Router()

router.get('/', CommentResponseController.getAllByProductId)
router.post('/', CommentResponseController.postComment)

router.post('/response', CommentResponseController.postResponse)
router.put('/response', CommentResponseController.putResponse)
router.put('/response/client', CommentResponseController.putViewResponses)

router.put('/:id/comment', CommentResponseController.viewComment)//Para marcar un comentario como visto por los admin, utilizarlo cuando el comentario es respondido, haciendo que se reste el comentario de las notificaciones 

router.get('/get/comment', CommentResponseController.notViewComment)//Para cuando se loguea el admin, nos fijamos que comentarios no vio para mostrarlos en notificaciones y para calcular cuantas notificaciones tienen los vendedores
router.get('/:id/response', CommentResponseController.notViewResponse)//Para cuando se loguea el cliente, nos fijamos que respuestas no vio para mostrarlas en notificaciones y para caclular cuantas notificaciones tiene el cliente

module.exports = router