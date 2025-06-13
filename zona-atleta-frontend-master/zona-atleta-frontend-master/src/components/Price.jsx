import Utilities from "../utilities/Utilities"

function Price({ className = '', price = 0 }) {
  return (
    <p className={`price ${className}`}>{Utilities.formatNumberToPrice(price)}</p>
  )
}

export default Price