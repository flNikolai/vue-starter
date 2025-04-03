import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  headers: {
    'Content-type': 'application/json',
  },
})
