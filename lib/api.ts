import axios from "axios"

const API = axios.create({
  // baseURL: "https://findash-backend-m4ta.onrender.com"
  baseURL: "http://localhost:8080"
})

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token")

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      localStorage.clear()
    }

    return Promise.reject(error)
  }
)

export default API