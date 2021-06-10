<template>
  <div>
    <div class="index-top-menu">
      <span class="index-logo-title" v-once @click="gotoHome">利亚方舟智能确认设计系统aaaa</span>
      <ul class="d-flex index-menu-list">
        <li v-for="(k, i) in list" :key="i" class="indexli" :class="{'indexActive': isIndexActive==i}" @click="handleClick(k,i)">
          <div class="icon-img">
            <Icon :type="k.iconName" />
            </div>
            <div class="name" v-once>{{k.title}}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import bus from "@/util/bus"
export default {
  data () {
    return {
      isIndexActive: 0,
      list: [
        {
          title: "查看全部",
          routerName: "allImg",
          isActive: false,
          style: 'color:#ffffff',
          isShow: true,
          iconName: "logo-windows",
          moduleId: "1",
          children: []
        },
        {
          title: "确认OK",
          routerName: "allImg",
          isActive: false,
          style: 'color:#ffffff',
          isShow: true,
          iconName: "ios-checkmark-circle",
          moduleId: "1",
          children: []
        },
        {
          title: "待修改",
          routerName: "allImg",
          isActive: false,
          style: 'color:#ffffff',
          isShow: true,
          iconName: "ios-create",
          moduleId: "1",
          children: []
        },
        {
          title: "查看删除",
          routerName: "allImg",
          isActive: false,
          style: 'color:#ffffff',
          isShow: true,
          iconName: "md-eye-off",
          moduleId: "1",
          children: []
        },
        // {
        //   title: "效果图",
        //   routerName: "allImg",
        //   isActive: false,
        //   style: 'color:#ffffff',
        //   isShow: true,
        //   iconName: "icon-xiaoguo",
        //   moduleId: "1",
        //   children: [],
        // },
        {
          title: "全屏播放",
          routerName: "allImg",
          isActive: false,
          style: 'color:#ffffff',
          isShow: true,
          iconName: "md-contract",
          moduleId: "1",
          children: []
        },
        {
          title: "进入保存",
          routerName: "allImg",
          isActive: false,
          style: 'color:#ffffff',
          isShow: true,
          iconName: "md-document",
          moduleId: "1",
          children: []
        }
        //  {
        //   title: "关闭",
        //   routerName: "allImg",
        //   isActive: false,
        //   style: 'color:#ffffff',
        //   isShow: true,
        //   iconName: "icon-power",
        //   moduleId: "1",
        //   children: [],
        // }
      ]
    }
  },
  created () {
    console.log(this.$route)
    // 解决刷新页面，active的bug;indexId在路由中定义；
    this.isIndexActive = this.$route.meta.indexId
  },
  methods: {
    gotoHome () {
      this.$router.push({ name: 'indexAllImg' })
      this.isIndexActive = 0
    },
    handleClick (k, i) {
      /**
       * bus.$emit利用bus传递值
       */
      bus.$emit("indexmenuclick", k)
      this.isIndexActive = i
      if (i == 0) {
        this.$router.push({ name: 'indexAllImg' }).catch(() => {})
      } else if (i == 1) {
        this.$router.push({ name: 'indexOk' }).catch(() => {})
      } else if (i == 2) {
        this.$router.push({ name: 'indexModify' }).catch(() => {})
      } else if (i == 3) {
        this.$router.push({ name: 'indexAllDel' }).catch(() => {})
      } else if (i == 4) {
        console.log('全屏播放')
        const index = 0
        this.$nextTick(() => {
          bus.$emit('fullplay', index)
        })
      } else if (i == 5) {
        bus.$emit('handleSaveFun', k)
        console.log('进入保存')
      } else {
        console.log('di~')
      }
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.isIndexActive = val.meta.indexId
        // console.log(oldVal);
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.d-flex {
  display:flex;
}
.index-top-menu
{
  height: 80px;
  /* background-color: #42A3F8ff; */
  background-color:dodgerblue;
  -webkit-box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.1);
  -webkit-app-region: drag;
  overflow: hidden;
}
.icon-img{
    height: 40px;
    text-align: center;
    line-height: 40px;
    position: relative;
    top: 8px;
}
.name{
    color: #fff;
    font-size: 14px;
    text-align: center;
}
.index-menu-list {
  position: absolute;
  left: 320px;
  height: 80px;
  line-height: 40px;
  cursor: pointer;
}
.indexli {
  /* height:74px; */
  padding: 0 1rem;
  width: 88px;
}
.indexli:hover {
  /* background:#2b85e4; */
  background: #0e6accd1;
}
.indexActive{
    /* background: #2b85e4; */
  background:#0e6accd1;
}
.index-logo-title{
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    display: inline-block;
    position: absolute;
    cursor: pointer;
    top: 41px;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    left: 35px;
}
.icon-img > i {
    color: #fff;
    font-size: 24px;
    font-weight: 500;
}
</style>
