import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import ErrorMessage from '../../components/ErrorMessage'

function NotFound({ setNavbarActive }) {

  useEffect(() => {
    setNavbarActive(false)
    return () => {
      setNavbarActive(true)
    }
  }, [])

  return (
    <div className='py-64'>
      <ErrorMessage message='La pagina no existe' />
      <div className='not-found'>
        <Link to='/home' className='link'>
          <Button variant='outline'>
            Ir a inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound