class Product {
  
  static filterByName(products, name) {
    return products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()))
  }

  static filterByOrder(products, order) {
    switch (order) {
      case 'relevant':
        return [...products]
      case 'plus':
        return [...[...products].sort((a, b) => b.price - a.price)]
      case 'minus':
        return [...[...products].sort((a, b) => a.price - b.price)]
    }
  }

  static filterByRangePrice(products, start, end) {
    if (start <= end) {
      return products.filter(p => p.price >= start && p.price <= end)
    } else {
      return products
    }
  }

  static formatStringPriceToIntPrice(stringPrice) {
    // $500 -> 500
    return stringPrice.length === 1
      ? 0
      : parseInt(stringPrice.slice(1, stringPrice.length))
  }

  static filterByCategory(products, category) {
    return products.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }
}

export default Product