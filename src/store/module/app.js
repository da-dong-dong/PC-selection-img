export default {
  namespaced: true,
  state: {
    parseUrl: {}, // url参数
    picGoods: [] // 选片商品

  },
  getters: {
    get_parseUrl: state => state.parseUrl,
    get_picGoods: state => state.picGoods
  },
  mutations: {
    // 设置url参数值
    mut_setParseUrl (state, data) {
      state.parseUrl = data
    },

    // 设置url参数值
    mut_picGoods (state, data) {
      state.picGoods = data
    }

  },
  actions: {
    act_ticket ({ commit }, data) {
      commit('mut_ticket', data)
    }

  }
}
