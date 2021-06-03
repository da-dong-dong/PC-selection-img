export default {
  namespaced: true,
  state: {
    parseUrl: {}, // url参数
    picGoods: [], // 选片商品
    delImgs: [], // 删除图片
    details: {} // 选片详情

  },
  getters: {
    get_parseUrl: state => state.parseUrl,
    get_picGoods: state => state.picGoods,
    get_delImgs: state => state.delImgs,
    get_details: state => state.details

  },
  mutations: {
    // 设置url参数值
    mut_setParseUrl (state, data) {
      state.parseUrl = data
    },

    // 设置url参数值
    mut_picGoods (state, data) {
      state.picGoods = data
    },

    // 删除图片
    mut_delImgs (state, data) {
      state.delImgs = data
    },

    // 详情信息
    mut_details (state, data) {
      state.details = data
    }

  },
  actions: {
    act_ticket ({ commit }, data) {
      commit('mut_ticket', data)
    }

  }
}
