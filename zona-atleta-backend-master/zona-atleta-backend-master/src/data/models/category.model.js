const database = require('../database/database')

class CategoryModel {

  static async findMany() {
    const categories = await database.category.findMany()
    return categories 
  }

  static async findById(id) {
    const category = await database.category.findFirst({
      where: {
        id
      }
    })
    return category
  }

  static async create(name) {
    const category = await database.category.create({
      data: {
        name
      }
    })
    return category 
  }
}

module.exports = CategoryModel