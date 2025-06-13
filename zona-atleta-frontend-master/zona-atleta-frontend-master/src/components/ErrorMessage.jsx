function ErrorMessage({ message }) {
  return (
    <div className='error-message'>
      <div className='error-message__container'>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ErrorMessage