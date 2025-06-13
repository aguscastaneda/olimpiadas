import Bell from './icons/Bell'

function Notification({ number }) {
  return (
    <div className='notification'>
      <Bell className='notification-icon' />
      <p className='notification-number'>
        {
          number > 0
            ? '10'
            : number
        }
      </p>
    </div>
  )
}

export default Notification