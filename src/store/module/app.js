export default {
  namespaced: true,
  state: {
    // url参数
    parseUrl: {}

  },
  getters: {
    get_parseUrl: state => state.parseUrl

  },
  mutations: {
    // 设置url参数值
    mut_setParseUrl (state, data) {
      state.parseUrl = data
    }

  },
  actions: {
    act_ticket ({ commit }, data) {
      commit('mut_ticket', data)
    }

  }
}
