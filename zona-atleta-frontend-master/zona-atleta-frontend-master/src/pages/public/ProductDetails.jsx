import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loader from 'react-spinners/ClipLoader'
import { toast } from 'react-toastify'
import ProductService from '../../services/ProductService'
import Utilities from '../../utilities/Utilities'
import ErrorMessage from '../../components/ErrorMessage'
import { useUser } from '../../contexts/UserContext'
import Button from '../../components/Button'
import Like from '../../components/icons/Like'
import ClientService from '../../services/ClientService'
import { useBuy } from '../../contexts/BuyContext'
import Delete from '../../components/icons/Delete'
import CommentService from '../../services/CommentService'

function ResponseCard({ response }) {
  return (
    <div className='w-full text-end'>
      <p className='text-primary font-bold'>Respuesta vendedor</p>
      <p className='text-primary'>{response.message}</p>
    </div>
  )
}

function CommentCard({ comment, handle = async () => { } }) {

  const [response, setResponse] = useState(comment.response)
  const [currentResponse, setCurrentResponse] = useState('')

  const user = useUser()

  async function handleClick() {
    const responseBefore = response
    const currentResponseBefore = currentResponse
    try {
      setResponse({ message: currentResponse })
      setCurrentResponse('')
      const data = await CommentService.postResponse({ commentId: comment.id, message: currentResponse })
      setResponse(data)
      setCurrentResponse('')
      console.log(data)
      await handle()
      console.log('Se actualizo el visto')
    } catch (e) {
      setResponse(responseBefore)
      setCurrentResponse(currentResponseBefore)
      console.log(e)
    }
  }

  function handleChange(e) {
    setCurrentResponse(e.target.value)
  }


  return (
    <div className='w-full max-w-[256px] shadow py-2 px-4 '>
      <div className='mb-2'>
        <p className='text-gray-800/75 font-bold'>Comentario cliente</p>
        <p className='text-gray-800/50'>{comment.message}</p>
      </div>
      <div>
        {
          response === null || response === undefined
            ? user.isSalesManager()
              ? <div className='flex gap-8'>
                <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' value={currentResponse} type="text" placeholder='Responder Comentario' onChange={handleChange} />
                <Button onClick={handleClick}>Responder</Button>
              </div>
              : <></>
            : <ResponseCard response={response} />
        }
      </div>
    </div>
  )
}

