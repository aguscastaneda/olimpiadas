import { useEffect, useState } from 'react'
import ProductService from '../../services/ProductService'
import OrderSevice from '../../services/OrderService'
import ProductCard from '../../components/admin/ProductCard'
import OrderCard from '../../components/admin/OrderCard'
import ClientCard from '../../components/admin/ClientCard'
import FormProduct from '../../components/forms/FormProduct'
import Button from '../../components/Button'
import axios from 'axios'
import Loader from 'react-spinners/ClipLoader'
import FormEditProduct from '../../components/forms/FormEditProduct'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ClientService from '../../services/ClientService'
import { Link, useParams } from 'react-router-dom'

const MySwal = withReactContent(Swal)

function OptionsBar() {

  const [isLoading, setIsLoading] = useState(false)

  async function handleNotifyDiscount() {
    setIsLoading(true)
    try {
      const data = await ClientService.sendEmailsDiscountRequest()
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
  }

  return (
    <div className='w-max h-max py-16 px-12 bg-primary text-white shadow-2xl rounded text-center'>
      <h2 className='text-2xl font-bold mb-8'>Opciones</h2>
      <div className='flex flex-col gap-8'>
        <div className='border-b-2 border-white pb-2 '>
          <Link
            to='/admin/product'
            className='text-xl font-semibold cursor-pointer hover:text-gray-700'
          >Productos</Link>
        </div>
        <div className='border-b-2 border-white pb-2 '>
          <Link
            to='/admin/order'
            className='text-xl font-semibold cursor-pointer hover:text-gray-700'
          >Pedidos</Link>
        </div>
        <div className='border-b-2 border-white pb-2 '>
          <Link
            to='/admin/client'
            className='text-xl font-semibold cursor-pointer hover:text-gray-700'
          >Clientes</Link>
        </div>
        <button
          className='bg-white text-primary font-bold rounded px-4 py-2 border-2 border-transparent transition-all hover:text-white hover:bg-primary hover:border-white'
          onClick={handleNotifyDiscount}
        >
          {
            isLoading
              ? <Loader />
              : 'Notificar descuentos'
          }
        </button>
      </div>
    </div>
  )
}

function OptionProducts() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showProducts, setShowProducts] = useState(true)
  const [createProduct, setCreateProduct] = useState(false)
  const [editProduct, setEditProduct] = useState(false)
  const [previous, setPrevious] = useState(null)
  const [next, setNext] = useState(null)
  const [productId, setProductId] = useState(0)

  function handleClickDelete(p) {
    // MySwal.fire({
    //   title: <p>Funcion no disponible</p>,
    //   showCloseButton: false,
    //   showConfirmButton: false,
    //   timer: 2000
    // })
    return async () => {
      try {
        await ProductService.pauseProduct(p.id)
      } catch (e) {
        console.log(e)
      }
    }
  }

  function showCreateProduct() {
    setCreateProduct(true)
    setShowProducts(false)
    setEditProduct(false)
  }

  function showEditProduct() {
    setCreateProduct(false)
    setShowProducts(false)
    setEditProduct(true)
  }

  function noShowCreateProduct() {
    setCreateProduct(false)
    setShowProducts(true)
    setEditProduct(false)
  }

  function noShowEditProduct() {
    setCreateProduct(false)
    setShowProducts(true)
    setEditProduct(false)
  }

  async function handleNext() {
    setLoading(true)
    try {
      if (next !== null) {
        const res = await axios.get(next)
        setProducts(res.data.results)
        setPrevious(res.data.previous)
        setNext(res.data.next)
      }
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  async function handlePrevious() {
    setLoading(true)
    try {
      if (previous !== null) {
        const res = await axios.get(previous)
        setProducts(res.data.results)
        setPrevious(res.data.previous)
        setNext(res.data.next)
      }
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    async function getProducts() {
      setLoading(true)
      try {
        const res = await ProductService.getProductsRequest()
        setProducts(res.results)
        setPrevious(res.previous)
        setNext(res.next)
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }
    getProducts()
  }, [])

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='text-3xl text-gray-700 text-center w-full font-bold'>Administrar Productos</h2>
      </div>
      <div>
        {
          showProducts
          && <div className='flex flex-col gap-8'>
            <div className='flex justify-between'>
              <Button onClick={showCreateProduct}>
                Crear Nuevo Producto
              </Button>
              <div className='flex gap-4'>
                <Button onClick={handlePrevious}>Anterior</Button>
                <Button onClick={handleNext}>Siguente</Button>
              </div>
            </div>
            {
              loading
                ? <div className='flex justify-center py-8'>
                  <Loader size={64} />
                </div>
                : products.length === 0
                  ? <div className='flex justify-center items-center text-primary text-xl font-medium py-8'>
                    <p>No se encontraron productos</p>
                  </div>
                  : <div className='grid grid-cols-3 gap-4'>
                    {
                      products.map((p, i) => <ProductCard key={i} product={p} setProductId={setProductId} showEditProduct={showEditProduct} onClickPause={handleClickDelete(p)} />)
                    }
                  </div>
            }
          </div>
        }
        {
          createProduct
          && <div className='w-full flex flex-col gap-8'>
            <div className='w-full flex justify-center'>
              <Button onClick={noShowCreateProduct}>
                Ver Productos
              </Button>
            </div>
            <div>
              <FormProduct />
            </div>
          </div>
        }
        {
          editProduct
          && <div className='w-full flex flex-col gap-8'>
            <div className='w-full flex justify-center'>
              <Button onClick={noShowEditProduct}>
                Ver Productos
              </Button>
            </div>
            <div>
              <FormEditProduct productId={productId} />
            </div>
          </div>
        }
      </div>
    </div>
  )
}

function OptionOrders() {

  const [allOrders, setAllOrders] = useState([])
  const [orders, setOrders] = useState([])
  const [showPending, setShowPendieng] = useState(false)
  const [optionDate, setOptionDate] = useState('normal')
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState(0)

  function filter() {
    let res = [...allOrders]
    if (showPending) {
      res = allOrders.filter(order => order.state === 'pago aprobado')
    }
    if (optionDate === 'asc') {
      res.sort((a, b) => new Date(a.date).getTime() > new Date(b.date).getTime())
      setOrders(res)
    } else if (optionDate === 'desc') {
      res.sort((a, b) => new Date(a.date).getTime() < new Date(b.date).getTime())
      setOrders(res)
    } else if (optionDate === 'normal') {
      setOrders(res)
    }
  }

  async function delivery(id) {
    try {
      MySwal.fire({
        title: <p>Realizando entrega</p>,
        showCloseButton: false,
        showConfirmButton: false
      })
      const res = await OrderSevice.putRequest(id, { state: 'entregado' })
      console.log(res)
      MySwal.close()
      MySwal.fire({
        title: <p>Entrega realizada exitosamente</p>,
        icon: 'success',
        showCloseButton: true,
      }).then(() => {
        MySwal.close()
      })
      const ress = await OrderSevice.getOrdersRequest()
      setAllOrders(ress)
      setOrders(ress)
    } catch (e) {
      console.log(e)
    }
  }

  async function cancel(id) {
    try {
      MySwal.fire({
        title: <p>Cancelando pedido...</p>,
        showCloseButton: false,
        showConfirmButton: false
      })
      const res = await OrderSevice.putRequest(id, { state: 'cancelado' })
      console.log(res)
      MySwal.close()
      MySwal.fire({
        title: <p>El pedido fue cancelado</p>,
        icon: 'success',
        showCloseButton: false,
        timer: 2000
      }).then(() => {
        window.location.href = `https://www.mercadopago.com.ar/refunds/confirm?opId=${res.paymentId}`
      })
      const ress = await OrderSevice.getOrdersRequest()
      setAllOrders(ress)
      setOrders(ress)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    async function getOrders() {
      setLoading(true)
      try {
        const res = await OrderSevice.getOrdersRequest()
        setAllOrders(orders)
        setOrders(res)
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }
    getOrders()
  }, [])

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='text-2xl text-gray-700 text-center w-full font-bold'>Administrar Pedidos</h2>
      </div>
      <div className='flex gap-4 justify-between'>
        <div className='flex gap-8'>
          <Button variant='outline' onClick={() => setShowPendieng(!showPending)}>
            {
              showPending
                ? 'Ver Todos'
                : 'Ver Pendientes'
            }
          </Button>
          <div className="flex">
            <label htmlFor="order-by" className="block mb-2 text-sm font-medium text-gray-900 ">
              Ordenar por Fecha
            </label>
            <select value={optionDate} onChange={(e) => setOptionDate(e.target.value)} id="order-by" className="focus:outline-red-500 text-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-400 block w-full p-2.5 bg-white hover:text-red-700 cursor-pointer border border-red-700">
              <option value='normal'>Normal</option>
              <option value="asc">Acendente</option>
              <option value="desc">Decendente</option>
            </select>
          </div>
          <Button onClick={filter}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
      <div>
        {
          loading
            ? <div className='flex justify-center py-8'>
              <Loader size={64} />
            </div>
            : orders.length === 0
              ? <div className='flex justify-center items-center text-primary text-xl font-medium py-8'>
                <p>No se encontraron pedidos</p>
              </div>
              : <div className='grid grid-cols-4 gap-4'>
                {
                  orders.map((o, i) => <OrderCard key={i} order={o} delivery={delivery} cancel={cancel} />)
                }
              </div>
        }
      </div>

    </div>
  )
}

function OptionClients() {

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getClients() {
      setLoading(true)
      try {
        const response = await ClientService.getAllRequest()
        setClients(response)
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }
    getClients()
  }, [])

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='text-2xl text-gray-700 text-center w-full font-bold'>Administrar Clientes</h2>
      </div>
      {
        loading
          ? <div className='flex justify-center py-8'>
            <Loader size={64} />
          </div>
          : clients.length === 0
            ? <div className='flex justify-center items-center text-primary text-xl font-medium py-8'>
              <p>No se encontraron clientes</p>
            </div>
            : <div className='flex flex-col gap-4'>
              {
                clients.map((c, i) => <ClientCard key={i} client={c} />)
              }
            </div>
      }
    </div>
  )
}

function OptionMain({ option }) {

  if (option === 'product')
    return <OptionProducts />

  if (option === 'order')
    return <OptionOrders />

  if (option === 'client')
    return <OptionClients />

  return (
    <div>
      <h2 className='text-2xl text-gray-700 text-center w-full font-bold'>Opcion no encontrada</h2>
    </div>
  )
}

function Admin() {

  // const [option, setOption] = useState(OPTIONS.NONE)

  const { option } = useParams()

  console.log(option)

  const secret = "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"

  return (
    <div className='py-32 w-[1536px] mx-auto'>
      <div className='flex gap-16'>
        <OptionsBar />
        <div className='w-full'>
          <OptionMain option={option} />
        </div>
      </div>
    </div>
  )
}

export default Admin