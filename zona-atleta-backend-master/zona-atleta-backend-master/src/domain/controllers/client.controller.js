const ClientModel = require('../../data/models/client.model')
const OrderModel = require('../../data/models/order.model')
const ProductModel = require('../../data/models/product.model')
const SocketManager = require('../../data/clients/socket.manager')
const { hash, compare } = require('../libs/bcrypt')
const { sendEmailPurchaseMade, sendEmailDiscount } = require('../libs/resend')

const { MercadoPagoConfig, Preference, Payment, PaymentRefund } = require('mercadopago');

const mpc = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
const CLIENT = process.env.CLIENT
const BACKEND_URL = process.env.BACKEND_URL

const createPreference = async (items, idOrder, res) => {
  const body = {
    items,
    back_urls: {
      success: `${CLIENT}/order/${idOrder}`,
      failure: `${CLIENT}/order/${idOrder}`,
      pending: `${CLIENT}/order/${idOrder}`,
    },
    auto_return: 'approved',
    notification_url: `https://zona-atleta-backend.onrender.com/api/order/webhook?orderId=${idOrder}`, // Pasar idOrder como query param
  };
  // Crear la preferencia de pago de manera asíncrona
  const preference = await new Preference(mpc).create({ body });
  return { redirectUrl: preference.init_point }

};

class ClientController {

