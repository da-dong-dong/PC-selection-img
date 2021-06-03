/******************************** 大图片展示 ***************************************/
<template>
    <div >
      <Spin size="large" style="z-index:2023" fix v-if="loading"></Spin>
        <!-- 所有图片 -->
        <div id="allImgs" >
            <ul style="display:none">
                <li v-for="(item,index) in get_allImg" :key="index" >
                    <img :src="item.url+'&size=s'" class="img">
                </li>
            </ul>
        </div>

        <!-- 两个按按钮 -->
        <div class="buts">
            <img @click="onClickPrev" src="https://s1.ax1x.com/2020/09/04/wFhqaj.png" />
            <img @click="onClickNext" src="https://s1.ax1x.com/2020/09/04/wFhbZQ.png" />
        </div>

        <!-- 右键弹窗 -->
        <div>
          <rightModel :evnets="evnets" v-if="showRightModel" @goodsChange="goodsChange"/>
        </div>

        <!-- 侧边详细信息 -->
        <div class="textRight">
          <p>编号：{{get_allImg[index].id}} 》》被选次数{{selectNum}}</p>
          <p>订单入底张数：{{get_details.bottomCount}}</p>
          <p>订单入册张数：{{get_details.bookCount}}</p>

          <p class="paddingT20">已选入底张数：{{outImgNum}}</p>
          <p>已选入册张数：{{prtImgNum}}</p>

          <p class="paddingT20">入册加挑张数：{{get_details.countBookCount}}</p>
          <p>入底加挑张数：{{get_details.countBottomCount}}</p>

          <p class="paddingT20">相片总张数：{{get_allImg.length}}</p>
          <p>已选总张数：{{selectImgNum}}</p>
          <p>剩余未选相片张数：{{noSelectImgNum}}</p>
          <p>已删相片张数：0</p>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Viewer from '@/util/viewer'
