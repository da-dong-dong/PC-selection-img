let baseApi
// VUE_APP_MODE  VUE_APP_MODE
switch ('test') {
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
  uploadFile2: '/fserver/uploadfile', // 标记说明
  getChooseDetails: `${baseApi}/store/order/item/process/choose/details`, // 查找-选片详情
  getItemChooseSaleSumPrice: `${baseApi}/store/financia/order/late/getItemChooseSaleSumPrice`, // 新增-后期录入记录和收款
  addEntryReceipt: `${baseApi}/store/financia/order/late/addEntryReceipt`, // 新增-后期录入记录和收款
  getCategoryId: `${baseApi}/base/producer/getCategoryId`, // 获取选片师类别
  updateChildData: `${baseApi}/store/order/item/goods/choose/update`, // 更新-子订单商品
  categoryList: `${baseApi}/base/category/list`, // 取件方式
  getGoodsList: `${baseApi}/goods/goods/toolList`, // 获取 产品列表
  andChoose: `${baseApi}/store/order/item/goods/choose/add`, // 加选子订单产品
  upChildOrderGrade: `${baseApi}/store/order/item/goods/choose/upgrade`, // 子订单产品升级
  delChildOrder: `${baseApi}/store/order/item/goods/deleteGoods`, // 删除子订单列表
  getTemList: `${baseApi}/store/print/template/list/printTemplateNameVo`, // 查找-打印模板名称列表
  getPrintOut: `${baseApi}/store/print/template/printOut`, // 查找-打印模板渲染
  getLogs: `${baseApi}/logs/logs/order/list` // 查找-订单日志列表
}

export default baseUrl
