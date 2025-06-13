import { useEffect, useState } from 'react'
import ProductService from '../../services/ProductService'
import CategoryService from '../../services/CategoryService'
import Button from '../Button'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Input from '../Input'
const MySwal = withReactContent(Swal)

function FormProduct() {

  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState(0)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [image, setImage] = useState('')
  const [percentage, setPercentage] = useState('')
  const [gender, setGender] = useState('unisex')
  const [error, setError] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const [categories, setCategories] = useState([])

  function validate(name, price, stock, image) {
    return name !== '' && price !== '' && stock !== '' && image.length !== 0
  }

  function handleChangeName(e) {
    const value = e.target.value
    if (validate(value, price, stock, image)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    setName(value)
    setError(false)
  }

  function handleChangeCategory(e) {
    const value = e.target.value
    setCategoryId(value)
    setError(false)
  }

  function handleChangeGender(e) {
    const value = e.target.value
    setGender(value)
    setError(false)
  }

  function handleChangeDescription(e) {
    const value = e.target.value
    setDescription(value)
    setError(false)
  }

  function handleChangePrice(e) {
    const value = e.target.value
    if (validate(name, value, stock, image)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setPrice('')
      setSubmitDisabled(true)
    }
    if ((value !== '0') && !isNaN(parseInt(value))) {
      setPrice(value)
      setError(false)
    }
  }

  function handleChangeStock(e) {
    const value = e.target.value
    if (validate(name, price, value, image)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setStock('')
      setSubmitDisabled(true)
    }
    if ((value !== '0') && !isNaN(parseInt(value))) {
      setStock(value)
      setError(false)
    }
  }

  function handleChangePercentage(e) {
    const value = e.target.value
    if (value === '') {
      setPercentage('')
    }
    if ((value.length < 3) && (value !== '0') && (!isNaN(parseInt(value)))) {
      setPercentage(value)
      setError(false)
    }
  }

  function handleChangeImage(e) {
    const value = e.target.files
    if (validate(name, price, stock, value)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    setImage(value)
    setError(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      MySwal.fire({
        title: <p>Creando producto...</p>,
        icon: 'success',
        showCloseButton: false,
        showConfirmButton: false
      })
      const formData = new FormData()
      formData.append('name', name)
      formData.append('categoryId', categoryId)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)
      formData.append('image', image[0])
      formData.append('percentage', percentage)
      formData.append('gender', gender)
      const newProduct = await ProductService.postProductRequest(formData)
      MySwal.close()
    } catch (e) {
      setError(true)
      setErrorMessage(e.response?.data.message)
      console.log(e)
    }
  }

  useEffect(() => {
    async function getCategories() {
      try {
        const data = await CategoryService.getCategoriesRequest()
        setCategories(data)
        if (data.length > 0) {
          setCategoryId(data[0].id)
        }
      } catch (e) {
        console.log(e)
      }
    }
    getCategories()
  }, [])

  return (
    <form className='form' onSubmit={handleSubmit}>
      <p className='form__title'>Nuevo Producto</p>
      {
        error
          ? <p className='form__error-message'>{errorMessage}</p>
          : <></>
      }
      <div className='form__input-container'>
        <Input value={name} onChange={handleChangeName} error={error} placeholder='Nombre' />
        <div className='flex gap-4'>
          <div className='w-full'>
            <Input value={price} onChange={handleChangePrice} error={error} placeholder='Precio' />
          </div>
          <div className='w-full'>
            <Input value={stock} onChange={handleChangeStock} error={error} placeholder='Stock' />
          </div>
          <div className='w-full flex justify-center items-start h-full rounded-md flex-col  '>
            <label className='block text-gray-700 font-bold mb-2' htmlFor='form-category'>Categoria</label>
            <select id='form-category' className='bg-transparent shadow appearance-none border rounded w-full py-3 px-5 text-gray-700 leading-tight focus:outline-red-400 focus:shadow-outline' onChange={handleChangeCategory}>
              {
                categories.map((c, i) => <option key={i} value={c.id}>{c.name}</option>)
              }
            </select>
          </div>
        </div>
        <Input value={description} onChange={handleChangeDescription} error={error} placeholder='Descripcion (Opcional)' />
        <div className='flex flex-col gap-8'>
          <div className='flex justify-between items-center flex-row-reverse gap-8'>
            <div className='flex justify-center items-start h-full rounded-md flex-col w-full '>
              <label className='block text-gray-700 font-bold mb-2' htmlFor='form-gender'>Genero</label>
              <select value={gender} id='form-gender' className='bg-transparent shadow appearance-none border rounded w-full py-3 px-5 text-gray-700 leading-tight focus:outline-red-400 focus:shadow-outline' onChange={handleChangeGender}>
                <option value={'unisex'}>Unisex</option>
                <option value={'man'}>Hombre</option>
                <option value={'womain'}>Mujer</option>
                <option value={'kid'}>Chico</option>
              </select>
            </div>
            <div className='w-full'>
              <Input value={percentage} onChange={handleChangePercentage} error={error} placeholder='Descuento (Opcional)' />
            </div>
          </div>
          <div className='flex flex-col'>
            <label className='block text-gray-700 font-bold mb-2' htmlFor='register-password-repeat'>Imagen</label>
            <input className='shadow appearance-none border rounded w-full py-3 px-5 text-gray-700 leading-tight focus:outline-red-400 focus:shadow-outline' id='register-password-repeat' onChange={handleChangeImage} type='file' placeholder=' ' required />
          </div>
        </div>
      </div>
      <Button type='submit' disabled={submitDisabled}>Crear Producto</Button>
    </form>
  )
}

export default FormProduct