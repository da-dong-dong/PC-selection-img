export default {
  namespaced: true,
  state: {
    // 测试
    ticket: null

  },
  getters: {
    get_ticket: state => state.ticket

  },
  mutations: {
    mut_ticket (state, data) {
      state.ticket = data
    }

  },
  actions: {
    act_ticket ({ commit }, data) {
      commit('mut_ticket', data)
    }

  }
}
