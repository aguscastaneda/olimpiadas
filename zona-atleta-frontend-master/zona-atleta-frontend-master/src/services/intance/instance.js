import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const authorization = localStorage.getItem('authorization')

const instance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
  headers: authorization ? {
    'Authorization': authorization
  } : {}
})

export default instance