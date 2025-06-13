import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'

function Link({ className = '', to, children }) {

  const navigate = useNavigate()

  return (
    <a
      className={className}
      href={to}
      onClick={(ev) => {
        ev.preventDefault();
        document.startViewTransition(() => {
          flushSync(() => {
            navigate(to);
          });
        });
      }}
    >
      {children}
    </a>
  )
}

export default Link