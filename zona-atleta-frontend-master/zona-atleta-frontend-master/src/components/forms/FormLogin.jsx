import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import GoogleButton from 'react-google-button'
import { useUser } from '../../contexts/UserContext'
import Validator from '../../utilities/Validator'
import Button from '../Button'
import Input from '../Input'
import Lock from '../icons/Lock'
import User from '../icons/User'
import Loader from 'react-spinners/ClipLoader'

function FormLogin() {

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [client, setClient] = useState(true)

  const { login, loginSalesManager, googleLogin } = useUser()

  const navigate = useNavigate()

  function handleChangeUsername(e) {
    const value = e.target.value
    setUsername(value)
    setError(false)
    if (Validator.validateLogin(value, password)) {
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
    if (Validator.validateLogin(username, value)) {
      setSubmitDisabled(false)
    } else {
      setSubmitDisabled(true)
    }
    if (value === '') {
      setSubmitDisabled(true)
    }
  }

  function handleClick() {
    setClient(!client)
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (res) => {
      setLoading(true)
      try {
        await googleLogin(res.access_token)
      } catch (e) {
        setError(true)
        setErrorMessage(e.message)
        console.log(e)
      }
      setLoading(false)
    },
    onError: (err) => {
      setError(true)
      setErrorMessage(err.message)
      console.log(err)
    }
  })

  function handleSubmit(e) {
    e.preventDefault()
    async function postLogin() {
      setLoading(true)
      try {
        if (client) {
          await login({ username, password })
          navigate('/home')
        } else {
          await loginSalesManager({ username, password })
          navigate('/home')
        }
      } catch (e) {
        console.log(e)
        setError(true)
        setErrorMessage(e.response?.data.message)
      }
      setLoading(false)
    }
    postLogin()
  }

  return (
    <form className='form' onSubmit={handleSubmit}>
      {
        loading
          ? <div className='w-full h-64 flex justify-center items-center'>
            <Loader color='#ed3237' size={64} />
          </div>
          : <>
            <div>
              <h2 className='text-3xl mb-4'>Inicio de sesion</h2>
              {
                error
                  ? <p className='text-red-500 mb-2 text-center'>{errorMessage}</p>
                  : <></>
              }
            </div>
            <div className='flex flex-col gap-8'>
              <Input error={error} placeholder='Nombre de usuario' value={username} onChange={handleChangeUsername} icon={<User />} />
              <Input error={error} placeholder='Contraseña' type='password' value={password} onChange={handleChangePassword} icon={<Lock />} />
            </div>
            <div className='flex justify-between'>
              <div className='flex items-center gap-2'>
                <label htmlFor='login-remember'>Recordar</label>
                <input id='login-remember' type='checkbox' />
              </div>
              <Link className='text-red-700 hover:underline'>Olvido su contraseña?</Link>
            </div>
            <Button type='submit' disabled={submitDisabled}>Iniciar Sesion</Button>
            <GoogleButton
              style={{
                display: 'block',
                padding: '0',
                margin: '.5rem auto',
                borderRadius: '.375rem'
              }}
              type='light'
              onClick={handleGoogleLogin}
            />
            <div className='flex flex-col items-center gap-4'>
              <p className='login-not-have-account'>No tienes una cuenta? <Link className='text-red-700 hover:underline' to='/register'>Registrate</Link></p>
              <p className='text-red-500 cursor-pointer hover:underline hover:text-red-700' onClick={handleClick}>
                {
                  client
                    ? 'Entrar como jefe de ventas'
                    : 'Entrar como cliente'
                }
              </p>
            </div>
          </>
      }
    </form>
  )
}

export default FormLogin