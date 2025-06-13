function ProductFilterOrder({ value, onChange }) {
  return (
    <select className='product-filter__container' value={value} onChange={onChange}>
      <option value='relevant'>Relevancia</option>
      <option value='plus'>Mayor</option>
      <option value='minus'>Menor</option>
    </select>
  )
}

export default ProductFilterOrder