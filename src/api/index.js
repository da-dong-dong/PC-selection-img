let baseApi

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
  getCloudChooseType: `${baseApi}/store/order/item/get/getCloudChooseType` // 获取-子订单的选片类型
}

export default baseUrl
