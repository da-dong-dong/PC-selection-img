/******************************** 右键弹窗 ***************************************/
<template>
    <div>
        <Modal class="yunmeng right-el" :mask="false" ref="right-el-modal" v-model="popup1" :closable="false" width="400">
            <div class="title" slot="header">
                <span v-once>添加到产品</span>
                <span class="dianji" v-if="get_moduleFlge==1" @click="showPopup">点击添加相片修改要求</span>
                <span class="dianji" style="cursor: not-allowed;" v-else >点击添加相片修改要求</span>
            </div>
            <div>
                <div class="box autoHiehgt">
                <ul class="list-box">
                    <li v-for="(item, index) in get_picGoods" :key="index">
                    <span class="check">
                        <span class="p-list-check" v-if="checkP(item)" @click="p_list_init">
                          <span class="check"><Icon type="md-remove"/></span>
                          {{ item.name }}
                        </span>
                        <!--背壳车摆-->
                        <Checkbox v-else v-model="item.isCheck" :disabled="get_moduleFlge==2" @on-change="goodsChange($event, item)">{{ item.name }}</Checkbox>
                    </span>
                    <span class="num" >
                        <span>[{{item.imgIds.length || 0}}]</span>
                    </span>
                    <span v-if="get_moduleFlge==1" class="sheji" @click="virtualFun(item)">
                        <span v-if="item.name != '入底' && item.name != '入册'">虚拟设计</span>
                    </span>
                    <span v-else class="sheji" style="cursor: not-allowed;" >
                        <span v-if="item.name != '入底' && item.name != '入册'">虚拟设计</span>
                    </span>
                    <span class="shuoming" >
                        <span v-if="item.p_img_count >= 1">标记说明</span>
                        <span v-else-if="get_moduleFlge==2" class="s" style="cursor: not-allowed;">标记说明</span>
                        <span v-else class="s" @click="linkFun(item)">标记说明</span>
                    </span>

                    </li>
                </ul>
                </div>
            </div>
      <div slot="footer"></div>
    </Modal>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['evnets'],
  computed: {
    ...mapGetters("typeModule", [
      "get_moduleFlge"
    ]),
    ...mapGetters("app", [
      "get_picGoods"
    ])
  },
  data () {
    return {
      popup1: true,
      productList: []

    }
  },
  mounted () {
    this.$nextTick(() => {
      let modal = this.$refs['right-el-modal'].$el
      let div = modal.querySelector(".ivu-modal")
      // ivu-modal
      let DH = div.clientHeight
      let DW = div.clientWidth
      let BH = document.body.clientHeight
      let BW = document.body.clientWidth
      let l = this.evnets.clientX
      let t = this.evnets.clientY
      div.style.position = "absolute"
      // 计算 X轴位置
      if (DW + l > BW) {
        div.style.left = `${l - DW}px`
      } else {
        div.style.left = `${l}px`
      }
      // 计算Y轴
      if (DH + t > BH) {
        div.style.top = `${t - DH}px`
      } else {
        div.style.top = `${t}px`
      }
    })
  },
  methods: {
    // 检测p
    checkP (item) {
      if (item.p_list.length === 0) {
        return false
      }
      if (item.p_list.length >= 1 && item.imgIds.length > 0) {
        if (item.p_list[0].imgArr.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    // 勾选按钮
    goodsChange (e, val) {
      this.$emit("goodsChange", e, val)
    },

    // 已有虚拟设计提示
    p_list_init () {
      this.$Modal.warning({
        title: "提示",
        content: `当前商品已启用了 "虚拟设计" 并已选择了相片。请打开 "虚拟设计" 进行修改`
      })
    },

    // // 跳转相关产品查看图片
    // showProductImg (k) {
    //   this.$router.push({ name: "selectedList", query: { id: k.goodsId } })
    // },

    // 携带id 跳转虚拟设计页面
    virtualFun (val) {
      this.$emit("onPlist", val)
      // 关闭弹窗
      this.$emit("onClickShowModel")
    },

    // 标记说明
    linkFun (val) {
      this.$emit("onClickPS", val)
    },

    // 弹窗客人要求
    showPopup () {
      this.$emit("showPopup")
      this.$emit("onClickShowModel")
    }

  },
  watch: {
    evnets: {
      handler (newName, oldName) {
        this.$nextTick(() => {
          let modal = this.$refs['right-el-modal'].$el
          let div = modal.querySelector(".ivu-modal")
          // ivu-modal
          let DH = div.clientHeight
          let DW = div.clientWidth
          let BH = document.body.clientHeight
          let BW = document.body.clientWidth
          let l = this.evnets.clientX
          let t = this.evnets.clientY
          div.style.position = "absolute"
          // 计算 X轴位置
          if (DW + l > BW) {
            div.style.left = `${l - DW}px`
          } else {
            div.style.left = `${l}px`
          }
          // 计算Y轴
          if (DH + t > BH) {
            div.style.top = `${t - DH}px`
          } else {
            div.style.top = `${t}px`
          }
        })
      },
      deep: true
    }
  }
}

</script>

<style lang="scss" scoped>
.right-el{
  .title{
    height: 20px;
    line-height: 20px;
    color: #fff;
    .dianji{
      float: right;
      text-decoration: underline;
      cursor: pointer;
    }
  }
  .box{
    padding: 10px 10px 0 10px;
    .list-box{
      >li{
        padding-bottom: 10px;
        display: flex;
        >span:nth-child(1){
          flex: 5;
        }
        >span:nth-child(2){
          flex: 1;
          display: flex;
          justify-content: center;
          cursor: pointer;
        }
        >span:nth-child(3){
          display: flex;
          justify-content: center;
          flex: 2;
          cursor: pointer;
          color: #2d8cf0;
        }
        >span:nth-child(4){
          display: flex;
          justify-content: center;
          flex: 2;
          .s{
            text-decoration: underline;
            cursor: pointer;
            color: #2d8cf0;
          }
        }
      }
    }
  }
}
.autoHiehgt{
  max-height:450px;
  overflow: auto;
}
.p-list-check{
    .check{
        display: inline-block;
    width: 16px;
    height: 16px;
    background-color: #2d8cf0;
    line-height: 15px;
    text-align: center;
    border-radius: 2px;
    vertical-align: middle;
    }
    i{
      color: #fff;
    }
}
</style>
