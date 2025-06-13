const CategoryModel = require('../../data/models/category.model')

class CategoryController {

  static async getAll(req, res) {
    try {
      const categories = await CategoryModel.findMany()
      return res.json(categories)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }

  static async post(req, res) {
    try {
      const { name } = req.body
      const category = await CategoryModel.create(name)
      return res.json(category)
    } catch (e) {
      console.log(e)
      return res.status(500).json({ message: 'Server error' })
    }
  }
}

module.exports = CategoryController