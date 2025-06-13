import { useState, useEffect, useContext, createContext } from 'react'
import { useUser } from './UserContext'
import ClientService from '../services/ClientService'
import OrderService from '../services/OrderService'

const OrderManagerContext = createContext()

export function useOrderManager() {
  const context = useContext(OrderManagerContext)
  if (!context)
    throw new Error('Buy context not found')
  return context
}

export function OrderManagerContextProvider({ children }) {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  // const user = useUser()

  async function downloadCheck(id) {
    setLoading(true)
    if (loading) return
    try {
      await OrderService.getCheck(id)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  // useEffect(() => {

  //   async function getOrders() {
  //     setLoading(true)
  //     if (user.isNone()) return
  //     try {
  //       if (user.isClient()) {
  //         const res = await ClientService.getOrders(user.id)
  //         setOrders(res)
  //       } else if (user.isSalesManager()) {
  //         const res = await OrderService.getOrdersRequest()
  //         setOrders(res)
  //       }
  //     } catch (e) {
  //       console.log(e)
  //       setError(true)
  //       setMessage(e.response?.data.message)
  //     }
  //     setLoading(false)
  //   }
  //   getOrders()
  // }, [user])

  return (
    <OrderManagerContext.Provider value={{
      orders,
      loading,
      error,
      message,
      downloadCheck
    }}>
      {children}
    </OrderManagerContext.Provider>
  )
}