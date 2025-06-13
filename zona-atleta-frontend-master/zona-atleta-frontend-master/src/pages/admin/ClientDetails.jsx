import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ClientService from '../../services/ClientService'
import Loader from '../../components/loader/Loader'
import ErrorMessage from '../../components/ErrorMessage'

function ClientDetails() {

  const [client, setClient] = useState({})
  const [loader, setLoader] = useState(true)
  const [error, setError] = useState(false)

  const { id } = useParams()

  useEffect(() => {
    async function getClient() {
      setLoader(true)
      try {
        const res = await ClientService.getByIdRequest(id)
        setClient(res)
      } catch (e) {
        console.log(e)
        setError(true)
      }
      setLoader(false)
    }
    getClient()
  }, [id])

  return (
    <div className='client-details'>
      {
        loader
          ? <Loader />
          : error
            ? <ErrorMessage message='Error de servidor' />
            : <p>Este es el perfil de {client.username}</p>
      }
    </div>
  )
}

export default ClientDetails