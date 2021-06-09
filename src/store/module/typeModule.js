export default {
  namespaced: true,
  state: {
    cacheFileCheck: false, // 是否展示缓存按钮
    moduleFlge: 1, // 1:选片模式 ，2：查看模式
    allImg: [], // 全部图片
    imgF2Show: true, // ture 隐藏图片  false展示图片
    flagF4: true, // 是否正序
    jtotalPrice: 0, // 加挑金额
    saleCategoryId: null, // 选片师类别
    pickList: [], // 取件方式
    goodesList: [], // 商品类别
    appKeyServe: '', // 服务器key
    appServeURL: '' // 服务器url

  },
  getters: {
    get_cacheFileCheck: state => state.cacheFileCheck,
    get_moduleFlge: state => state.moduleFlge,
    get_allImg: state => state.allImg,
    get_imgF2Show: state => state.imgF2Show,
    get_jtotalPrice: state => state.jtotalPrice,
    get_saleCategoryId: state => state.saleCategoryId,
    get_pickList: state => state.pickList,
    get_goodesList: state => state.goodesList,
    get_appKeyServe: state => state.appKeyServe,
    get_appServeURL: state => state.appServeURL
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
    },

    // 加挑
    mut_jtotalPrice (state, data) {
      state.jtotalPrice = data
    },

    // 选片师类别
    mut_saleCategoryId (state, data) {
      state.saleCategoryId = data
    },

    // 取件方式
    mut_pickList (state, data) {
      state.pickList = data
    },

    // 商品类别
    mut_goodesList (state, data) {
      state.goodesList = data
    },

    // 服务器key
    mut_appKeyServe (state, data) {
      state.appKeyServe = data
    },
    // 服务器url
    mut_appServeURL (state, data) {
      state.appServeURL = data
    }

  },
  actions: {

  }
}
