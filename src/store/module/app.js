export default {
  namespaced: true,
  state: {
    parseUrl: {}, // url参数
    picGoods: [], // 选片商品
    delImgs: [], // 删除图片
    photoInstructions: {}, // 客人要求
    customerInstructions: '', // 客户要求
    details: {}, // 选片详情
    record: '' // 选片记录

  },
  getters: {
    get_parseUrl: state => state.parseUrl,
    get_picGoods: state => state.picGoods,
    get_delImgs: state => state.delImgs,
    get_photoInstructions: state => state.photoInstructions,
    get_customerInstructions: state => state.customerInstructions,
    get_details: state => state.details,
    get_record: state => state.record
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

    // 客人要求
    mut_photoInstructions (state, data) {
      state.photoInstructions = data
    },

    // 客户要求
    mut_customerInstructions (state, data) {
      state.customerInstructions = data
    },

    // 详情信息
    mut_details (state, data) {
      state.details = data
    },

    // 选片记录
    mut_record (state, data) {
      state.record = data
    }

  },
  actions: {
    act_ticket ({ commit }, data) {
      commit('mut_ticket', data)
    }

  }
}
