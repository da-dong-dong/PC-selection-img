let baseApi
// VUE_APP_MODE  VUE_APP_MODE
switch (process.env.VUE_APP_MODE) {
  case 'production':
    baseApi = `//napi.lyfz.net/pro/api`
    break
  case 'test':
    baseApi = `//api.erp.27yn.cn/test/api`
    break
  case 'development':
    baseApi = `//192.168.5.220/dev/api`
    break
}

const baseUrl = {
  getPicConfigList: `${baseApi}/base/picture/config/list`, // 获取-相片服务器列表
  getCloudChooseType: `${baseApi}/store/order/item/get/getCloudChooseType`, // 获取-子订单的选片类型
  updateCloudChooseType: `${baseApi}/store/order/item/update/updateCloudChooseType`, // 更新-子订单的选片类型
  getPhotoServer: `${baseApi}/store/order/item/find/photoServer`, // 查找-子订单相片服务器
  getAllPic: '/fserver/FindOrderFiles', // 获取指定指订的相片集合
  getChooseDetails: `${baseApi}/store/order/item/process/choose/details` // 查找-选片详情
}

export default baseUrl
