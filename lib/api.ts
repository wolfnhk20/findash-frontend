import axios from "axios"

const API = axios.create({
  baseURL: "https://findash-backend-m4ta.onrender.com"
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
    if (typeof window !== "undefined") {
      const status = error?.response?.status

      if (status === 401 || status === 403) {
        localStorage.clear()
        window.location.href = "/"
      }
    }

    return Promise.reject(error)
  }
)

export default API