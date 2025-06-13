import { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import OrderService from '../../services/OrderService'
import PageLoader from '../../components/loader/PageLoader'
import ErrorMessage from '../../components/ErrorMessage'
import { useOrderManager } from '../../contexts/OrderManager'
import Utilities from '../../utilities/Utilities'
import Input from '../../components/Input'
import Button from '../../components/Button'
import OrderMessageService from '../../services/OrderMessageService'
import Loader from 'react-spinners/ClipLoader'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function OrderMessage({ om }) {
  return <div className='flex flex-col border border-primary rounded-3xl rounded-br-none px-4 py-2'>
    <div className='flex gap-4 justify-between items-center'>
      <p className='text-xl'>{om.message}</p>
      <p>{om.view ? 'visto' : 'no visto'}</p>
    </div>
  </div>
}

function OrderMessageSalesManager({ om }) {
  return <div className='flex flex-col bg-primary rounded-3xl rounded-tl-none px-4 py-2 text-white'>
    <div className='flex gap-4 justify-between items-center'>
      <p className='text-xl'>{om.message}</p>
      <p>{om.view ? 'visto' : 'no visto'}</p>
    </div>
  </div>
}

function ProductCard({ product }) {
  return (
    <div className='flex justify-start items-center gap-4'>
      <img className='w-16 h-16 bg-primary' src={`${BACKEND_URL}${product.image}`} alt={product.name} />
      <div>
        <p className='text-lg'>{product.name}</p>
        <p>Cantidad: {product.amount}</p>
        <p>Precio unitario: ${product.price}</p>
      </div>
    </div>
  )
}

function ProductList({ products }) {

  const total = products.reduce((acum, p) => acum + (p.price * p.amount), 0)

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h4 className='text-xl font-bold'>Productos</h4>
      </div>
      <div className=''>
        {
          products.map((p, i) => <ProductCard key={i} product={p} />)
        }
      </div>
      <div>
        <p className='font-bold text-2xl text-end'>Total ${total}</p>
      </div>
    </div>
  )
}

function OrderLayout({ order }) {

  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [state, setState] = useState(order.state)
  const containerRef = useRef()

  const { editOrder } = useOrderManager()
  const user = useUser()

  const allOptions = ['cancelado', 'pendiente', 'confirmado', 'en camino']
  const options = allOptions.filter(option => option !== order.state)

  async function addMessage() {
    if (value === '') {
      setError(true)
      return
    }
    let vendedor = false
    if (user.isSalesManager()) {
      vendedor = true
    }
    const res = await OrderMessageService.post({ orderId: order.id, message: value, vendedor })
    console.log(res)
  }

  function handleChange(e) {
    setState(e.target.value)
  }

  async function handleClick() {
    try {
      await editOrder(order, { state })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.clientHeight
    async function update() {
      if (user.isSalesManager()) {
        await OrderMessageService.put({ orderId: order.id, vendedor: false })
      } else {
        await OrderMessageService.put({ orderId: order.id, vendedor: true })
      }
    }
    update()
  }, [])


  return (
    <div className='flex justify-between gap-8'>
      <div className='flex flex-col shadow-xl gap-4 px-4 py-2 rounded-md border-2 border-primary'>
        <p className='text-2xl font-medium flex justify-between items-center gap-8'>Numero de pedido: <span className='text-end font-light'> {order.id}</span></p>
        <p className='text-xl font-medium flex justify-between items-center gap-8'>Metodo de pago: <span className='text-end font-light'> {order.paymentMethod}</span></p>
        <p className='text-xl font-medium flex justify-between items-center gap-8'>Id de pago: <span className='text-end font-light'> {order.paymentId}</span></p>
        <p className='text-xl font-medium flex justify-between items-center gap-8'>Direccion de entrega: <span className='text-end font-light'> {order.address}</span></p>
        <p className='text-xl font-medium flex justify-between items-center gap-8'>Fecha de creacion: <span className='text-end font-light'> {order.date}</span></p>
        <p className='text-xl font-medium flex justify-between items-center gap-8'>Estado del pedido: <span className='text-end font-light'> {order.state}</span></p>
        <ProductList products={order.products} />
        <Link className='bg-primary text-white font-bold px-4 py-2 rounded-md shadow-2xl text-center' to={`${BACKEND_URL}/api/order/${order.id}/check`}>
          Descargar Factura
        </Link>
        <br />
        {
          user.isSalesManager()
            ? <div className='flex items-center justify-between'>
              <label htmlFor="select-state">Cambiar estado</label>
              <select className='bg-transparent' id='select-state' onChange={handleChange}>
                <option value={order.state}>{order.state}</option>
                {
                  options.map((o, i) => <option key={i} value={o}>{o}</option>)
                }
              </select>
              <button className='bg-primary text-white font-bold px-4 py-2 rounded-md shadow-2xl text-center' onClick={handleClick} >Confirmar cambios</button>
            </div>
            : <></>
        }
      </div>
      <div className='w-1/2 flex flex-col gap-8'>
        <div ref={containerRef} className='flex flex-col gap-4 max-h-60 overflow-auto px-4'>
          {
            !user.isSalesManager()
              ? order.orderMessages.map((om, i) => {
                if (om.vendedor) {
                  return <OrderMessageSalesManager key={i} om={om} />
                }
                return <OrderMessage key={i} om={om} />
              })
              : order.orderMessages.map((om, i) => {
                if (om.vendedor) {
                  return <OrderMessage key={i} om={om} />

                }
                return <OrderMessageSalesManager key={i} om={om} />
              })
          }
        </div>
        <div className='flex flex-col justify-center items-center gap-4'>
          <Input autoComplete={false} value={value} onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
            placeholder='Escriba un mensaje'
          />
          {
            error
              ? <p className='font-bold text-primary text-lg'>Por favor escriba algo</p>
              : <></>
          }
          <Button onClick={async () => {
            await addMessage()
            console.log('enviando mensaje')
          }}>Enviar Mensaje</Button>

        </div>
      </div>
    </div>
  )
}

function OrderDetails() {

  const [order, setOrder] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const { id } = useParams()

  // useEffect(() => {
  //   async function getOrderById() {
  //     setLoading(true)
  //     try {
  //       const response = await OrderService.getByIdRequest(id)
  //       console.log(response)
  //       setOrder(response)
  //     } catch (e) {
  //       console.log(e)
  //       setError(true)
  //     }
  //     setLoading(false)
  //   }
  //   getOrderById()
  // }, [])
  useEffect(() => {
    console.log(id)
    async function getOrder() {
      try {
        const data = await OrderService.getByIdRequest(parseInt(id))
        console.log(data)
        setOrder(data)
      } catch (e) {
        console.log(e)
      }
    }
    getOrder()
  }, [])

  return (
    <div className='order-details max-w-[1536px] mx-auto flex justify-center items-center py-28'>
      {
        loading
          ? <PageLoader />
          : error
            ? <ErrorMessage message='Error de servidor' />
            : order.id !== undefined
              ? <OrderLayout order={order} />
              : <></>
      }
    </div>
  )
}

export default OrderDetails