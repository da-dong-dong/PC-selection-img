export default {
  namespaced: true,
  state: {
    cacheFileCheck: false, // 是否展示缓存按钮
    moduleFlge: 1, // 1:选片模式 ，2：查看模式
    allImg: [], // 全部图片
    imgF2Show: true, // ture 隐藏图片  false展示图片
    flagF4: true // 是否正序

  },
  getters: {
    get_cacheFileCheck: state => state.cacheFileCheck,
    get_moduleFlge: state => state.moduleFlge,
    get_allImg: state => state.allImg,
    get_imgF2Show: state => state.imgF2Show

  },
  mutations: {
    // 设置展示缓存
    mut_setCacheFileCheck (state, data) {
      state.cacheFileCheck = data
    },

    // 模式选择
    mut_moduleFlge (state, data) {
      state.moduleFlge = data
    },

    // 全部图片
    mut_allImg (state, data) {
      state.allImg = data
    },

    // F2隐藏显示图片
    mut_imgF2Show (state, data) {
      state.imgF2Show = data
    },

    // F4乱序=>正序
    mut_imgF4 (state) {
      if (state.flagF4) {
        // 乱序
        state.allImg.sort(() => {
          return 0.5 - Math.random()
        })
      } else {
        state.allImg.sort((obj1, obj2) => {
          let val1 = obj1.name
          let val2 = obj2.name
          if (val1 < val2) {
            return -1
          } else if (val1 > val2) {
            return 1
          } else {
            return 1
          }
        })
      }
      state.flagF4 = !state.flagF4
    }

  },
  actions: {

  }
}
