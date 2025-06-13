const express = require('express')
const http = require('http')
const { Server: SocketServer } = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const multer = require('multer')
const path = require('path')

const authRoutes = require('./routes/auth.routes')
const productRoutes = require('./routes/product.routes')
const categoryRoutes = require('./routes/category.routes')
const clientRoutes = require('./routes/client.routes')
const orderRoutes = require('./routes/order.routes')
const orderMessageRoutes = require('./routes/order.message.routes')
const commentRoutes = require('./routes/comment.routes')

const SocketManager = require('../data/clients/socket.manager')

const CLIENT = process.env.CLIENT
const PROFILES = {
  CLIENT: 1,
  SALES_MANAGER: 2
}

const app = express()
const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: CLIENT
  }
})

// Middlewares
app.use(cors({
  credentials: true,
  origin: CLIENT
}))
app.use(morgan('dev'))
app.use(cookieParser())
const storage = multer.diskStorage({
  destination: path.join(__dirname, '../../public/uploads'),
  filename(req, file, cb) {
    cb(null, (new Date()).getTime() + path.extname(file.originalname))
  }
}) // Configuracion del storage de multer
app.use(multer({ storage }).single('image')) // Single por que es solo una imagen
app.use(express.urlencoded({ extended: false })) // Interpreta los datos de un formulario html como un json, muy util
app.use(express.json())

// Rutas de la api
app.use('/api/auth', authRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/product', productRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/order-message', orderMessageRoutes)
app.use('/api/comment', commentRoutes)


// Directorios y ficheros publicos
app.use(express.static(path.join(__dirname, '../../public')))

// Eventos via sockets
io.on('connection', socket => {
  socket.on('auth', (user) => {
    if (user.profile.id === PROFILES.CLIENT) {
      // console.log('Soy un cliente')
      SocketManager.addClient(user, socket)
    } else if (user.profile.id === PROFILES.SALES_MANAGER) {
      // console.log('Soy un jefe de ventas')
      SocketManager.addSalesManager(user, socket)
    }
  })
})

module.exports = server