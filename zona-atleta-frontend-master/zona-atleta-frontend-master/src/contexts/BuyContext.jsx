import { useState, useContext, createContext, useEffect } from 'react'
import { useUser } from './UserContext'
import ClientService from '../services/ClientService'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const BuyContext = createContext()

export function useBuy() {
  const context = useContext(BuyContext)
  if (!context)
    throw new Error('Buy context not found')
  return context
}

export function BuyContextProvider({ children }) {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')

  const user = useUser()

  async function addProduct(product) {
    if (!user.isClient()) return
    try {
      const data = await ClientService.postProduct(user.id, product.id, { amount: 1 })
      const res = await ClientService.getProducts(user.id)
      setProducts(res)
      // setProducts([...product, product])
    } catch (e) {
      console.log(e)
    }
  }


  async function deleteProduct(product) {
    if (!user.isClient()) return
    const data = await ClientService.deleteProduct(user.id, product.id)
    const res = await ClientService.getProducts(user.id)
    setProducts(res)
  }


  async function editProduct(product, { amount }) {
    if (!user.isClient()) return
    const data = await ClientService.putProduct(user.id, product.id, { amount })
    const res = await ClientService.getProducts(user.id)
    setProducts(res)
  }


  async function buyOne(product) {
    if (!user.isClient()) return
    Swal.fire({
      title: "Ingrese la direccion del pedido",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      showLoaderOnConfirm: true,
      preConfirm: async (value) => {
        const data = await ClientService.postOrderByOneProduct(user.id, product.id, {
          paymentMethod: 'Mercado Pago',
          address: value,
          amount: 1
        })
        return data
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `El pedido se creo exitosamente`,
          icon: 'success',
          showConfirmButton: true,
          showCancelButton: false,
          timer: 2000
        }).then(() => {
          window.location.href = result.value.redirectUrl
        })
      }
    });
  }


  async function buy() {
    if (!user.isClient()) return
    MySwal.fire({
      title: <p>Creando pedido...</p>,
      showCloseButton: false,
      showConfirmButton: false
    })
    const data = await ClientService.postOrderByManyProduct(user.id, {
      paymentMethod: 'Mercado Pago',
      address: 'Balbin 3219',
      amount: 1
    })
    setTimeout(() => {
      window.location.href = data.redirectUrl
    }, 500)
  }

  function haveProduct(product) {
    const found = products.find(p => parseInt(p.id) === parseInt(product.id))
    if (found)
      return true
    return false
  }

  useEffect(() => {

    async function getProducts() {
      setLoading(true)
      if (!user.isClient()) return
      try {
        const res = await ClientService.getProducts(user.id)
        setProducts(res)
        console.log(res)
      } catch (e) {
        console.log(e)
        setError(true)
        setMessage(e.response?.data.message)
      }
      setLoading(false)
    }
    getProducts()
  }, [user])

  return (
    <BuyContext.Provider value={{
      products,
      loading,
      error,
      message,
      addProduct,
      deleteProduct,
      editProduct,
      buyOne,
      buy,
      haveProduct,
      setProducts
    }}>
      {children}
    </BuyContext.Provider>
  )
}