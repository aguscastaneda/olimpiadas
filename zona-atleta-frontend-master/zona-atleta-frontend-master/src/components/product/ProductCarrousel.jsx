import { useState, useEffect } from 'react'
import ArrowLeft from '../icons/ArrowLeft'
import ArrowRight from '../icons/ArrowRight'

function ProductCarrousel({ hiddenBtns = false }) {

  const [index, setIndex] = useState(0)
  const [loader, setLoader] = useState(false)
  const [direccion, setDireccion] = useState(0)

  const right = 1
  const left = -1
  const images = [
    'pelotas.jpg',
    'labtop.jpg',
    'celular.jpg',
    'baseball-ball.jpg',
    'baseball-bate.jpg',
    'basketball.jpg',
    'baseball.jpg'
  ]

  function previous() {
    setLoader(false)
    setDireccion(left)
    setTimeout(() => {
      const condition = index > 0
      const nextIndex = condition ? index - 1 : images.length - 1
      setIndex(nextIndex)
    }, 1000)
  }

  function next() {
    setLoader(false)
    setDireccion(right)
    setTimeout(() => {
      const condition = index < images.length - 1
      const nextIndex = condition ? index + 1 : 0
      setIndex(nextIndex)
    }, 1000)
  }

  useEffect(() => {
    if (loader) {
      setTimeout(() => {
        if (direccion === 0) {
          next()
        } else if (direccion === right) {
          previous()
        } else {
          next()
        }
      }, 5000)
      // clearTimeout(id)
    }
  }, [loader])

  if (hiddenBtns)
    return (
      <div className='product-carrousel'>
        <img
          src={`imgs/${images[index]}`}
          alt='Chapy Pengu'
          className={`${loader ? 'loader' : ''} ${direccion === right ? 'loader-right' : 'loader-left'}`}
          onLoad={() => setLoader(true)}
        />
      </div>
    )

  return (
    <div className='product-carrousel'>
      <button className='left' onClick={previous}>
        <ArrowLeft />
      </button>
      <img src={`imgs/${images[index]}`} alt='Chapy Pengu' className={`${loader ? 'loader' : ''} ${direccion === right ? 'loader-right' : 'loader-left'}`} onLoad={() => setLoader(true)} />
      <button className='right' onClick={next}>
        <ArrowRight />
      </button>
    </div>
  )
}

export default ProductCarrousel