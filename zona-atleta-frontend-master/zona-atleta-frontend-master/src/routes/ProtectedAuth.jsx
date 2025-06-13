import { Outlet, Navigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'
import PageLoader from '../components/loader/PageLoader'

function ProtectedAuth() {

  const user = useUser()

  if (user.isLoading())
    return <PageLoader />

  if (user.isNone())
    return <Navigate to='/login' />

  return <Outlet />
}

export default ProtectedAuth