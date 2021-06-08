import baseUrl from '@/api/index.js'
import { get, put, postFormHeader, putJson, post, del } from '@/api/axios.js'
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

// 查找-选片详情
export const getChooseDetails = (params) => {
  return get(baseUrl.getChooseDetails, params)
}

// 新增-后期录入记录和收款
export const getItemChooseSaleSumPrice = (params) => {
  return get(baseUrl.getItemChooseSaleSumPrice, params)
}

// 新增-后期录入记录和收款
export const addEntryReceipt = (params) => {
  return putJson(baseUrl.addEntryReceipt, params)
}

// 获取选片师类别
export const getCategoryId = (params) => {
  return get(baseUrl.getCategoryId, params)
}

// 更新-子订单商品
export const updateChildData = (params) => {
  return put(baseUrl.updateChildData, params)
}

// 获取选片师类别
export const categoryList = (params) => {
  return get(baseUrl.categoryList, params)
}

// 获取 产品列表
export const getGoodsList = (params) => {
  return post(baseUrl.getGoodsList, params)
}

// 加选子订单产品
export const andChoose = (params) => {
  return post(baseUrl.andChoose, params)
}

// 子订单产品升级
export const upChildOrderGrade = (params) => {
  return put(baseUrl.upChildOrderGrade, params)
}

// 删除子订单列表
export const delChildOrder = (params) => {
  return del(baseUrl.delChildOrder, params)
}
