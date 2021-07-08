/******************************** tab栏 ***************************************/
<template>
    <div>
        <div class="top-menu-container">
            <span class="logo-title">利亚方舟智能选片系统</span>
            <div class="menu-list-box">
                <ul>
                    <li v-for="(item,index) in tabText" :key="item.ico" :class="index==tabIndex?'active':''" @click="onClickTab(index,item.title)">
                        <div class="icon-img">
                            <!-- <Icon :type="item.ico" /> -->
                            <i class="iconfont" :class="item.ico" ></i>
                        </div>
                        <div class="name">{{item.title}}</div>
                    </li>
                </ul>
            </div>
            <!-- 查看选中弹窗 -->
            <div class="yunmeng right-el" ref="right-el-modals"  v-if="popup" width="200" :mask="false" :closable="false">
              <div style="height: 90vh;overflow: auto;">
                <ul class="product-list">
                  <li v-for="(item, index) in get_picGoods" :value="item.itemGoodsId" :key="index" @click="selGoodsImgFun(item, index)">
                    <span class="name text-h" style="display: inline-block;max-width: 80%">{{ item.name }} </span>
                    <span class="num">
                      <span>[{{item.imgIds.length}}]</span>
                    </span>
                  </li>
                </ul>
              </div>
              <div slot="footer"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ["tabIndex"],
  computed: {
    ...mapGetters("app", [
      "get_picGoods"
    ])
  },
  data () {
    return {
      popup: false,
      tabText: [
        {
          title: "查看全部",
          ico: 'icon-quanbu'
        },
        {
          title: "查看视频",
          ico: 'icon-shipin'
        },
        {
          title: "查看选中",
          ico: 'icon-tupian_xuanzhong'
        },
        {
          title: "查看未选",
          ico: 'icon-weixuanzhong1'
        },
        {
          title: "查看入底",
          ico: 'icon-daoruditu'
        },
        {
          title: "查看入册",
          ico: 'icon-ruceguanli-'
        },
        {
          title: "进入保存",
          ico: 'icon-166991'
        }
      ]
    }
  },
  methods: {
    // 点击tab
    onClickTab (val, title) {
      if (val === 2) {
        this.popup = true
      } else {
        this.popup = false
      }
      this.$emit("onClickTab", { val, title })
    },

    // 点击选中
    selGoodsImgFun (item) {
      let val = 2
      let title = `查看选中-【${item.name}】`
      let num = item.imgIds.length
      let itemGoodsId = `${item.itemGoodsId}`
      this.popup = false
      this.$emit("onClickTab", { val, title, num, itemGoodsId })
    }
  }
}
</script>

<style lang="scss" scoped>
.top-menu-container{
  position: relative;
  height: 80px;
  background: #42A3F8ff;
}
.logo-title{
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: 15px;
}
.menu-list-box{
  height: 100%;
  position: absolute;
  left: 230px;
  >ul{
    height: 100%;
    >li{
      height: 100%;
      padding: 10px;
      cursor: pointer;
      float: left;
      transition: all .3s;
      -webkit-app-region: no-drag;
      align-items: center;
      .icon-img{
        height: 40px;
        text-align: center;
        line-height: 40px;
        >i{
          color: #fff;
          font-size: 24px;
        }
      }
      .name{
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
    }
    >li.active{
      background: #2b85e4;
    }
    >li:hover{
      background: #2b85e4;
    }
  }
}
  .product-list{
    li{
      height: 32px;
      line-height: 32px;
      cursor: pointer;
      padding: 0 10px;
      .name{}
      .num{
        float: right;
      }
      span{
        text-overflow: ellipsis;
        height: 32px;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    li:hover{
      background-color: #e8eaec;
    }
  }
  .right-el{
    z-index: 2000;
width: 200px;
    background: #fff;
    position: absolute;
    top: 80px;
    left: 340px;
    box-shadow: 0 4px 12px rgba(0,0,0,.09);
}

</style>
