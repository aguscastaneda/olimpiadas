import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './contexts/AppContext.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'
import { OrderManagerContextProvider } from './contexts/OrderManager.jsx'
import { BuyContextProvider } from './contexts/BuyContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx'
import './styles/normalize.css'
import './styles/index.css'
import './styles/utilities.css'
import './styles/navbar.css'
import './styles/header.css'
import './styles/footer.css'
import './styles/button.css'
import './styles/product.css'
import './styles/order.css'
import './styles/home.css'
import './styles/profile.css'
import './styles/layout.css'
import './styles/shopping-cart.css'
import 'react-multi-carousel/lib/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="431133807061-7e5c6g7miqgqaudebn1d4k5e38lp8h2q.apps.googleusercontent.com">
        <AppContextProvider>
          <UserContextProvider>
            <OrderManagerContextProvider>
              <BuyContextProvider>
                <App />
              </BuyContextProvider>
            </OrderManagerContextProvider>
          </UserContextProvider>
        </AppContextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
)