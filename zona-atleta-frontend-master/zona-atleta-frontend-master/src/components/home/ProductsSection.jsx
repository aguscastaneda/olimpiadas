import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import { useBuy } from '../../contexts/BuyContext'
import ShoppingCart from '../icons/ShoppingCart'
import Utilities from '../../utilities/Utilities'
import Loader from 'react-spinners/ClipLoader'
import Previus from '../icons/ArrowLeft'
import Next from '../icons/ArrowRight'
import Button from '../Button'
import Subtitle from '../Subtitle'

function ProductCard({ product, auth, disabled, addProduct, buyOne, setNotifications, notifications }) {

  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingBuy, setLoadingBuy] = useState(false)
  const [hasProduct, setHasProduct] = useState(product.have)

  const navigate = useNavigate()

  const noActive = disabled || loadingAdd || loadingBuy

  function handleClick(e) {
    e.stopPropagation()
    navigate(`/product/${product.id}`)
  }

  async function handleClickAdd(e) {
    e.stopPropagation()
    if (!auth) {
      navigate('/login')
      return
    }
    if (disabled) {
      return
    }
    if (loadingAdd || loadingBuy) return
    try {
      setLoadingAdd(true)
      await addProduct(product)
      setLoadingAdd(false)
      setHasProduct(true)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleClickBuy(e) {
    e.stopPropagation()
    if (loadingAdd || loadingBuy) return
    if (!auth) {
      navigate('/login')
      return
    }
    if (disabled) {
      return
    }
    try {
      setLoadingBuy(true)
      await buyOne(product)
      setLoadingBuy(false)
    } catch (e) {
      console.log(e)
    }
  }


  return (
    <div className='product-card' onClick={handleClick}>
      <div className='product-card__image-container'>
        <p className='product-card__more-see'>Ver mas</p>
        <img className='product-card__image' src={product.image} alt={product.name} />
      </div>
      <div className='product-card__content'>
        <div className='flex items-center justify-between'>
          <p className='product-card__name'>{product.name}</p>
          <p className='product-card__price'>${Utilities.formatNumberToPrice(product.price)}</p>
        </div>
        <div className=''>
          {
            hasProduct
              ? <Link to='/shopping-cart' onClick={e => e.stopPropagation()}>
                <Button disabled={disabled}>
                  <div className='flex items-center gap-4'>Ir al carrito de compras <ShoppingCart /></div>
                </Button>
              </Link>
              : <div className='flex justify-start gap-4'>
                <Button className='' title='Comprar' onClick={handleClickBuy} disabled={noActive}>
                  {
                    loadingBuy
                      ? <Loader className='loader-color' color='white' />
                      : 'Comprar'
                  }
                </Button>
                <Button variant='outline' className='flex justify-center items-center gap-4 hover:*:fill-white' title='Agregar al carrito' onClick={handleClickAdd} disabled={noActive}>
                  {
                    loadingAdd
                      ? <Loader className='loader-color' color='white' />
                      : <>
                        Agregar al Carrito
                      </>
                  }
                </Button>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

function ProductsSection({ title, isLoading, products, page, navigate, handleMoreProducts }) {

  const user = useUser()
  const { addProduct, buyOne } = useBuy()

  const buttonPage = page ? <Button>{page}</Button> : <></>

  function handlePreviousClick() {
    if (!page) {
      navigate(`/home/page/${2}`)
    } else {
      if (parseInt(page) >= 2) {
        navigate(`/home/page/${parseInt(page) - 1}`)
      }
    }
  }

  function handleNextClick() {
    navigate(`/home/page/${!page ? 2 : parseInt(page) + 1}`)
  }

  return (
    <div>
      <div className='flex justify-between items-center flex-col md:flex-row gap-4'>
        <Subtitle>{title}</Subtitle>
      </div>
      {
        products.length === 0
          ? <div className='flex justify-center mt-8 md:mt-0'>
            <p className='text-xl text-primary font-semibold text-center'>No se encontraron productos</p>
          </div>
          : <>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {
                products.map((p, i) => <ProductCard
                  key={i}
                  product={p}
                  auth={!user.isNone()}
                  disabled={user.isSalesManager()}
                  addProduct={addProduct}
                  buyOne={buyOne}
                />)
              }
            </div>
            {
              isLoading
                ? <div className='flex justify-center items-center mt-12'>
                  <Loader size={64} color='#ed3237' />
                </div>
                : <div className='flex justify-center items-center mt-12'>
                  <Button onClick={handleMoreProducts}>Cargar mas productos</Button>
                </div>
            }

          </>
      }
    </div>
  )
}

export default ProductsSection