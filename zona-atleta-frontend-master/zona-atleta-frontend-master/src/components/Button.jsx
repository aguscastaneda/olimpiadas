function Button({
  className = '',
  type = 'button',
  variant = 'normal',
  onClick = (e) => { },
  children,
  disabled = false,
  ...props
}) {

  if (disabled)
    return (
      <button
        className={`bg-red-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed *:fill-white focus:outline-2 focus:outline-red-400 ${className}`}
        type={type}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )

  if (variant === 'outline') {
    return (
      <button
        className={`bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded *:fill-red-700 hover:*:fill-white focus:outline-2 focus:outline-red-400  ${className}`}
        type={type}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded *:fill-white focus:outline-2 focus:outline-red-400 ${className}`}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )


}

export default Button