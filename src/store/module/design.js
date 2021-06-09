export default {
  state: {
    ky_ccId: sessionStorage.getItem('kyccId'),
    ky_ticked: "",
    ky_uniqueId: "",
    ky_orderId: "",
    ky_itemId: "",
    ky_id: "",
    ky_userId: "",
    ky_shopId: "",
    ky_serveArr: [],
    ky_photoUrl: '',
    ky_photoList: [], // 图片数组，给图片预览用的
    ky_imgList: [], // 图片数组
    ky_lookArr: [], // 确认修改ok，设计需要修改
    ky_modifyArr: [], // 待修改的
    ky_okArr: [], // 确定的
    ky_delArr: [] // 删除的照片
  },
  getters: {
    ky_photoList (state) {
      return state.ky_photoList
    },
    ky_delArr (state) {
      return state.ky_delArr
    },
    ky_modifyArr (state) {
      return state.ky_modifyArr
    },
    ky_okArr (state) {
      return state.ky_okArr
    },
    ky_ccId (state) {
      return state.ky_ccId
    },
    ky_ticked (state) {
      return state.ky_ticked
    },
    ky_uniqueId (state) {
      return state.ky_uniqueId
    },
    ky_orderId (state) {
      return state.ky_orderId
    },
    ky_itemId (state) {
      return state.ky_itemId
    },
    ky_id (state) {
      return state.ky_id
    },
    ky_userId (state) {
      return state.ky_userId
    },
    ky_shopId (state) {
      return state.ky_shopId
    },
    ky_serveArr (state) {
      return state.ky_serveArr
    },
    ky_photoUrl (state) {
      return state.ky_photoUrl
    },
    ky_imgList (state) {
      return state.ky_imgList
    },
    ky_lookArr (state) {
      return state.ky_lookArr
    }
  },
  mutations: {
    set_ky_photoList (state, arr) {
      state.ky_photoList = arr
    },
    set_ky_delArr (state, arr) {
      state.ky_delArr = arr
    },
    set_ky_okArr (state, arr) {
      state.ky_okArr = arr
    },
    set_ky_modifyArr (state, arr) {
      state.ky_modifyArr = arr
    },
    set_ky_lookArr (state, arr) {
      state.ky_lookArr = arr
    },
    set_ky_ccId (state, str) {
      state.ky_ccId = str
    },
    set_ky_ticked (state, str) {
      state.ky_ticked = str
    },
    set_ky_uniqueId (state, str) {
      state.ky_uniqueId = str
    },
    set_ky_orderId (state, str) {
      state.ky_orderId = str
    },
    set_ky_itemId (state, str) {
      state.ky_itemId = str
    },
    set_ky_id (state, str) {
      state.ky_id = str
    },
    set_ky_userId (state, str) {
      state.ky_userId = str
    },
    set_ky_shopId (state, str) {
      state.ky_shopId = str
    },
    set_ky_serveArr (state, arr) {
      state.ky_serveArr = arr
    },
    set_ky_photoUrl (state, str) {
      state.ky_photoUrl = str
    },
    set_ky_imgList (state, arr) {
      state.ky_imgList = arr
    }
  },
  actions: {}
}
