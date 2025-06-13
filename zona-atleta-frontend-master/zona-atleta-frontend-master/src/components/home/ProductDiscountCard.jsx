
function ProductDiscountCard({ productDiscount: p }) {
  return (
    <div>
      <div className="mb-2">
        <img className='' src={p.image} alt={p.name} />
      </div>
      <div className="">
        <p className="text-xl font-medium text-gray-900/90 text-start">{p.name}</p>
        <div className="flex items-start flex-col">
          <p className="font-bold text-gray-900/50 line-through">${p.price}</p>
          <div className="flex justify-start items-center gap-2">
            <p className="text-4xl text-gray-900/80">${p.price - (p.price * (p.percentage / 100))}</p>
            <p className="text-lg text-green-500">{p.percentage}% OFF</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDiscountCard