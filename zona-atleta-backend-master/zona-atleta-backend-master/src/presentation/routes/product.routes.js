const { Router } = require('express')
const ProductController = require('../../domain/controllers/product.controller')
const ValidatorToken = require('../../domain/middlewares/validator.token')

const router = Router()

router.get('/', ProductController.getAll)
router.get('/:id', ProductController.getById)
router.get('/from/discount', ProductController.getDiscount)
router.get('/from/popular', ProductController.getPopular)
router.get('/from/last', ProductController.getLast)
router.post('/', ProductController.post)
router.delete('/:id', ProductController.deleteById)
router.put('/:id', ProductController.putById)
router.put('/:id/pause', ProductController.putPause)

module.exports = router