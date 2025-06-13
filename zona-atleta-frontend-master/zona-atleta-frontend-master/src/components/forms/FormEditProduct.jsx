import { useEffect, useState } from 'react'
import ProductService from '../../services/ProductService'
import Button from '../Button'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Input from '../Input'
import Loader from 'react-spinners/ClipLoader'

const MySwal = withReactContent(Swal)

function FormEditProduct({ productId }) {

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [error, setError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [available, setAvailable] = useState(false)

  function validate(name, price, stock) {
    return name !== '' && (price !== '' && (!isNaN(parseInt(price)))) && (stock !== '' && (!isNaN(parseInt(stock))))
  }

  function handleChangeName(e) {
    const value = e.target.value
    setName(value)
    setError(false)
    if (!validate(value, price, stock)) {
      setSubmitDisabled(true)
    } else {
      setSubmitDisabled(false)
    }
    if (value === '') {
      setName('')
    }
  }

  function handleChangeDescription(e) {
    const value = e.target.value
    setDescription(value)
    setError(false)
  }

  function handleChangePrice(e) {
    const value = e.target.value
    if (!validate(name, value, stock)) {
      setPrice('')
      setSubmitDisabled(true)
    } else {
      setSubmitDisabled(false)
    }
    if (!isNaN(parseInt(value))) {
      setPrice(value)
      setError(false)
    }
    if (value === '') {
      setPrice('')
    }
  }

  function handleChangeStock(e) {
    const value = e.target.value
    if (!validate(name, price, value)) {
      setStock('')
      setSubmitDisabled(true)
    } else {
      setSubmitDisabled(false)
    }
    if (!isNaN(parseInt(value))) {
      setStock(value)
      setError(false)
    }
    if (value === '') {
      setStock('')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      MySwal.fire({
        title: <p>Editando producto...</p>,
        icon: 'success',
        showCloseButton: false,
        showConfirmButton: false
      })
      const res = await ProductService.put(productId, {
        name,
        price,
        stock,
        description,
        available
      })
      setName(res.name)
      setPrice(res.price)
      setStock(res.stock)
      setAvailable(res.available)
      if (res.description !== null) {
        setDescription(res.description)
      }
      MySwal.close()
    } catch (e) {
      setError(true)
      setErrorMessage(e.response?.data.message)
      console.log(e)
    }
  }

  useEffect(() => {
    async function getProduct() {
      setLoading(true)
      try {
        const res = await ProductService.getProductByIdRequest(productId)
        setName(res.name)
        setPrice(res.price)
        setStock(res.stock)
        setAvailable(res.available)
        if (res.description !== null) {
          setDescription(res.description)
        }
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }
    getProduct()
  }, [])

  if (loading) {
    return <form className='form'>
      <div className='grid place-items-center'>
        <Loader size={64} />
      </div>
    </form>
  }
  return (
    <form className='form' onSubmit={handleSubmit}>
      <p className='form__title'>Editar Producto</p>
      {
        error
          ? <p className='form__error-message'>{errorMessage}</p>
          : <></>
      }
      <div className='form__input-container'>
        <Input value={name} onChange={handleChangeName} error={error} placeholder='Nombre' />
        <div className='flex gap-8'>
          <Input value={price} onChange={handleChangePrice} error={error} placeholder='Precio' />
          <Input value={stock} onChange={handleChangeStock} error={error} placeholder='Stock' />
        </div>
        <div className='flex items-center justify-start gap-2'>
          <label htmlFor='available' className='text-gray-700'>Disponible</label>
          <input id='available' type='checkbox' checked={available} onChange={() => setAvailable(!available)} />
        </div>
        <Input value={description} onChange={handleChangeDescription} error={error} placeholder='Descripcion' />
      </div>
      <Button type='submit' disabled={submitDisabled}>Editar Producto</Button>
    </form>
  )
}

export default FormEditProduct