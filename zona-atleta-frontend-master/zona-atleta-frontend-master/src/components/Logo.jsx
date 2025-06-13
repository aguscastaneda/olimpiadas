import Volleyball from './icons/Volleyball'
import Soccer from './icons/Soccer'
import Football from './icons/Football'
import Baseball from './icons/Baseball'
import BaseballBat from './icons/BaseballBat'
import Basket from './icons/Basket'
import Utilities from '../utilities/Utilities'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'

function Icon({ current }) {
  if (current === 0) {
    return <Volleyball className='logo-icon' />
  } else if (current === 1) {
    return <Football className='logo-icon' />
  } else if (current === 2) {
    return <Baseball className='logo-icon' />
  } else if (current === 3) {
    return <BaseballBat className='logo-icon' />
  } else if (current === 4) {
    return <Basket className='logo-icon' />
  } else {
    return <Soccer className='logo-icon' />
  }
}

function Logo({ className = '', animation = true }) {

  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (animation) {
      const id = setInterval(() => {
        const n = Utilities.random(5)
        if (n !== current) {
          setCurrent(n)
        }
      }, 2000)
      return () => {
        clearInterval(id)

      }
    }
  }, [])

  return (
    <Link className={`link logo uppercase ${className}`} to='/home'>
      Zona Atleta
      {
        animation
          ? <div className='logo-icon__container'>
            <Icon current={current} />
          </div>
          : <></>
      }
    </Link>
  )
}

export default Logo