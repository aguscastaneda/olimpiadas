import { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import Facebook from '../components/icons/Facebook'
import Linkedin from '../components/icons/Linkedin'
import Twitter from '../components/icons/Twitter'

function Footer() {

  const [message, setMessage] = useState()

  function handleChange(e) {
    const value = e.target.value
    setMessage(value)
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  return (
    <footer className='footer'>
      <div className='footer__content'>
        <section className='footer__main'>
          <Logo className='footer__logo' animation={false} />
          <nav className='footer__links'>
            <Link to='/home' className='footer__link'>Sobre Nosotros</Link>
            <Link to='/home' className='footer__link'>Servicios</Link>
            <Link to='/home' className='footer__link'>FAQ</Link>
            <Link to='/home' className='footer__link'>Contacto</Link>
          </nav>
          <article className='footer__contact'>
            <h4 className='footer__copy'>Contact us:</h4>
            <p className='footer__info'>Email: zona-atleta@gmail.com</p>
            <p className='footer__info'>Telefono: 554-433-2211</p>
            <p className='footer__info'>Ricardo Balbin 3462, Buenos Aires.</p>
          </article>
          <form className='footer__newsletter' onSubmit={handleSubmit}>
            <input value={message} className='footer__email' type='text' placeholder='Mensaje' onChange={handleChange} />
            <input className='footer__submit' type='submit' value='Enviar' />
          </form>
          <nav className='footer__social'>
            <Link className='footer__social-link'>
              <Linkedin className='footer__media' />
            </Link>
            <Link className='footer__social-link'>
              <Facebook className='footer__media' />
            </Link>
            <Link className='footer__social-link'>
              <Twitter className='footer__media' />
            </Link>
          </nav>
        </section>
        <div className='footer__copyright'>
          <p className='footer__copyright-text'></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer