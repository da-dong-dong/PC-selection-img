import baseUrl from '@/api/index.js'
import { get } from '@/api/axios.js'

// 获取-子订单的选片类型
export const getCloudChooseType = (params) => {
  return get(baseUrl.getCloudChooseType, params)
}
