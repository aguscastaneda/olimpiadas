import React from 'react'
import Button from '../Button'
import Utilities from '../../utilities/Utilities'

function ProductCard({ product, setProductId = () => { }, showEditProduct = () => { }, onClickPause = () => {} }) {

  function handleEditClick() {
    setProductId(product.id)
    showEditProduct()
  }

  // function handlePauseClick() {
  //   showEditProduct()
  // }

  return (
    <div className='flex flex-col gap-4 justify-between border border-gray-700/40 p-4 rounded shadow'>
      <div className='flex items-center justify-start gap-4'>
        <div>
          <img className='min-w-16 min-h-16 max-w-16 max-h-16 object-cover rounded-full' src={product.image} alt={product.name} />
        </div>
        <div>
          <p className='text-base text-gray-700 font-medium'>{product.name}</p>
          <p className='text-xl text-gray-900 font-bold'>${Utilities.formatNumberToPrice(product.price)}</p>
        </div>
      </div>

      <div className='h-full flex gap-4 items-end'>
        <Button onClick={handleEditClick}>Editar</Button>
        <Button variant='outline' onClick={onClickPause}>Pausar</Button>
      </div>
    </div>
  )
}

export default ProductCard