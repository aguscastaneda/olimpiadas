import ClipLoader from 'react-spinners/ClipLoader'

function Loader({ className = '', size = 16 }) {
  return (
    <ClipLoader
      className={className}
      size={size}
    />
  )
}

export default Loader