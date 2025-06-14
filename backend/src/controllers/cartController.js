const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener el carrito del usuario
const getCart = async (req, res) => {
  try {
    console.log('Getting cart for user:', req.user.id);
    
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
      console.log('Cart not found, creating new cart');
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
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    console.log('Cart retrieved successfully:', { cartId: cart.id, total });
    res.json({ ...cart, total });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ error: 'Error al obtener el carrito: ' + error.message });
  }
};

// Agregar item al carrito
const addItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log('Adding item to cart:', { userId: req.user.id, productId, quantity });

    // Verificar que el producto existe y tiene stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Obtener o crear carrito
    let cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user.id },
      });
    }

    // Agregar o actualizar item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        unique_cart_product: {
          cartId: cart.id,
          productId: productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId: productId,
        quantity: quantity,
      },
    });

    // Obtener carrito actualizado
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const total = updatedCart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    console.log('Item added successfully:', { cartItemId: cartItem.id });
    res.json({ ...updatedCart, total });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Error al agregar item al carrito: ' + error.message });
  }
};

// Actualizar cantidad de item
const updateItemQuantity = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { quantity } = req.body;
    console.log('Updating item quantity:', { itemId, quantity });

    if (isNaN(itemId)) {
      return res.status(400).json({ error: 'ID de item inválido' });
    }

    // Verificar que el item existe
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    // Verificar que el carrito pertenece al usuario
    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Verificar stock
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }

    // Actualizar cantidad
    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: true,
      },
    });

    // Obtener carrito actualizado
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    console.log('Item quantity updated successfully:', { itemId: updatedItem.id });
    res.json({ ...cart, total });
  } catch (error) {
    console.error('Error updating item quantity:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad: ' + error.message });
  }
};

// Eliminar item del carrito
const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log('Removing item from cart:', { itemId });

    // Verificar que el item existe
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(itemId) },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }

    // Verificar que el carrito pertenece al usuario
    if (cartItem.cart.userId !== req.user.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    // Eliminar item
    await prisma.cartItem.delete({
      where: { id: parseInt(itemId) },
    });

    // Obtener carrito actualizado
    const cart = await prisma.cart.findUnique({
      where: { id: cartItem.cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    console.log('Item removed successfully:', { itemId });
    res.json({ ...cart, total });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Error al eliminar item: ' + error.message });
  }
};

// Vaciar carrito
const clearCart = async (req, res) => {
  try {
    console.log('Clearing cart for user:', req.user.id);

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    // Eliminar todos los items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    console.log('Cart cleared successfully');
    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Error al vaciar carrito: ' + error.message });
  }
};

module.exports = {
  getCart,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
}; 