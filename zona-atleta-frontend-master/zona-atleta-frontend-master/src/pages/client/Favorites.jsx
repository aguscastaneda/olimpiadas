import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useUser } from '../../contexts/UserContext'
import ClientService from '../../services/ClientService'
import Button from '../../components/Button'
import Loader from 'react-spinners/ClipLoader'
import ErrorMessage from '../../components/ErrorMessage'

function FavoriteCard({ product, onClick = () => { }, loading }) {

  return (
    <div className='rounded-md shadow-md flex flex-col md:flex-row md:items-center md:justify-start'>
      <div>
        <img className='min-w-64 min-h-64' src={product.image} />
      </div>
      <div className='w-full flex flex-col py-4 px-8 gap-4'>
        <p className='text-xl font-medium mb-2 max-w-[256px]'>{product.name}</p>
        <Button onClick={onClick} className='w-full flex justify-center items-center'>
          {
            loading
              ? <Loader color='#fff' />
              : 'Eliminar de favoritos'
          }
        </Button>
        <Link className='hover:text-primary hover:underline' to={`/product/${product.id}`}>
          Ir al producto
        </Link>
      </div>
    </div>
  )
}
function Favorites() {

  const [favorites, setFavorites] = useState([])
  const [loadingDeleteFavorite, setLoadingDeleteFavorite] = useState(false)

  const { id } = useUser()

  function getHandleClick(product) {
    return async () => {
      setLoadingDeleteFavorite(true)
      try {
        const deleteFavorite = await ClientService.deleteFavorite(id, product.id)
        const newFavorites = favorites.filter(f => f.id !== deleteFavorite.id)
        setFavorites(newFavorites)
        toast('Se elimino con exito')
      } catch (e) {
        toast(`Error inesperado ${e}`)
      }
      setLoadingDeleteFavorite(false)
    }
  }

  useEffect(() => {
    async function getFavorites() {
      try {
        const data = await ClientService.getFavorites(id)
        setFavorites(data)
      } catch (e) {
        console.log(e)
      }
    }
    getFavorites()
  }, [])

  return (
    <div className='max-w-[1024px] mx-auto py-32'>
      <div>
        <h4 className='text-2xl font-bold pl-8 uppercase text-primary my-8'>Tus favoritos</h4>
      </div>
      <div className='max-w-max mx-auto flex flex-col gap-8'>
        {
          favorites.length === 0
            ? <Link to='/home'>
              <Button>
                Explorar productos
              </Button>
            </Link>
            : favorites.map((p, i) => <FavoriteCard key={i} product={p} onClick={getHandleClick(p)} loading={loadingDeleteFavorite} />)

        }
      </div>
    </div>
  )
}

export default Favorites