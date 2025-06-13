import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import Validator from '../../utilities/Validator'
import Button from '../Button'
import Input from '../Input'

function FormRegisterSalesManager() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const { registerSalesManager } = useUser()
  const navigate = useNavigate()

  function handleChangeUsername(e) {
    const value = e.target.value
    setUsername(value)
    setError(false)
    if (Validator.validateRegisterSalesManager(value, password, passwordRepeat)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setSubmitDisabled(true)
    }
  }

  function handleChangePassword(e) {
    const value = e.target.value
    setPassword(value)
    setError(false)
    if (Validator.validateRegisterSalesManager(username, value, passwordRepeat)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setSubmitDisabled(true)
    }
  }

  function handleChangePasswordRepeat(e) {
    const value = e.target.value
    setPasswordRepeat(value)
    setError(false)
    if (Validator.validateRegisterSalesManager(username, password, value)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setSubmitDisabled(true)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await registerSalesManager({ username, password })
      navigate('/home')
    } catch (e) {
      setError(true)
      setErrorMessage(e.response.data.message)
      console.log(e)
    }
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      <div>
        <h2 className='text-3xl mb-4'>Nuevo Jefe de Ventas</h2>
        {
          error
            ? <p className='text-red-500 mb-2 text-center'>{errorMessage}</p>
            : <></>
        }
      </div>
      <div className='flex flex-col gap-6'>
        <Input error={error} placeholder='Nombre de usuario' value={username} onChange={handleChangeUsername} />
        <Input error={error} placeholder='Contraseña' type='password' value={password} onChange={handleChangePassword} />
        <Input error={error} placeholder='Repetir Contraseña' type='password' value={passwordRepeat} onChange={handleChangePasswordRepeat} />
        <Button type='submit' disabled={submitDisabled}>Crear</Button>
      </div>
    </form>
  )
}

export default FormRegisterSalesManager