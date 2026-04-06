import axios from "axios"

const API = axios.create({
  baseURL: "https://findash-backend-production.up.railway.app"
})

API.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default API