const { PrismaClient } = require('@prisma/client');
const { Preference } = require('mercadopago');
const mp = require('../config/mercadopago');

// Inicializar Prisma como una instancia global
const prisma = new PrismaClient();

// Manejar errores de Prisma
prisma.$on('error', (e) => {
  console.error('Prisma Error:', e);
});

// Crear un nuevo pedido
const createOrder = async (req, res) => {
  try {
    console.log('Creating order for user:', req.user.id);
    
    // Obtener el carrito del usuario
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty or not found');
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    console.log('Cart items:', cart.items);

    // Calcular el total
    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    console.log('Total calculated:', total);

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: 0, // PENDING
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        orderStatus: true
      }
    });

    console.log('Order created:', order);

    // Crear preferencia de pago en MercadoPago
    const preference = new Preference(mp);
    const items = cart.items.map(item => ({
      id: item.product.id,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: Number(item.product.price),
      currency_id: 'ARS'
    }));

    console.log('Creating MercadoPago preference with items:', items);

    const preferenceData = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${process.env.FRONTEND_URL}/orders/${order.id}/success`,
          failure: `${process.env.FRONTEND_URL}/orders/${order.id}/failure`,
          pending: `${process.env.FRONTEND_URL}/orders/${order.id}/pending`
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL}/api/orders/webhook`,
        external_reference: order.id.toString()
      }
    });

    console.log('MercadoPago preference created:', preferenceData);

    // Actualizar el pedido con el ID de preferencia
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: preferenceData.id }
    });

    // Vaciar carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    console.log('Cart cleared and order completed');

    res.status(201).json({
      order,
      paymentUrl: preferenceData.init_point
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ error: 'Error al crear la orden: ' + error.message });
  }
};

// Manejar webhook de MercadoPago
const handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const payment = await mp.payment.findById(data.id);
      const orderId = payment.external_reference;
      
      let status;
      switch (payment.status) {
        case 'approved':
          status = 2; // COMPLETED
          break;
        case 'pending':
          status = 1; // PROCESSING
          break;
        case 'rejected':
          status = 3; // CANCELLED
          break;
        default:
          status = 0; // PENDING
      }

      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { status }
      });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Error en webhook: ' + error.message });
  }
};

// Obtener mis órdenes
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        orderStatus: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

// Obtener todas las órdenes (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        },
        orderStatus: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las órdenes' });
  }
};

// Actualizar estado de la orden (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        },
        orderStatus: true
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el estado de la orden' });
  }
};

// Cancelar orden
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.update({
      where: { id: parseInt(orderId) },
      data: { status: 3 }, // CANCELLED
      include: {
        items: {
          include: {
            product: true
          }
        },
        orderStatus: true
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar la orden' });
  }
};

module.exports = {
  createOrder,
  handleWebhook,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
}; 