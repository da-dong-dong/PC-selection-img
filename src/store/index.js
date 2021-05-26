import Vue from 'vue'
import Vuex from 'vuex'
import app from './module/app.js'
import typeModule from './module/typeModule.js'
// 引入vuex 数据持久化插件
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    app,
    typeModule
  },
  plugins: [createPersistedState({
    // 存储在单个页面
    storage: window.sessionStorage,
    reducer (val) {
      console.log(val)
      return {
        // 只储存state中的app
        app: val.app
      }
    }
  })]
})
