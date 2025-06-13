import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useBuy } from '../../contexts/BuyContext'
import Button from '../../components/Button'
import ErrorMessage from '../../components/ErrorMessage'
import ShoppingCartList from '../../components/shopping-cart/ShoppingCartList'
import Loader from '../../components/loader/Loader'

function ShoppinCartVoid() {
  return (
    <div className='shopping-cart-details-void'>
      <ErrorMessage message='El carrito de compras esta vacio' />
      <Link to='/home' className='link '>
        <Button>
          Seguir Comprando
        </Button>
      </Link>
    </div>
  )
}

function ShoppingCartDetails({ products, buy }) {

  const [total, setTotal] = useState(products.reduce((acum, p) => acum + (p.price, p.amount), 0))

  async function handleClick() {
    try {
      await buy()
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    setTotal(products.reduce((acum, p) => acum + (p.price * p.amount), 0))
  }, [products])

  return (
    <div className='py-8 text-center flex justify-center items-start'>
      <div className='pb-8 border-b-2 border-primary w-max'>
        <div className='text-center'>
          <p className='text-2xl mb-2'>Total de la Compra</p>
          <p className='text-2xl font-bold'>${total}</p>
        </div>
        <button className='bg-primary text-white px-4 py-2 rounded-md text-xl font-semibold mt-4' onClick={handleClick}>
          Comprar Ahora
        </button>
      </div>
    </div>
  )
}

function ShoppingCart() {

  const { loading, products, error, message, buy } = useBuy()

  return (
    <div className='w-full max-w-[1536px] mx-auto flex flex-col gap-8 py-16 md:py-32'>
      {
        loading
          ? <Loader size={64} />
          : products.length === 0
            ? <ShoppinCartVoid />
            : <div className='flex flex-col-reverse md:flex-row'>
              <ShoppingCartList
                products={products}
              />
              <ShoppingCartDetails products={products} buy={buy}/>
            </div>
      }
    </div>
  )
}

export default ShoppingCart