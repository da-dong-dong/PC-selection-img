import axios from 'axios'
import { bus } from '@/util/util.js'
import store from '../store/index'
import qs from 'qs'

// 设置默认请求头
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.headers.get['Content-Type'] = 'application/json;charset=UTF-8'

// 取消请求
const CancelToken = axios.CancelToken
const source = CancelToken.source()

// 创建请求
const myAxios = axios.create({
  timeout: 8000 // 超时时间
})

// 添加一个请求拦截器
myAxios.interceptors.request.use((config) => {
  const { shopId, ccId, ticket } = store.state.app.parseUrl
  config.headers.CurrentShopId = shopId
  config.headers.ccId = ccId
  config.headers.ticket = ticket
  return config
}, (error) => {
  // 错误
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截器
myAxios.interceptors.response.use(
  response => {
    if (response.data.code === 200) {
      return Promise.resolve(response.data)
    } else {
      bus.$Modal.warning({ title: '提示', content: response.data.message })
      return Promise.reject(response.data)
    }
  },
  error => {
    if (error.response.status !== 200) {
      return Promise.reject(error)
    }
  }
)

// 暴露请求方式
export const get = (url, params) => {
  return myAxios.get(url, { params, cancelToken: source.token })
}

export const post = (url, params) => {
  return myAxios.post(url, params, { cancelToken: source.token })
}

// 参数放url中
export const del = (url, params) => {
  return myAxios.delete(url, { params })
}

export const put = (url, params) => {
  return myAxios.put(url, params)
}

export const putJson = (url, params) => {
  return myAxios.put(url, params, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } })
}

// 表单post
export const postForm = (url, params) => {
  return myAxios.post(url, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
}
export const postFormHeader = (url, params, headers) => {
  return myAxios.post(url, qs.stringify(params), { headers })
}
