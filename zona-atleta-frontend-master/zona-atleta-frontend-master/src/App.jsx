import { useState, useLayoutEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import ProtectedAuth from './routes/ProtectedAuth'
import ProtectedNotAuth from './routes/ProtectedNotAuth'
import ProtectedClient from './routes/ProtectedClient'
import ProtectedSalesManager from './routes/ProtectedSalesManager'
import Home from './pages/public/Home'
import Product from './pages/public/Product'
import ProductDetails from './pages/public/ProductDetails'
import OrderDetails from './pages/public/OrderDetails'
import NotFound from './pages/public/NotFound'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import RegisterSalesManager from './pages/auth/RegisterSalesManager'
import Profile from './pages/client/Profile'
import ShoppingCart from './pages/client/ShoppingCart'
import ClientOrders from './pages/client/Orders'
import Favorites from './pages/client/Favorites'
import Admin from './pages/admin/Admin'
import ClientDetails from './pages/admin/ClientDetails'
import LayoutApp from './layouts/LayoutApp';
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useUser } from './contexts/UserContext';
import DiscountProductsPage from './pages/public/DiscountProductsPage'

function App() {

  const [navbarActive, setNavbarActive] = useState(true)
  const [name, setName] = useState('')
  const location = useLocation()
  const user = useUser()

  useLayoutEffect(() => {
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <>
      <Navbar active={navbarActive} inputValue={name} inputOnChange={(e) => setName(e.target.value)} />
      {
        user.isSalesManager()
          ? < Chatbot />
          : <></>
      }
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{
          zIndex: '1500'
        }} />
      <LayoutApp>
        <Routes>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/home/page/:page' element={<Home />} />
          <Route path='/product' element={<Product />} />
          <Route path='/product/:id' element={<ProductDetails />} />
          <Route path='/product/from/discount' element={<DiscountProductsPage />} />
          <Route path='/order/:id' element={<OrderDetails />} />
          <Route element={<ProtectedNotAuth />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route element={<ProtectedAuth />}>
            <Route element={<ProtectedClient />}>
              <Route path='/shopping-cart' element={<ShoppingCart />} />
              <Route path='/favorites' element={<Favorites />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/order' element={<ClientOrders />} />
            </Route>
            <Route element={<ProtectedSalesManager />}>
              <Route path='/admin/:option' element={<Admin />} />
              <Route path='/register-sales-manager' element={<RegisterSalesManager />} />
              <Route path='/client/:id' element={<ClientDetails />} />
            </Route>
          </Route>
          <Route path='*' element={<NotFound setNavbarActive={setNavbarActive} />} />
        </Routes>
      </LayoutApp>
      <Footer />
    </>
  )
}

export default App