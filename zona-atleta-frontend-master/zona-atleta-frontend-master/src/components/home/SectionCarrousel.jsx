import Carousel from 'react-multi-carousel'
import Subtitle from '../Subtitle'
import Loader from 'react-spinners/ClipLoader'

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
}

function SectionCarrouselLoader() {
  return (
    <div className='min-h-64 flex justify-center items-center'>
      <Loader />
    </div>
  )
}

function SectionCarrousel({ title, isLoading, amount = 5, children }) {

  return (
    <section>
      <header>
        <Subtitle>{title}</Subtitle>
      </header>
      <div>
        {
          isLoading
            ? <SectionCarrouselLoader />
            : children.length === 0
              ? <div className='min-h-64 flex justify-center items-center'>
                <p className='text-xl font-semibold text-primary text-center'>No hay {title.toLowerCase()} disponibles</p>
              </div>
              : <Carousel
                swipeable={false}
                draggable={false}
                responsive={{ ...responsive, desktop: { ...responsive.desktop, items: amount } }}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={1000}
                customTransition="all 1s"
                transitionDuration={1000}
                containerClass="carousel-container"
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-40-px mx-"
              >
                {children}
              </Carousel>
        }
      </div>
    </section>

  )
}

export default SectionCarrousel