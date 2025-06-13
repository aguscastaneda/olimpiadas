const { PrismaClient } = require('@prisma/client');
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const prisma = new PrismaClient();

// Configurar MercadoPago
const mp = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN 
});

// Crear un nuevo pedido
const createOrder = async (req, res) => {
  try {
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
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Calcular el total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Crear el pedido
    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        total,
        status: 'PENDING',
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
        }
      }
    });

    // Crear preferencia de pago en MercadoPago
    const preference = new Preference(mp);
    const items = cart.items.map(item => ({
      id: item.product.id,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      currency_id: 'ARS'
    }));

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

    // Actualizar el pedido con el ID de preferencia
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentId: preferenceData.id }
    });

    // Vaciar carrito
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    res.status(201).json({
      order,
      paymentUrl: preferenceData.init_point
    });
  } catch (error) {
    console.error('Error al crear la orden:', error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

// Webhook de MercadoPago
const handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (type === 'payment') {
      const payment = new Payment(mp);
      const paymentData = await payment.get({ id: data.id });
      
      const orderId = paymentData.external_reference;
      if (!orderId) {
        return res.status(400).json({ error: 'No se encontró la referencia de la orden' });
      }

      let status;
      switch (paymentData.status) {
        case 'approved':
          status = 'PROCESSING';
          break;
        case 'pending':
          status = 'PENDING';
          break;
        case 'rejected':
          status = 'CANCELLED';
          break;
        default:
          status = 'PENDING';
      }

      await prisma.order.update({
        where: { id: parseInt(orderId) },
        data: { 
          status,
          paymentId: paymentData.id.toString()
        }
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).json({ error: 'Error al procesar el webhook' });
  }
};

// Obtener pedidos del usuario
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

// Obtener todos los pedidos (solo jefe de ventas)
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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

// Actualizar estado del pedido (solo jefe de ventas)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar estado de la orden' });
  }
};

// Cancelar pedido
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'SALES_MANAGER') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ error: 'La orden ya está cancelada' });
    }

    if (order.status === 'DELIVERED') {
      return res.status(400).json({ error: 'No se puede cancelar una orden entregada' });
    }

    // Restaurar stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: item.product.stock + item.quantity
        }
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELLED' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(updatedOrder);
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