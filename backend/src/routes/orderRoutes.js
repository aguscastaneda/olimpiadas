const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');

// Rutas para usuarios autenticados
router.post('/', auth, createOrder);
router.get('/my-orders', auth, getMyOrders);
router.delete('/:id/cancel', auth, cancelOrder);

// Rutas para gerentes de ventas
router.get('/', auth, checkRole(['SALES_MANAGER']), getAllOrders);
router.put('/:id/status', auth, checkRole(['SALES_MANAGER']), updateOrderStatus);

module.exports = router; 