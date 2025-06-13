import { useParams, useNavigate } from 'react-router-dom'
import Button from '../Button'
import ArrowRight from '../icons/ArrowRight'
import ArrowLeft from '../icons/ArrowLeft'

function ProductNextPage() {

  const navigate = useNavigate()
  const { page } = useParams()

  function handleClickPrevious() {
    if (page !== undefined && parseInt(page) - 1 > 0) {
      navigate(`/home/page/${parseInt(page) - 1}`)
    }
  }

  function handleClickNext() {
    if (page === undefined) {
      navigate(`/home/page/${2}`)
    } else {
      navigate(`/home/page/${parseInt(page) + 1}`)
    }
  }

  return (
    <div className='product-next-page-container'>
      <Button className='product-next-page__btn' onClick={handleClickPrevious}>
        <ArrowLeft />
      </Button>
      <Button className='product-next-page__btn' onClick={handleClickNext}>
        <ArrowRight />
      </Button>
    </div >
  )
}

export default ProductNextPage