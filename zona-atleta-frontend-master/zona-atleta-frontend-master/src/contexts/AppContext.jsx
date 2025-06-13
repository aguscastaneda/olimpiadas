import { useEffect, useContext, createContext } from 'react'
import io from 'socket.io-client'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const socket = io(BACKEND_URL)

const AppContext = createContext()

export function useApp() {
  const context = useContext(AppContext)
  if (!context)
    throw new Error('App context not found')
  return context
}

export function AppContextProvider({ children }) {

  return (
    <AppContext.Provider value={{
      socket
    }}>
      {children}
    </AppContext.Provider>
  )
}