import { useState } from 'react'
import { Link } from 'react-router-dom'
import Xmark from '../components/icons/Xmark'
import ChatboxIcon from '../components/icons/ChatbotIcon'
import { useUser } from '../contexts/UserContext'

const CLIENT_OPTIONS = [
  '',
  ''
]

const SALES_MANAGR_OPTIONS = [
  {
    name: 'Crear productos',
    response: 'Para crear productos entre al siguiente enlace.',
    link: '/admin/product'
  },
  {
    name: 'Cancelar ordenes',
    response: 'Para cancelar ordenes entre al siguiente enlace.',
    link: '/admin/order'
  },
  {
    name: 'Administrar usuarios',
    response: 'Para administrar usuarios entre al siguiente enlace.',
    link: '/admin/client'
  },
  {
    name: 'Descargar facturas',
    response: 'Para descargar facturas entre al siguiente enlace.',
    link: '/admin/order'
  },
  {
    name: 'Seguimiento de ventas',
    response: 'Para ver el seguimiento entre al siguiente enlace.',
    link: '/admin/order'
  }
]

const TYPES_MESSAGES = {
  NORMAL: 0,
  RESPONSE: 1
}

function ChatbotOption({ option, onClick }) {
  return (
    <p className='chatbot__option' onClick={onClick}>. {option}</p>
  )
}

function ChatbotOptions({ options, createMessage }) {
  return (
    <div className='chatbot__options'>
      {
        SALES_MANAGR_OPTIONS.map((o, i) => <ChatbotOption key={i} option={o.name} onClick={() => createMessage(o.response, o.link)} />)
      }
    </div>
  )
}


function ChatbotMessage({ type, message, link }) {

  if (type === TYPES_MESSAGES.NORMAL)
    return (
      <p className='chatbot__message'>
        {message}
      </p>
    )

  return (
    <>
      <p className='chatbot__message'>
        {message}
      </p>
      <Link className='chatbot__link' to={link}>. Enlaze .</Link>
    </>
  )
}


function Chatbot() {

  const [active, setActive] = useState(false)
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')

  const user = useUser()

  function handleClick() {
    setActive(!active)
  }

  function createMessage(message, link) {
    setMessage(message)
    setLink(link)
  }

  if (user.isSalesManager())
    return (
      <div className='chatbot'>
        <div style={{ display: active ? 'none' : 'grid' }} className='chatbot__start' onClick={handleClick}>
          <ChatboxIcon />
        </div>
        <div style={{ display: active ? 'block' : 'none' }} className='chatbot__messages'>
          <button className='chatbot__close-message' onClick={handleClick}><Xmark /></button>
          <div className='chatbot__messages-container'>
            <ChatbotMessage type={TYPES_MESSAGES.NORMAL} message='Hola Buen dia!, en que puedo ayudarte?' />
            <ChatbotOptions options={SALES_MANAGR_OPTIONS} createMessage={createMessage} />
            {
              message !== ''
                ? <ChatbotMessage type={TYPES_MESSAGES.RESPONSE} message={message} link={link} />
                : <></>
            }
          </div>
        </div>
      </div>
    )

  return (
    <></>
  )
}

export default Chatbot