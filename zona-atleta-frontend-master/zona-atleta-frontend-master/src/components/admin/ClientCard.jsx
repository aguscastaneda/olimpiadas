import { Link } from "react-router-dom"

function ClientCard({ client }) {
  return (
    <div className='grid grid-cols-4 shadow px-8 py-4 rounded'>
      <p className='text-xl'>{client.username}</p>
      <p className='text-xl col-start-2 col-end-4'>{client.email}</p>
      <Link
        className='text-xl font-semibold text-end cursor-pointer hover:text-primary hover:underline' to={`/client/${client.id}/orders`}
      >
        Ver pedidos
      </Link>
    </div>
  )
}

export default ClientCard