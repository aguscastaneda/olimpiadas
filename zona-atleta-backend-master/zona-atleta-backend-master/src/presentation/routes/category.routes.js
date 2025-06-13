const { Router } = require('express')
const CategoryController = require('../../domain/controllers/category.controller')

const router = Router()

router.get('/', CategoryController.getAll)
router.post('/', CategoryController.post)

module.exports = router