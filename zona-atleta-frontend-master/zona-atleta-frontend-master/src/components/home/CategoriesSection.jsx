import { Link } from 'react-router-dom'
import Carousel from 'react-multi-carousel'
import Subtitle from '../Subtitle'

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 6
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 6
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

function CategoriesSection({ title }) {

  const categories = ['hockey', 'tenis', 'moda', 'training', 'natacion', 'running', 'basquet', 'futbol']

  return (
    <div >
      <div className="grid place-items-center">
        <Subtitle>{title}</Subtitle>
      </div>
      <Carousel
        swipeable={false}
        draggable={false}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={1000}
        customTransition="all 1s"
        transitionDuration={1000}
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px mx-2"
      >
        {
          categories.map((category, index) => <Link key={index} to={`/product?category=${category}`}>
            <img src={`/sliders/slider-category-${index + 1}.jpg`} />
          </Link>)
        }
      </Carousel>
    </div>
  )
}

export default CategoriesSection