import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../../contexts/UserContext'
import Validator from '../../utilities/Validator'
import Button from '../Button'
import Input from '../Input'
import Loader from 'react-spinners/ClipLoader'

function FormRegister() {

  const [loading, setLoading] = useState(false)
  const [waitingVerification, setWaitingVerification] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(true)

  const { validateRegister, register, createVerifyCode, validateVerifyCode, sendEmailVerifyCode } = useUser()
  const navigate = useNavigate()

  function handleChangeUsername(e) {
    const value = e.target.value
    setUsername(value)
    setError(false)
    if (Validator.validateRegister(value, email, password, passwordRepeat)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setSubmitDisabled(true)
    }
  }

  function handleChangeEmail(e) {
    const value = e.target.value
    setEmail(value)
    setError(false)
    if (Validator.validateRegister(username, value, password, passwordRepeat)) {
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
    if (Validator.validateRegister(username, email, value, passwordRepeat)) {
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
    if (Validator.validateRegister(username, email, password, value)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setSubmitDisabled(true)
    }
  }

  function handleChangeCode(e) {
    const value = e.target.value
    if (value === '') {
      setCode('')
    } else if (
      (!isNaN(parseInt(value)))
      && (!isNaN(parseInt(value[value.length - 1])))
      && (value.length < 5)) {
      setCode(value)
    }
  }

  async function handleClickVerifyCode() {
    setLoading(true)
    try {
      await validateVerifyCode({ code })
      await register({ username, email, password })
      navigate('/home')
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await validateRegister({ username, email })
      await createVerifyCode()
      await sendEmailVerifyCode({ email })
      setWaitingVerification(true)
    } catch (e) {
      setError(true)
      setErrorMessage(e.response.data.message)
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      {
        loading
          ? <div className='w-full h-64 flex justify-center items-center'>
            <Loader color='red' size={64} />
          </div>
          : waitingVerification
            ? <div className='min-h-64 flex flex-col justify-center items-center gap-4'>
              <p className='text-center font-semibold text-gray-900/80'>Ingrese el codigo de verificacion enviado a su correo</p>
              <Input autoComplete={false} label={false} value={code} onChange={handleChangeCode} placeholder='Codigo de verificacion' />
              <Button onClick={handleClickVerifyCode}>Verificar codigo</Button>
            </div>
            : <>
              <div>
                <h2 className='text-3xl mb-4'>Crear Cuenta</h2>
                {
                  error
                    ? <p className='text-red-500 mb-2 text-center'>{errorMessage}</p>
                    : <></>
                }
              </div>
              <div className='flex flex-col gap-6'>
                <Input error={error} placeholder='Nombre de usuario' value={username} onChange={handleChangeUsername} />
                <Input error={error} placeholder='Correo electronico' value={email} onChange={handleChangeEmail} />
                <Input error={error} placeholder='Contraseña' type='password' value={password} onChange={handleChangePassword} />
                <Input error={error} placeholder='Repetir Contraseña' type='password' value={passwordRepeat} onChange={handleChangePasswordRepeat} />
                <Button type='submit' disabled={submitDisabled}>Crear Cuenta</Button>
              </div>
              <p className='text-center mt-2'>
                Tienes una cuenta? <Link className='text-red-700 hover:underline' to='/login'>Inicia sesion aqui</Link>
              </p>
            </>
      }
    </form>
  )
}

export default FormRegister