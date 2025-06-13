const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { auth, checkRole } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProduct);

// Rutas protegidas (solo jefe de ventas)
router.post('/', auth, checkRole(['SALES_MANAGER']), createProduct);
router.put('/:id', auth, checkRole(['SALES_MANAGER']), updateProduct);
router.delete('/:id', auth, checkRole(['SALES_MANAGER']), deleteProduct);

module.exports = router; 