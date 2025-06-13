const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener el carrito del usuario
const getCart = async (req, res) => {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user.id,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({ ...cart, total });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: req.user.id,
        },
        include: {
          items: true,
        },
      });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === parseInt(productId)
    );

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      });

      return res.json(updatedItem);
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: parseInt(productId),
        quantity,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

// Actualizar cantidad en el carrito
const updateItemQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true,
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity },
      include: {
        product: true,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
};

// Eliminar item del carrito
const removeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar item del carrito' });
  }
};

// Vaciar carrito
const clearCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error al vaciar el carrito' });
  }
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
}; 