function ProductDetailsLayout({ product, onClickAddFavorite = () => { }, onClickRemoveFavorite = () => { }, loadingFavorite }) {
  const [comments, setComments] = useState([...product.comments])
  const [comment, setComment] = useState('')

  const user = useUser()
  const { addProduct, buyOne } = useBuy()

  function handleChange(e) {
    setComment(e.target.value)
  }

  async function handleClick() {
    const beforeComments = [...comments]
    const beforeComment = comment.slice(0, comment.length - 1)
    try {
      setComments([...comments, { message: comment }])
      setComment('')
      const data = await CommentService.postComment({ clientId: user.id, productId: product.id, message: comment })
      setComment('')
      console.log(data)
    } catch (e) {
      setComments(beforeComments)
      setComment(beforeComment)
      console.log(e)
    }
  }

  function getHandlePutViewComment(commentId) {
    return async () => {
      const res = await CommentService.putCommentView({ commentId })
      console.log(res)
    }
  }

  useEffect(() => {
    async function putResponseView() {
      if (!user.isSalesManager()) {
        console.log('me ejecuto')
        const res = await CommentService.putClientResponses({ clientId: user.id })
        console.log(res)
      }
    }
    putResponseView()
  }, [])

  return (
    <div className='max-w-[1024px] mx-auto flex justify-center items-center flex-col py-16 gap-8'>
      <div>
        <p className='product-details__name text-center'>{product.name}</p>
      </div>
      <div className='flex flex-col md:flex-row justify-start items-start gap-8'>
        <img className='product-details__img' src={product.image} />
        <div className='w-full md:w-auto flex flex-col justify-center items-center md:justify-start md:items-start gap-6'>
          <p className='text-4xl font-semibold'>${Utilities.formatNumberToPrice(product.price)}</p>
          <div>
            <p className='text-xl font-normal'>Unidades disponibles: {product.stock}</p>
          </div>
          <div>
            <p className='product-details__description'>{product.description}</p>
          </div>
          <div className='flex gap-4'>
            <Button className='' onClick={async () => {
              try {
                await buyOne(product)
              } catch (e) {
                console.log(e)
              }
            }}>
              Comprar
            </Button>
            <Button variant='outline' onClick={async () => {
              try {
                await addProduct(product)
              } catch (e) {
                console.log(e)
              }
            }}>
              Agregar al Carrito
            </Button>
          </div>
          {
            user.isClient()
              ? product.isFavorite
                ? <Button onClick={onClickRemoveFavorite} className='flex justify-center items-center gap-4'>
                  {
                    loadingFavorite
                      ? <Loader color='white' />
                      : <>
                        Eliminar de favoritos
                        <Delete />
                      </>
                  }
                </Button>
                : <Button onClick={onClickAddFavorite} className='flex justify-center items-center gap-4'>
                  {
                    loadingFavorite
                      ? <Loader color='white' />
                      : <>
                        Agregar a favoritos
                        <Like />
                      </>
                  }
                </Button>
              : <></>
          }
          {
            !product.available
              ? <button className='w-full py-2 px-4 bg-transparent cursor-default block border border-[#f39c12] text-[#f39c12] font-semibold rounded-md'>No disponible</button>
              : <></>
          }
        </div>
        <div>

        </div>
      </div>
      <div className='bg-primary w-full w-max-[1024px] h-[2px] rounded-full'>
      </div>
      <div className='flex flex-col gap-8'>
        <h4 className='text-center text-2xl'>Comentarios</h4>
        {
          user.isNone()
            ? <Button>Inicia sesion para agregar comentarios</Button>
            : <></>
        }
        {
          user.isClient()
            ? <div className='flex gap-4'>
              <input className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' value={comment} type="text" placeholder='Agrege un comentario' onChange={handleChange} />
              <Button onClick={handleClick}>Agregar</Button>
            </div>
            : <></>
        }
        {
          comments.length === 0
            ? <p className='text-center'>El producto no tiene comentarios</p>
            : <div className='bg-white px-4 py-2 flex flex-col justify-center items-center gap-4 '>
              {
                comments.map((c, i) => <CommentCard key={i} comment={c} handle={getHandlePutViewComment(c.id)} />)
              }
            </div>
        }
      </div>
    </div>
  )
}

function ProductDetails() {

  const [product, setProduct] = useState({})
  const [loanding, setLoading] = useState(true)
  const [loadingFavorite, setLoadingFavorite] = useState(false)
  const [error, setError] = useState(false)

  const { id } = useParams()
  const user = useUser()

  async function addFavorite() {
    setLoadingFavorite(true)
    try {
      const data = await ClientService.postFavorite(user.id, product.id)
      toast('Se agrego a favoritos', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      console.log(data)
      setProduct(data)
    } catch (e) {
      console.log(e)
    }
    setLoadingFavorite(false)
  }

  async function removeFavorite() {
    setLoadingFavorite(true)
    try {
      const data = await ClientService.deleteFavorite(user.id, product.id)
      toast('Se elimino de favoritos', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light"
      });
      setProduct(data)
    } catch (e) {
      console.log(e)
    }
    setLoadingFavorite(false)
  }

  useEffect(() => {
    async function getProductById() {
      setLoading(true)
      try {
        if (user.isClient()) {
          const data = await ProductService.getProductByIdRequest(id, { clientId: user.id })
          setProduct(data)
        } else {
          const data = await ProductService.getProductByIdRequest(id)
          setProduct(data)
        }
      } catch (e) {
        console.log(e)
        setError(true)
      }

      setLoading(false)
    }
    getProductById()
  }, [user.id, id])

  return (
    <div className='product-details'>
      {
        loanding
          ? <div className='w-full h-96 grid place-items-center'>
            <Loader />
          </div>
          : error
            ? <ErrorMessage message='Error de servidor' />
            : <ProductDetailsLayout product={product} onClickAddFavorite={addFavorite} onClickRemoveFavorite={removeFavorite} loadingFavorite={loadingFavorite} />
      }
    </div>
  )
}

export default ProductDetails