const includeProductDetails = {
  category: true,
  comments: {
    include: {
      response: true
    }
  },
  likes: true,
  favorites: true,
  discount: true
}

module.exports = {
  includeProductDetails
}