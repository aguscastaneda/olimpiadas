import { useState, useEffect } from 'react'
import { useUser } from '../../contexts/UserContext'
import ClientService from '../../services/ClientService'
import Loader from 'react-spinners/ClipLoader'
import Title from '../../components/Title'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import OrderService from '../../services/OrderService'
import Utilities from '../../utilities/Utilities'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const STATES = {
  pendiente: 'pendiente de pago',
  aprovado: 'pago aprobado'
}

function OrderCard({ order, onClick = () => { }, loading }) {
  const firstProduct = order.products[0]
  const date = (new Date(order.date)).toLocaleDateString()

  return (
    <div className='flex flex-col md:flex-row p-0.5 border border-gray-900/20 rounded-md shadow-md'>
      <div>
        <img className='w-64 h-64' src={firstProduct.image} alt={firstProduct.name} />
      </div>
      <div className='flex flex-col justify-between py-4 px-8 gap-4'>
        <header className=''>
          <h4 className='text-2xl text-start font-bold mb-4'>Numero de pedido: {order.id}</h4>
          <p className='w-full flex justify-between gap-8'>Direccion de entrega: <strong className='text-end capitalize'>{order.address}</strong></p>
          <p className='w-full flex justify-between gap-8'>Fecha de emision: <strong className='text-end'>{date}</strong></p>
          <p className='w-full flex justify-between gap-8'>Estado del pedido: <strong className='text-end uppercase'>{order.state}</strong></p>
        </header>
        <div className='w-full h-0.5 bg-primary rounded-full my-2'></div>
        <section>
          {
            order.state === STATES.pendiente
              ? <Button className='w-full' onClick={onClick}>Cambiar direccion de entrega</Button>
              : <></>
          }
        </section>
        <footer className='flex justify-center flex-col items-center gap-2'>
          <Link to={`/order/${order.id}`} className=' hover:text-primary hover:underline'>Ver detalles del pedido</Link>
          {
            order.state === STATES.aprovado
              ? <Link className='hover:text-primary hover:underline text-center ' to={`https://www.mercadopago.com.ar/post-purchase/init-flow/setup?fulfilled=false&resource=payment&resource_id=${order.paymentId}`}>Cancelar Compra</Link>
              : <></>
          }
        </footer>
      </div>
    </div>
  )
}

function Order() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSetAddress, setLoadingSetAddress] = useState(false)
  const [error, setError] = useState(false)

  const user = useUser()

  function getHandleClick(order) {
    return async () => {
      setLoadingSetAddress(true)
      try {
        const MySwal = withReactContent(Swal)
        MySwal.fire({
          title: 'Ingrese la nueva direccion del pedido',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Confirmar',
          showLoaderOnConfirm: true,
          preConfirm: async (value) => {
            if (value !== '') {
              await OrderService.putRequest(order.id, { address: value })
              orders.find(o => o.id === order.id).address = value
              setOrders([...orders])
            } else {
              throw new Error('El valor ingresado no es valido')
            }
          }
        }).then(result => {
          if (result.isConfirmed) {
            MySwal.fire({
              title: 'El pedido se actualizo exitosamente',
              icon: 'success',
              showConfirmButton: false,
              showCancelButton: false,
              timer: 2000,
            })
          } else {
            MySwal.close()
          }
        }).catch((e) => {
          MySwal.close()
          MySwal.fire({
            title: `Error: ${e.message}`,
            icon: 'error',
            showConfirmButton: false,
            showCancelButton: false,
            timer: 2000,
          })
        })
      } catch (e) {
        console.log(e)
      }
      setLoadingSetAddress(true)
    }
  }

  useEffect(() => {
    async function getOrders() {
      setLoading(true)
      try {
        if (user.isClient()) {
          const orders = await ClientService.getOrders(user.id)
          setOrders(orders)
        }
      } catch (e) {
        console.log(e)
        setError(true)
      }
      setLoading(false)
    }
    getOrders()
  }, [user])

  return (
    <div className='min-h-[768px] py-32 px-8 md:px-0'>
      {
        loading
          ? <div className='flex justify-center'>
            <Loader size={64} color='#ed3237' />
          </div>
          : orders.length === 0
            ? <div className=''>
              <p className='text-2xl text-primary text-center font-semibold'>No has realizado pedidos por el momento</p>
            </div>
            : <div className='max-w-[1024px] mx-auto'>
              <header className='mb-16'>
                <Title className='text-center'>Pedidos realizados</Title>
              </header>
              <div className='flex flex-col justify-start items-center gap-4'>
                {
                  orders.map((o, i) => <OrderCard key={i} order={o} onClick={getHandleClick(o)} loading={loadingSetAddress} />)
                }
              </div>
            </div>
      }
    </div>
  )
}

export default Order