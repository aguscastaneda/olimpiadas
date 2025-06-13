import ShoppingCartCard from './ShoppingCartCard'

function ShoppingCartList({ products, onClickMoreProduct, onClickLessProduct, onClickDeleteProduct }) {

  return (
    <div className='w-full flex flex-col gap-16 col-start-1 col-end-2'>
      {
        products.map((p, i) => (
          <ShoppingCartCard
            key={i}
            product={p}
            onClickLessProduct={onClickLessProduct}            
            onClickMoreProduct={onClickMoreProduct}
            onClickDeleteProduct={onClickDeleteProduct}
          />
        ))
      }
    </div>
  )
}

export default ShoppingCartList