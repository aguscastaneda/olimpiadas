import Button from '../Button'
import ShoppingCart from '../icons/ShoppingCart'

function ProductCard({ product, onClick = () => { }, onClickAdd = () => { }, onClickBuy = () => { } }) {

  function handleClick(e) {
    e.stopPropagation()
    onClick(product)
  }

  function handleClickAdd(e) {
    e.stopPropagation()
    onClickAdd(product)
  }

  function handleClickBuy(e) {
    e.stopPropagation()
    onClickBuy(product)
  }

  return (
    <div className='product-card' onClick={handleClick}>
      <div className='product-card__image-container'>
        <p className='product-card__more-see'>Ver mas</p>
        <img className='product-card__image' src={product.image} alt={product.name} />
      </div>
      <div className='product-card__content'>
        <p className='product-card__name'>{product.name}</p>
        <div className='product-card__container'>
          <p className='product-card__price'>${product.price}</p>
        </div>
        <div className='product-card__btn-container'>
          <Button className='' variant='outline' title='Comprar' onClick={handleClickBuy}>
            Comprar
          </Button>
          <Button className='' title='Agregar al carrito' onClick={handleClickAdd}>
            <ShoppingCart />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard