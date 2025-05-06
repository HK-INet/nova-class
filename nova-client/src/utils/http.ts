// src/utils/http.ts
import axios from 'axios'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 5000,
})

http.interceptors.request.use(config => {
    // 设置 token
    return config
})

http.interceptors.response.use(
    res => res.data,
    err => Promise.reject(err)
)

export default http