  static async getAll(req, res) {
    try {
      const clients = await ClientModel.findMany()
      return res.json(clients)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const client = await ClientModel.findById(id)
      return res.json(client)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async deleteById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const client = await ClientModel.delete(id)
      return res.json(client)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async postConfirm(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { password } = req.body
      const clientFound = await ClientModel.findById(id)
      const match = await compare(password, clientFound.password)
      if (!match) return res.json({ message: 'Contraseña Incorrecta!' })
      return res.json({ message: 'OK' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async putById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { username, email, password, newPassword } = req.body
      const clientFound = await ClientModel.findById(id)
      const match = await compare(password, clientFound.password)
      if (!match) return res.json({ message: 'Contraseña Incorrecta' })
      let client
      if (newPassword) {
        const encrypt = await hash(newPassword)
        client = await ClientModel.update(id, { username, email, password: encrypt })
      } else {
        client = await ClientModel.update(id, { username, email })
      }
      return res.json(client)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async getProducts(req, res) {
    try {
      const id = parseInt(req.params.id)
      const products = await ClientModel.findProducts(id)
      // console.log(products)
      return res.json(products)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async postProduct(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const { amount } = req.body
      const product = await ClientModel.createProduct(id, productId, amount)
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async deleteProduct(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const product = await ClientModel.deleteProduct(id, productId)
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async putProduct(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const { amount } = req.body
      const product = await ClientModel.updateProduct(id, productId, amount)
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async getOrders(req, res) {
    try {
      const id = parseInt(req.params.id)
      const orders = await ClientModel.findOrders(id)
      return res.json(orders)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async postOrderByOneProduct(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { paymentMethod, address, productId, amount } = req.body
      const productFound = await ProductModel.findById(productId)
      if (!productFound)
        return res.status(400).json({ message: 'Product not found' })
      if (productFound.stock - amount < 0)
        return res.status(400).json({ message: 'Insufficient stock' })
      const productFormat = { productId, amount }
      const items = []
      items.push({ id: productId, title: productFound.name, description: productFound.description, picture_url: productFound.image, quantity: amount, currency_id: 'ARS', unit_price: productFound.price })
      const paymentId = "no disponible"
      const state = "pendiente de pago"
      const order = await ClientModel.createOrder(id, paymentMethod, paymentId, address, state, productFormat)
      console.log({
        stock: productFound.stock - amount,
        timesBought: productFound.timesBought + 1
      })
      const updatedProduct = await ProductModel.update(
        productFound.id,
        {
          stock: productFound.stock - amount,
          timesBought: productFound.timesBought + 1
        }
      )
      const preference = await createPreference(items, order.id, res)
      console.log(preference)
      const client = await ClientModel.findById(id)
      await sendEmailPurchaseMade(client.email)
      return res.json({ order, ...preference })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }


  static async cancelOrder(req, res) {

    // Extraer el payment_id de la notificación recibida
    // const paymentId =req.params.paymentID;
    const paymentId = "87106582666";

    if (paymentId) {
      console.log('Payment ID:', paymentId);

      try {
        const paymentRefund = new PaymentRefund(mpc);

        const paymentRefundData = await paymentRefund.create({
          payment_id: paymentId,
        })

        console.log(paymentRefundData)
        //OrderModel.update(parseInt(orderId), "pendiente");

      }
      catch (e) {
        console.log(e)
      }
    }

    res.sendStatus(200);
  };

  static async webHook(req, res) {


    const paymentData = req.body;
    const orderId = req.query.orderId; // Aquí capturas el idOrder

    console.log('Webhook received:', paymentData);

    // Extraer el payment_id de la notificación recibida
    const paymentId = paymentData.data?.id || paymentData.id;

    if (paymentId) {
      console.log('Payment ID:', paymentId);
      OrderModel.updateIDPayment(parseInt(orderId), String(paymentId));

      try {
        const payment = new Payment(mpc);
        const paymentGet = await payment.get({ id: paymentId, })
        if (paymentGet.status == "approved") {
          OrderModel.update(parseInt(orderId), "pago aprobado");
          console.log(paymentGet.status)
        }
        else if (paymentGet.status == "pending") {
          OrderModel.update(parseInt(orderId), "pago pendiente de aprobacion");
          console.log(paymentGet.status)
        }
        else {
          OrderModel.update(parseInt(orderId), "error al procesar el pago");
          console.log(paymentGet.status)
        }
      }
      catch (e) {
        console.log(e)
      }
    }

    res.sendStatus(200);
  };

  static async postOrderByManyProducts(req, res) {
    try {
      const id = parseInt(req.params.id) // Se obtiene la id del cliente
      const { paymentMethod, address } = req.body
      let productss = await ClientModel.findProducts(id)
      let products = []
      for (const p of productss) {
        products.push({ ...(await ProductModel.findById(p.id)), amount: p.amount })
      }
      if (products.length === 0) // Si el cliente no tiene productos no puede comprar
        return res.status(400).json({ message: 'Shopping Cart is Empty' })

      const items = []

      for (const cp of products) {
        if (cp.stock - cp.amount < 0) {
          return res.status(400).json({ message: `Insufficient stock of ${cp.name}` })
        }
        items.push({ id: cp.id, title: cp.name, description: cp.description, picture_url: cp.image, quantity: cp.amount, currency_id: 'ARS', unit_price: cp.price })
      }
      const productsFormat = products.map(p => ({ productId: p.id, amount: p.amount })) // Formatea la lista de productos para que el modelo la entienda
      const paymentId = "no disponible"
      const state = "pendiente de pago"
      const order = await ClientModel.createOrder(id, paymentMethod, paymentId, address, state, productsFormat)
      for (const cp of products) {
        const updatedProduct = await ProductModel.update(
          cp.id,
          {
            stock: cp.stock - cp.amount,
            timesBought: cp.timesBought + 1
          }
        )
      }
      const shoppingCart = await ClientModel.deleteManyProduct(id) // Elimina los productos que estaban en el carrito de compras
      const preference = await createPreference(items, order.id, res)
      const client = await ClientModel.findById(id)
      await sendEmailPurchaseMade(client.email)
      return res.json({ order, ...preference })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async postLike(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const like = await ClientModel.createLike(id, productId)
      return res.json(like)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async deleteLike(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const like = await ClientModel.deleteLike(id, productId)
      return res.json(like)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async getFavorites(req, res) {
    try {
      const id = parseInt(req.params.id)
      const favorites = await ClientModel.findFavorites(id)
      return res.json(favorites)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async postFavorite(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const favorite = await ClientModel.createFavorite(id, productId)
      return res.json({ ...favorite, isFavorite: true })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async deleteFavorite(req, res) {
    try {
      const id = parseInt(req.params.id)
      const productId = parseInt(req.params.productId)
      const favorite = await ClientModel.deleteFavorite(id, productId)
      return res.json({ ...favorite, isFavorite: false })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async getNotifications(req, res) {
    try {
      const id = parseInt(req.params.id)
      const notifications = await ClientModel.findNotifications(id)
      return res.json(notifications)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async sendEmailsOfDiscount(req, res) {
    try {
      const clients = await ClientModel.findMany()
      const clientsSelected = clients.slice(0, 10) // solo recojemos los primeros 10 clientes
      const emails = clientsSelected.map(client => client.email)
      // const { data, error } = await sendEmailDiscount(['chaparro.lautaro.et21.21@gmail.com'])
      const { data, error } = await sendEmailDiscount(emails)
      console.log(data, error)
      return res.status(200).json({ message: 'Emails enviados' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = ClientController