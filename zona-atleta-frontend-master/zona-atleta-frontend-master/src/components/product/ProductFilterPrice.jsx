function ProductFilterPrice({ start, end, onChangePlus, onChangeMinus, onClick }) {

  const error = start > end

  return (
    <div className='product-filter__container'>
      <div className='product-filter__container-input'>
        <p>Desde:</p>
        <input value={`$${start === 0 ? '' : start}`} className={`product__filter-range-input ${error ? 'error' : ''}`} type='text' placeholder={`$${start}`} onChange={onChangeMinus} onClick={onClick} />
      </div>
      <div className='product-filter__container-input'>
        <p>Hasta:</p>
        <input value={`$${end === 0 ? '' : end}`} className={`product__filter-range-input ${error ? 'error' : ''}`} type='text' placeholder={`$${end}`} onChange={onChangePlus} onClick={onClick} />
      </div>
    </div>
  )
}

export default ProductFilterPrice