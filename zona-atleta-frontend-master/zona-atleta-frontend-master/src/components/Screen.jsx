import Xmark from '../components/icons/Xmark'

function Screen({ children, setScreen }) {

  function handleClick(e) {
    e.stopPropagation()
    setScreen(false)
  }

  return (
    <div className='screen' onClick={handleClick}>
      <button className='screen__btn-close' title='Cerrar' onClick={() => setScreen(false)}>
        <Xmark />
      </button>
      {children}
    </div>
  )
}

export default Screen