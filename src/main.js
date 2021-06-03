import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ViewUI from 'view-design'
import 'view-design/dist/styles/iview.css'
import vueDragSelectPro from 'vue-drag-select-pro'
import 'vue-drag-select-pro/lib/vueDragSelectPro.css'
import VueDND from 'awe-dnd' // 拖拽
import VueLazyload from 'vue-lazyload'
import 'viewerjs/dist/viewer.css' // 大图样式
import Viewer from 'v-viewer'

Vue.use(Viewer)
Vue.use(vueDragSelectPro)
Vue.use(VueDND)
Vue.use(ElementUI)
Vue.use(ViewUI)
// 图片懒加载
Vue.use(VueLazyload, {
  loading: require('./assets/timg.gif')
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
