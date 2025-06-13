import { Link } from "react-router-dom"
import Button from "../Button"

/*
si el cliente quiere devolver la compre o si tiene algun problema
https://www.mercadopago.com.ar/post-purchase/init-flow/setup?fulfilled=null&expected_resolution=undefined&resource=payment&resource_id="ID DE COMPRA"help_origin=undefined
*/

function OrderCard({ order, delivery, cancel }) {

  const date = new Date(order.date)

  async function handleDeliveryClick() {
    await delivery(order.id)

  }

  async function handleCancelClick() {
    await cancel(order.id)
  }

  return (
    <div className="border border-primary p-4 shadow rounded flex flex-col gap-2">
      <p className="text-lg text-gray-900 font-medium">Numero de pedido: {order.id}</p>
      <p>Fecha: {date.toLocaleDateString()}</p>
      <p>Estado: {order.state}</p>
      <div className="mt-2 flex gap-2">
        {
          order.state !== 'entregado'
            ? <Button onClick={handleDeliveryClick} className="text-sm py-2 px-0 w-full">Realizar Entrega</Button>
            : <></>
        }
        {
          order.state === 'pago aprobado'
            ? <Button onClick={handleCancelClick} className="text-sm py-2 px-0 w-full" variant="outline">Cancelar Pedido</Button>
            : <></>
        }
      </div>
      <Button className="text-sm">Contactar Cliente</Button>
      <Link className="text-sm text-red-700 text-center hover:underline hover:text-red-500 mt-2">Descargar Factura</Link>
    </div>
  )
}

export default OrderCard