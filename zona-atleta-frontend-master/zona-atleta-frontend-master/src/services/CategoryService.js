import axios from './intance/instance'

class CategoryService {

  static async getCategoriesRequest() {
    const response = await axios.get('/api/category')
    return response.data
  }
}

export default CategoryService