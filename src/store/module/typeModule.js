export default {
  namespaced: true,
  state: {
    cacheFileCheck: false, // 是否展示缓存按钮
    moduleFlge: 1 // 1:选片模式 ，2：查看模式
  },
  getters: {
    get_cacheFileCheck: state => state.cacheFileCheck,
    get_moduleFlge: state => state.moduleFlge
  },
  mutations: {
    // 设置展示缓存
    mut_setCacheFileCheck (state, data) {
      state.cacheFileCheck = data
    },

    // 模式选择
    mut_moduleFlge (state, data) {
      state.moduleFlge = data
    }

  },
  actions: {

  }
}
