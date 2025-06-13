
function Title({ className, children }) {
  return (
    <h1 className={`text-4xl text-primary font-black ${className}`}>
      {children}
    </h1>
  )
}

export default Title