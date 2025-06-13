
function Subtitle({ children }) {
  return (
    <h2 className="w-full my-8 text-3xl uppercase font-black bg-gradient-to-r from-primary  to-[#ff9f1a] inline-block text-transparent bg-clip-text text-center md:text-start">
      {children}
    </h2>
  )
}

export default Subtitle