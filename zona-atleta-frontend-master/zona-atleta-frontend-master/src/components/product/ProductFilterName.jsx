import Search from '../icons/Search'
import { useNavigate } from 'react-router-dom'

function ProductFilterName({ value, onChange }) {

  const navigate = useNavigate()

  return (
    <form className='searchbar' onSubmit={(e) => {
      e.preventDefault()
      console.log(value)
      navigate(`/product?name=${value}`)
    }}>
      <input className='searchbar__input' value={value} type='text' onChange={onChange} placeholder='Buscar productos' />
      <Search className='searchbar__icon' />
    </form>
  )
}

export default ProductFilterName