import rightModel from "@/components/rightModel.vue"
export default {
  props: ['imgBigShow', 'imgIndex', 'selectedBig'],
  components: {
    rightModel
  },
  computed: {
    ...mapGetters('typeModule', [
      'get_allImg'

    ]),
    ...mapGetters("app", [
      "get_picGoods",
      'get_details'
    ])
  },
  data () {
    return {
      myViewer: null,
      loading: false,
      config: {
        interval: 3000,
        title: false,
        loop: false,
        // inline: true,
        backdrop: false,
        button: true
      },
      index: 0, // 当前索引
      allImgLength: 0, // 全部图长度
      evnets: null, // 当前事件
      showRightModel: false, // 展示右键
      selectNum: 0, // 被选次数
      prtImgNum: 0, // 入册
      outImgNum: 0, // 入底
      selectImgNum: 0, // 已经选中
      noSelectImgNum: 0 // 没有选中
    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_picGoods'
    ]),
    ...mapMutations("typeModule", [
      "mut_allImg"
    ]),
    // 上一张
    onClickPrev () {
      this.myViewer.prev()
    },

    // 下一张
    onClickNext () {
      if (this.index + 1 === this.allImgLength) {
        alert('已经是最后一张了')
      }
      this.myViewer.next()
    },

    // 勾选商品
    goodsChange (e, val) {
      let arrp = [{ ...this.get_allImg[this.index] }]
      if (e) {
        // 选中
        for (let i = 0; i < arrp.length; i++) {
          if (!arrp[i].goodsNamesId.includes(val.itemGoodsId)) {
            arrp[i].goodsNames.push(val.name)
            arrp[i].goodsNamesId.push(val.itemGoodsId)
            this.$set(arrp[i], 'isCheck', true)
          }
          val.imgIds.push(arrp[i].id)
        }
      } else {
        // 取消选中
        for (let i = 0; i < arrp.length; i++) {
          if (arrp[i].goodsNamesId.includes(val.itemGoodsId)) {
            arrp[i].goodsNames.splice(arrp[i].goodsNames.indexOf(val.name), 1)
            arrp[i].goodsNamesId.splice(arrp[i].goodsNamesId.indexOf(val.itemGoodsId), 1)
          }
          if (val.imgIds.includes(arrp[i].id)) {
            val.imgIds.splice(val.imgIds.indexOf(arrp[i].id), 1)
            this.$set(arrp[i], 'isCheck', false)
          }
        }
      }

      // 更新数据
      let picGoods = this.get_picGoods.map(item => {
        if (item.itemGoodsId === val.itemGoodsId) {
          item.imgIds = val.imgIds
        }
        return item
      })
      this.mut_picGoods(picGoods)
      let allImg = this.get_allImg
      allImg.map(item => {
        let json = {}
        picGoods.map(_ => {
          if (_.imgIds.includes(item.id)) {
            json[_.itemGoodsId] = _.name
          }
        })
        item.goodsNamesId = Object.keys(json)
        item.goodsNames = Object.keys(json).map(item => json[item])
      })
      this.mut_allImg(allImg)
    },

    // 更新所选的
    rightSelectGoods (index, val, event) {
      this.showRightModel = true
      this.evnets = event || this.evnets
      for (let i = 0; i < this.get_picGoods.length; i++) {
        if (this.get_picGoods[i].imgIds.indexOf(val.id) >= 0) {
          delete this.get_picGoods[i].isCheck
          this.$set(this.get_picGoods[i], 'isCheck', true)
        } else {
          delete this.get_picGoods[i].isCheck
          this.$set(this.get_picGoods[i], 'isCheck', false)
        }
      }
    },

    // 被选次数
    onselectNum () {
      let target = this.get_allImg[this.index].id
      let selectNum = 0
      let noSelectImgNum = 0
      let prtImgNum = 0
      let outImgNum = 0
      this.get_picGoods.map(item => {
        if (item.imgIds.includes(target)) {
          selectNum++
        }
      })
      this.get_allImg.map(item => {
        if (item.goodsNames.length === 0) {
          noSelectImgNum++
        }
        if (item.goodsNames.includes('入册')) {
          prtImgNum++
        }
        if (item.goodsNames.includes('入底')) {
          outImgNum++
        }
      })
      this.selectNum = selectNum
      this.noSelectImgNum = noSelectImgNum
      this.selectImgNum = this.get_allImg.length - noSelectImgNum
      this.prtImgNum = prtImgNum
      this.outImgNum = outImgNum
    },

    // 更新数据
    updateImgBig () {
      this.loading = true
      setTimeout(() => {
        this.myViewer.update()
        this.loading = false
      }, 1000)
    }
  },
  mounted () {
    this.allImgLength = this.get_allImg.length
    this.$nextTick(() => {
      this.myViewer = new Viewer(document.getElementById('allImgs'), {
        ...this.config,
        view: (e) => {
          this.index = e.detail.index
          let _this = this
          const next1 = document.querySelector('.viewer-next')

          next1.onclick = function (v) {
            if (_this.index + 1 === _this.allImgLength) {
              alert('已经是最后一张了')
            }
          }

          // 计算被选次数
          this.onselectNum()
        },
        viewed: (e) => {
          let index = e.detail.index
          const vc = document.getElementsByClassName('viewer-canvas')[0]// 大图dom父地址
          const vcimg4 = vc.firstElementChild// 大图地址
          // 右键
          vcimg4.oncontextmenu = (event) => {
            event.preventDefault()
            this.rightSelectGoods(index, this.get_allImg[index], event)
          }

          // 更新当前图片
          this.$emit("update:selectedBig", [this.get_allImg[index]])

          // 更新右键
          !this.showRightModel || this.rightSelectGoods(index, this.get_allImg[index])

          // 点击整个页面
          vc.onclick = (e) => {
            e.preventDefault()
            this.showRightModel = false
          }
        },
        url: (image) => {
          return image.src.replace('&size=s', '&size=p')
        },
        hidden: () => {
          console.log('消失')
          const vc = document.getElementsByClassName('viewer-canvas')[0]// 大图dom父地址
          vc.parentNode.removeChild(vc)
          this.$emit("update:imgBigShow", false)
        }
      })
      //
      this.myViewer.view(this.imgIndex)
    })
  },
  watch: {

  }

}
</script>

<style lang="scss">
.textRight{
    position: fixed;
    top: 30px;
    left: 50px;
    z-index: 2022;
    color: #fff;
}
.viewer-container{
    background: black;
}
.buts{
        position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2021;
    transform: translate(-50%, -50%);
    width: 90%;
    display: flex;
    justify-content: space-between;
    img{
        width:48px;
        height:48px;
    }
}
.ivu-modal-wrap{
    z-index: 2022 !important;
}
</style>
