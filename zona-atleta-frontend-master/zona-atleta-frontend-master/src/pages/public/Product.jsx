import { useEffect } from 'react'
import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useBuy } from '../../contexts/BuyContext'
import { useUser } from '../../contexts/UserContext'
import ProductService from '../../services/ProductService'
import ShoppingCart from '../../components/icons/ShoppingCart'
import Button from '../../components/Button'
import Utilities from '../../utilities/Utilities'
import Loader from 'react-spinners/ClipLoader'

function ProductCard({ product, auth, disabled, addProduct, buyOne }) {

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

function Product() {

  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [nameValue, setNameValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [genderValue, setGenderValue] = useState('')

  const [searchParams, setSearchParams] = useSearchParams()

  const { addProduct, buyOne, haveProduct } = useBuy()
  const user = useUser()

  const limit = 20
  const offset = 0

  async function handleMoreProducts() {
    setLoading(true)
    try {
      const data = await ProductService.getProductsRequest(offset + products.length, limit)
      setProducts([...products, ...data.results.map(p => ({ ...p, have: haveProduct(p) }))])
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    async function getProducts() {
      try {
        let name = searchParams.get('name')
        let category = searchParams.get('category')
        let gender = searchParams.get('gender')
        if (name === null) {
          name = undefined
          setNameValue('')
        } else {
          setNameValue(name)
        }
        if (category === null) {
          category = undefined
          setCategoryValue('')
        } else {
          setCategoryValue(category)
        }
        if (gender === null) {
          gender = undefined
          setGenderValue('')
        } else {
          setGenderValue(gender)
        }
        const data = await ProductService.getProductsRequest(0, 20, { name, category, gender })
        setProducts(data.results.map(p => ({ ...p, have: haveProduct(p) })))
      } catch (e) {
        console.log(e)
      }
    }
    getProducts()
  }, [searchParams])

  return (
    <div className='max-w-[1536px] mx-auto py-32'>
      <div>
        <p className='text-primary text-4xl font-bold pl-8 uppercase my-8'>resultados para</p>
        {
          nameValue
            ? <p className='text-gray-900/80 text-xl font-medium pl-8 my-2'>Nombre: <span className='italic font-bold'>{nameValue}</span></p>
            : <></>
        }
        {
          categoryValue
            ? <p className='text-gray-900/80 text-xl font-medium pl-8 my-2'>Categoria: <span className='italic font-bold'>{categoryValue}</span></p>
            : <></>
        }
        {
          genderValue
            ? <p className='text-gray-900/80 text-xl font-medium pl-8 my-2'>Genero: <span className='italic font-bold'>{genderValue}</span></p>
            : <></>
        }
      </div>
      <div className='mt-12'>
        {
          products.length === 0
            ? <p className='text-center text-2xl text-primary font-bold'>No se encontraron productos</p>
            : <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
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
        }
        {
          loading
            ? <div className='flex justify-center items-center mt-12'>
              <Loader size={64} color='#ed3237' />
            </div>
            : <div className='flex justify-center items-center mt-12'>
              <Button onClick={handleMoreProducts}>Cargar mas productos</Button>
            </div>
        }
      </div>
    </div>
  )
}

export default Product