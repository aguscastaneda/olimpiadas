import ProductCard from './ProductCard'

function ProductList({ products, onClick, onClickAdd, onClickBuy }) {
  return (
    <div className='product-list'>
      {
        products.map((p, i) => <ProductCard key={i} product={p} onClick={onClick} onClickAdd={onClickAdd} onClickBuy={onClickBuy} />)
      }
    </div>
  )
}

export default ProductList