const PDFDocument = require('pdfkit-table')

const orderExample = {
  id: 1,
  date: '2005-01-11',
  state: 'Pendiente',
  totalPrice: 1000,
  paymentMethod: 'Mercado Pago',
  client: {
    id: 1,
    username: 'chapy77',
    email: 'chaparro.lautaro.et21.21@gmail.com'
  },
  products: [
    {
      id: 1,
      name: 'Pelota de futbol',
      category: {
        id: 1,
        name:'futbol',
      },
      price: 3000,
      amount: 4
    },
    {
      id: 1,
      name: 'Pelota de basketball',
      category: {
        id: 2,
        name:'basketball',
      },
      price: 1000,
      amount: 8
    },
    {
      id: 2,
      name: 'Camisa de river',
      category: {
        id: 3,
        name:'futbol',
      },
      price: 5000,
      amount: 2
    },
    {
      id: 4,
      name: 'Gorro de pisina',
      category: {
        id: 4,
        name:'nadismo'
      },
      price: 300,
      amount: 1
    }
  ]
}

function createPDF(dataCallback, endCallback, order) {
  const doc = new PDFDocument({ margin: 32, size: 'A4' })

  doc.on('data', dataCallback)
  doc.on('end', endCallback)

  // Encabezado
  doc.fontSize(24).text('Zona Atleta', { align: 'center' })
  doc.fontSize(16).text('Recibo de Compra', { align: 'center' })
  doc.moveDown(1)

  doc.fontSize(12).text(`Fecha: ${order.date}`)
  doc.text(`Estado: ${order.state}`)
  doc.text(`Método de Pago: ${order.paymentMethod}`)
  doc.text(`Cliente: ${order.client.username}`)
  doc.text(`Email: ${order.client.email}`)
  doc.moveDown(2)

  // Tabla de Productos
  const table = {
    title: 'Productos de la compra',
    headers: ['ID', 'Nombre', 'Categoría', 'Precio Unitario', 'Cantidad', 'Precio Total'],
    rows: [
      ...order.products.map(p => ([p.id, p.name, p.category.name, p.price.toFixed(2), p.amount, (p.price * p.amount).toFixed(2)])),
      [ 'Total', '', '', '', '', order.products.reduce((acum, p) => acum + (p.price * p.amount), 0).toFixed(2)]
    ]
  }

  doc.table(table, {
    padding: 10,
    prepareHeader: () => doc.font('Helvetica-Bold'),
    prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
      doc.font('Helvetica')
      if (indexRow === table.rows.length - 1) {
        doc.font('Helvetica-Bold')
      }
    }
  })

  doc.moveDown(1)

  // Pie de Página
  doc.fontSize(10).text('Gracias por su compra!', { align: 'center' })

  doc.end()
}

module.exports = {
  createPDF
}