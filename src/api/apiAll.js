import baseUrl from '@/api/index.js'
import { get, put, postFormHeader } from '@/api/axios.js'
import { head } from '@/api/axios1.js'

// 获取-相片服务器列表
export const getPicConfigList = (params) => {
  return get(baseUrl.getPicConfigList, params)
}

// 判断外网/内网是否可用
export const isIntranetAvailable = (url) => {
  return head(url)
}

// 获取-子订单的选片类型
export const getCloudChooseType = (params) => {
  return get(baseUrl.getCloudChooseType, params)
}

// 更新-子订单的选片类型
export const updateCloudChooseType = (params) => {
  return put(baseUrl.updateCloudChooseType, params)
}

// 查找-子订单相片服务器
export const getPhotoServer = (params) => {
  return get(baseUrl.getPhotoServer, params)
}

// 获取指定指订的相片集合
export const getAllPic = (params) => {
  return postFormHeader(`${params.url}${baseUrl.getAllPic}`, params.params, params.headers)
}
