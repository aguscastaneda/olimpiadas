const dotenv = require('dotenv')
dotenv.config()
const app = require('./presentation/app')
const database = require('./data/database/database')
const bcrypt = require('bcryptjs')

async function createProfiles() {
  return await database.profile.createMany({
    data: [
      {
        name: 'client'
      },
      {
        name: 'sales manager'
      }
    ]
  })
}

async function createCategories() {
  return await database.category.createMany({
    data: [
      {
        name: 'hockey'
      },
      {
        name: 'tenis'
      },
      {
        name: 'moda'
      },
      {
        name: 'training'
      },
      {
        name: 'natacion'
      },
      {
        name: 'running'
      },
      {
        name: 'basquet'
      },
      {
        name: 'futbol'
      }
    ]
  })
}

async function createSalesManager(username, password) {
  const hash = await bcrypt.hash(password, 10)
  return await database.salesManager.create({
    data: {
      username,
      password: hash,
      profileId: 2
    }
  })
}

async function deleteManyProducts() {
  await database.last.deleteMany()
  await database.discount.deleteMany()
  await database.comment.deleteMany()
  await database.favorite.deleteMany()
  await database.like.deleteMany()
  await database.productOrder.deleteMany()
  await database.clientProduct.deleteMany()
  return await database.product.deleteMany()
}

async function deleteClient(id) {
  return await database.client.delete({
    where: {
      id
    }
  })
}

async function main() {
  try {
    console.log(await createProfiles())
    console.log(await createCategories())
    console.log(await createSalesManager('lucas77', 'lucas123'))
  } catch (e) {
    console.log(e)
  }
}

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log('Server on port', PORT)
})