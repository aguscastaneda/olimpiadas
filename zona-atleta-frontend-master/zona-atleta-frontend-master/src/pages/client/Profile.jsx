import { useState, useEffect, useRef } from 'react'
import { useUser } from '../../contexts/UserContext'
import ClientService from '../../services/ClientService'
import Loader from 'react-spinners/ClipLoader'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Edit from '../../components/icons/Edit'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

function FormConfirmedPassword({ client, setPassword: setPasswordState, setEdit, setConfirm }) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)

  function handleChangePassword(e) {
    const value = e.target.value
    setPassword(value)
    if (value === '') {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (disabled) return
    setLoading(true)
    try {
      // MySwal.fire({
      //   title: <p>Verificando Contraseña</p>,
      //   showCloseButton: false,
      //   showConfirmButton: false
      // })
      const res = await ClientService.confirmPassword(client.id, password)
      if (res.message === 'OK') {
        setPasswordState(password)
        setEdit(false)
        setConfirm(true)
        // MySwal.close()
        // MySwal.fire({
        //   title: <p>Contraseña Valida</p>,
        //   showCloseButton: false,
        //   showConfirmButton: false,
        // })
      } else {
        setError(true)
        setMessage(res.message)
        // MySwal.close()
        // MySwal.fire({
        //   title: <p>Contraseña Incorrecta</p>,
        //   showCloseButton: false,
        //   showConfirmButton: false,
        // })
      }
      // MySwal.close()
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <form className='max-w-96 mx-auto flex flex-col gap-4' onSubmit={handleSubmit}>
      {
        loading
          ? <div className='grid place-items-center py-8'>
            <Loader size={64} className='text-primary' color='#ed3237' />
          </div>
          : <>
            {
              disabled
                ? <p className='text-primary text-center font-semibold'>Ingrese su contrasenia para procesar la actualizacion</p>
                : <></>
            }
            <Input error={disabled} placeholder='Contraseña' type='password' value={password} onChange={handleChangePassword} />
            <Button type='submit' disabled={disabled}>Verificar</Button>
            {
              error
                ? <p className='text-lg text-primary text-center font-bold'>{message}</p>
                : <></>
            }
          </>
      }
    </form>
  )
}

function ButtonIcon({ children, onClick = () => { } }) {
  return (
    <button className='border-none outline-none bg-transparent' onClick={onClick} type='button'>
      {children}
    </button>
  )
}

function FormClient({ password, client }) {

  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState(client.username)
  const [email, setEmail] = useState(client.email)
  const [newPassword, setNewPassword] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [disabledUsername, setDisabledUsername] = useState(true)
  const [disabledEmail, setDisabledEmail] = useState(true)
  const [disabledNewPassword, setDisabledNewPassword] = useState(true)
  const usernameRef = useRef()
  const emailRef = useRef()
  const newPasswordRef = useRef()

  function handleChangeUsername(e) {
    const value = e.target.value
    setUsername(value)
  }

  function handleChangeEmail(e) {
    const value = e.target.value
    setEmail(value)
  }

  function handleChangeNewPassword(e) {
    const value = e.target.value
    setNewPassword(value)
  }

  function handleClickUsername(e) {
    usernameRef.current.disabled = !disabledUsername
    if (disabledUsername) {
      usernameRef.current.focus()
    }
    setDisabledUsername(!disabledUsername)
  }

  function handleClickEmail(e) {
    emailRef.current.disabled = !disabledEmail
    if (disabledEmail) {
      emailRef.current.focus()
    }
    setDisabledUsername(!disabledEmail)
  }

  function handleClickNewPassword(e) {
    newPasswordRef.current.disabled = !disabledNewPassword
    if (disabledNewPassword) {
      newPasswordRef.current.focus()
    }
    setDisabledNewPassword(!disabledNewPassword)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (disabled) return
    setLoading(true)
    try {
      const data = {
        username,
        email,
        newPassword,
        password
      }
      if (username === '') {
        data.username = undefined
      }
      if (email === '') {
        data.email = undefined
      }
      if (newPassword === '') {
        data.newPassword = undefined
      }
      const res = await ClientService.putByIdRequest(client.id, data)
      setDisabledUsername(true)
      setDisabledEmail(true)
      setDisabledNewPassword(true)
      console.log(data)
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  return (
    <form className='max-w-96 mx-auto flex flex-col gap-4' onSubmit={handleSubmit}>
      {
        loading
          ? <div className='grid place-items-center py-8'>
            <Loader size={64} color='#ed3237' />
          </div>
          : <>
            <Input reff={usernameRef} placeholder='Nombre de usuario' value={username} onChange={handleChangeUsername} icon={
              <ButtonIcon onClick={handleClickUsername}>
                <Edit className='fill-red-500 cursor-pointer' />
              </ButtonIcon>
            } />
            <Input reff={emailRef} disabled={disabledEmail} placeholder='Correo electronico' value={email} onChange={handleChangeEmail} icon={
              <ButtonIcon onClick={handleClickEmail}>
                <Edit className='fill-red-500 cursor-pointer' />
              </ButtonIcon>
            } />
            <Input reff={newPasswordRef} disabled={disabledNewPassword} placeholder='Nueva contraseña' type='password' value={newPassword} onChange={handleChangeNewPassword} icon={
              <ButtonIcon onClick={handleClickNewPassword}>
                <Edit className='fill-red-500 cursor-pointer' />
              </ButtonIcon>
            } />
            <Button type='submit' disabled={disabled}>Guardar</Button>
          </>
      }
    </form>
  )
}

function Profile() {

  const [client, setClient] = useState({})
  const [loading, setLoadig] = useState(true)
  const [confirm, setConfirm] = useState(false)
  const [edit, setEdit] = useState(false)
  const [password, setPassword] = useState('')

  const user = useUser()

  useEffect(() => {
    async function getClient() {
      setLoadig(true)
      try {
        const data = await ClientService.getByIdRequest(user.id)
        setClient(data)
      } catch (e) {
        console.log(e)
      }
      setLoadig(false)
    }
    getClient()
  }, [])

  return (
    <div className='max-w-[1024px] mx-auto py-32'>
      {
        loading
          ? <div className='flex justify-center py-16'>
            <Loader size={64} />
          </div>
          : <div className='profile'>
            <h1 className='text-4xl text-gray-900 text-center font-bold mb-8'>Bienvenido <span className='uppercase'>{client.username}</span>!</h1>
            <div className='flex flex-col justify-center items-center gap-8'>
              <Button onClick={() => {
                if (confirm) {
                  setEdit(false)
                  setConfirm(false)
                } else if (edit) {
                  setEdit(false)
                } else if (!edit) {
                  setEdit(true)
                }
              }} >
                {
                  edit || confirm
                    ? 'Ocultar Perfil'
                    : 'Actualizar Perfil'
                }
              </Button>
              <div className='w-full'>
                {
                  edit
                    ? <FormConfirmedPassword client={client} setPassword={setPassword} setEdit={setEdit} setConfirm={setConfirm} />
                    : <></>
                }
                {
                  confirm
                    ? <FormClient client={client} password={password} />
                    : <></>
                }
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default Profile