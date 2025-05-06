// src/utils/http.ts
import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

// 通用接口返回类型
export interface ApiResponse<T = any> {
    code: number
    data: T
    msg: string
}

// 创建 axios 实例
const http: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    timeout: 10_000,
})

// 请求拦截：注入 token
http.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error),
)

// 响应拦截：统一处理状态码与错误
http.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const { code, data, msg } = response.data
        if (code !== 0) {
            // 你可以用自己的 toast 组件提示错误 msg
            return Promise.reject(new Error(msg || '未知错误'))
        }
        return data
    },
    error => {
        // 网络或 5xx 错误处理
        const message = error.response?.data?.msg || error.message || '网络异常'
        return Promise.reject(new Error(message))
    },
)

// 封装 GET/POST 便捷函数
export function get<T = any>(url: string, params?: object) {
    return http.get<T>(url, { params })
}

export function post<T = any>(url: string, data?: object) {
    return http.post<T>(url, data)
}

export default http
