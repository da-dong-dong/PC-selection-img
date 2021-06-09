import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

// 上面是原片的，下面是设计片的
import index from '../page/index.vue'
import indexAllImg from '../page/all/all.vue'
import indexOk from '../page/ok/ok.vue'
import indexAllDel from '../page/allDel/allDel.vue'
import indexDesign from '../page/design/design.vue'
import indexModify from '../page/modify/modify.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  // 下面是设计片
  {
    path: '/index',
    name: 'index',
    component: index,
    children: [
      {
        path: '/index/allImg',
        name: 'indexAllImg',
        title: '查看全部',
        meta: {
          title: '[全部]-相片列表',
          indexId: '0'
        },
        component: indexAllImg
      },
      {
        path: '/index/ok',
        name: 'indexOk',
        title: '确认OK',
        meta: {
          title: '[设计确认OK]-相片列表',
          indexId: '1'
        },
        component: indexOk
      },
      {
        path: '/index/modify',
        name: 'indexModify',
        title: '待修改',
        meta: {
          title: '[设计需要修改]-相片列表',
          indexId: '2'
        },
        component: indexModify
      },
      {
        path: '/index/allDel',
        name: 'indexAllDel',
        title: '查看删除',
        meta: {
          title: '[删除]-相片列表',
          indexId: '3'
        },
        component: indexAllDel
      },
      {
        path: '/index/design',
        name: 'indexDesign',
        title: '效果图',
        meta: {
          title: '效果图',
          indexId: '4'
        },
        component: indexDesign
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
