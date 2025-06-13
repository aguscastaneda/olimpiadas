const ProductModel = require('../../data/models/product.model')
const CategoryModel = require('../../data/models/category.model')
const ClientModel = require('../../data/models/client.model')
const SalesManagerModel = require('../../data/models/sales-manager.model')
const { createAccesToken, verifyAccesToken } = require('../libs/jwt')

const BACKEND_URL = process.env.BACKEND_URL

const PROFILES = {
  CLIENT: 1,
  SALES_MANAGER: 2
}

function formatQuery(query) {
  let offset = parseInt(query.offset)
  let limit = parseInt(query.limit)
  if (isNaN(offset) || offset < 0) {
    offset = 0
  }
  if (isNaN(limit) || limit < 0) {
    limit = 20
  }
  let name = query.name
  if (name) {
    name = name.toLowerCase()
  }
  let category = query.category
  if (category) {
    category = category.toLowerCase()
  }
  let gender = query.gender
  if (gender) {
    gender = gender.toLowerCase()
  }

  return {
    offset,
    limit,
    name,
    category,
    gender
  }
}

function urls(entity, count, offset, limit) {
  let previous = null
  let next = null
  if (offset !== 0) {
    if ((offset - limit < 0) && (offset > 0)) {
      previous = `${BACKEND_URL}/api/${entity}?offset=${0}&limit=${offset}`
    } else if (offset - limit >= 0) {
      previous = `${BACKEND_URL}/api/${entity}?offset=${offset - limit}&limit=${limit}`
    }
  }
  if (offset + limit <= count) {
    next = `${BACKEND_URL}/api/${entity}?offset=${offset + limit}&limit=${limit}`
  }
  return {
    previous,
    next
  }
}

class ProductController {

  static async putPause(req, res) {
    try {
      const id = parseInt(req.params.id)
      const product = await ProductModel.findById(id)
      if (product) {
        await ProductModel.pauseById(id)
      }
      return res.status(200).json({ message: 'OK' })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async getAll(req, res) {
    try {
      const { offset, limit, name, category, gender } = formatQuery(req.query)
      const count = await ProductModel.count()
      const { previous, next } = urls('product', count, offset, limit)
      const { token } = req.cookies
      let available = true
      if (token) {
        const { id, username, profile } = await verifyAccesToken(token)
        if (profile.id === PROFILES.SALES_MANAGER) {
          const salesManager = await SalesManagerModel.findById(id)
          if (salesManager) {
            available = undefined
          }
        }
      }
      const results = await ProductModel.findMany(offset, limit, { name, category, gender, available })
      return res.json({ count, previous, next, results })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { clientId } = req.body
      console.log(id)
      const product = await ProductModel.findById(id)
      if (!product)
        return res.status(404).json({ message: 'Product not found' })
      await ProductModel.update(id, { visits: product.visits + 1 })
      if (clientId) {
        const favorites = await ClientModel.findFavorites(clientId)
        for (const favorite of favorites) {
          console.log(product.id, favorite.id)
          if (product.id === favorite.id) {
            return res.json({ ...product, isFavorite: true })
          }
        }
        return res.json({ ...product, isFavorite: false })
      }
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async getDiscount(req, res) {
    try {
      const results = await ProductModel.findManyDiscount(0, 6)
      return res.json({ results })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async getPopular(req, res) {
    try {
      const results = await ProductModel.findManyPopular(0, 5)
      return res.json({ results })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async getLast(req, res) {
    try {
      const results = await ProductModel.findManyLast(0, 7)
      return res.json({ results })
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async post(req, res) {
    try {
      const p = req.body
      const category = await CategoryModel.findById(parseInt(p.categoryId))
      if (!category)
        return res.status(400).json({ message: 'Category not found' })
      let image = undefined
      if (req.file) {
        image = "/uploads/" + req.file.filename
      }
      const product = await ProductModel.create({
        name: p.name,
        categoryId: parseInt(p.categoryId),
        description: p.description === '' ? undefined : p.description,
        price: parseInt(p.price),
        stock: parseInt(p.stock),
        image: image,
        percentage: p.percentage === '' ? undefined : parseInt(p.percentage),
        gender: p.gender
      })
      console.log(product)
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async deleteById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const product = await ProductModel.delete(id)
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }

  static async putById(req, res) {
    try {
      const id = parseInt(req.params.id)
      const { price, stock, available, timesBought } = req.body
      const product = await ProductModel.update(id, { price, stock, available, timesBought })
      return res.json(product)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server Error' })
    }
  }
}

module.exports = ProductController