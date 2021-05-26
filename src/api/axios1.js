import axios from 'axios'
import store from '../store/index'

// 创建请求
const myAxios1 = axios.create({
  // baseURL: 'http://napi.lyfz.net/pro',
  timeout: 1000 // 超时时间
})

// 添加一个请求拦截器
myAxios1.interceptors.request.use((config) => {
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
myAxios1.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

// 暴露请求方式
export const head = (url) => {
  return myAxios1.head(url)
}
