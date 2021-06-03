/******************************** 首页 ***************************************/
<template>
  <div class="container">

    <!-- 检测http弹框 -->
    <checkHttpModal @httpAllImg="httpAllImg" v-if="picServerModel"/>

    <!-- tab导航栏 -->
    <tab />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getChooseDetails } from '@/api/apiAll.js'
import { parseUrl } from '@/util/util.js'
import checkHttpModal from "./checkHttp/checkHttpModal.vue"
import tab from "./tab/tab.vue"
export default {
  components: {
    checkHttpModal,
    tab
  },
  computed: {
    ...mapGetters('app', [
      'get_parseUrl',
      'get_picGoods',
      'get_delImgs'
    ])
  },
  data () {
    return {
      parseUrlJson: {}, // url参数
      picServerModel: true // 检测http弹框

    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_setParseUrl',
      'mut_picGoods',
      'mut_details',
      'mut_delImgs'
    ]),
    ...mapMutations('typeModule', [
      'mut_allImg'

    ]),

    // 全部图片集合
    httpAllImg (val) {
      this.picServerModel = false
      let allImg = []
      console.log(val, this.get_picGoods)
      // 添加商品字段goodsNames  [1, 2, 3].includes(2)
      val.map(item => {
        let json = {}
        this.get_picGoods.map(_ => {
          if (_.imgIds.includes(item.id)) {
            json[_.itemGoodsId] = _.name
          }
        })
        item.goodsNamesId = Object.keys(json)
        item.goodsNames = Object.keys(json).map(item => json[item])
      })
      // 判断是否刷新之后
      let delId = this.get_delImgs
      if (delId.length > 0 && Object.prototype.toString.call(delId[0]) === '[object Object]') {
        delId = delId.map(item => item.id)
      }
      allImg = val.filter(item => !delId.includes(item.id))
      this.mut_allImg(allImg)
      this.mut_delImgs(val.filter(item => delId.includes(item.id)))
    },

    // 获取选片详情
    getChooseDetails (itemId) {
      getChooseDetails({ itemId }).then(res => {
        let { orderItempProcessChooseGoodsVos, completeJson, bookCount, bottomCount, countBookCount, countBottomCount } = res.data
        let json = {
          countNum: 0,
          countP: 0,
          defaultP: 0,
          expeditedTime: "",
          goodsId: 0,
          itemGoodsId: -1,
          name: "入底",
          orderNum: 0,
          orderP: 0,
          pSalePrice: 0,
          pickupModeCategoryId: [],
          remark: "",
          salePrice: 0,
          sourceProducts: "",
          p_list: [],
          imgIds: [],
          isCheck: false
        }
        let picGoods = []
        let delImgs = []
        let picGoodsTow = [json, { ...json }]
        picGoodsTow[1].name = "入册"
        picGoodsTow[1].itemGoodsId = -2
        // 选片信息
        if (completeJson) {
          completeJson = JSON.parse(completeJson)
          picGoods = [...completeJson.productList]
          delImgs = completeJson.delImgs
          let lodArr = [picGoods.pop(), picGoods.pop()]
          // 循环过滤新增商品
          let set = picGoods.map(item => item.itemGoodsId)
          let resArr = orderItempProcessChooseGoodsVos.filter(item => !set.includes(item.itemGoodsId))

          resArr.map(item => {
            let goodsJson = {
              p_list: [], // 虚拟设置p数
              imgIds: [], // 所选的图片
              isVirtualDesign: 0, // 是否虚拟设计
              itemGoodsId: item.itemGoodsId, // 商品唯一编号
              name: item.name, // 商品名字
              goodsId: item.goodsId, // 商品id
              countP: item.countP // 默认p的数量
            }
            picGoods.push(goodsJson)
          })
          picGoods.push(...lodArr)
        } else {
          orderItempProcessChooseGoodsVos.map(item => {
            let goodsJson = {
              p_list: [], // 虚拟设置p数
              imgIds: [], // 所选的图片
              isVirtualDesign: 0, // 是否虚拟设计
              itemGoodsId: item.itemGoodsId, // 商品唯一编号
              name: item.name, // 商品名字
              goodsId: item.goodsId, // 商品id
              countP: item.countP // 默认p的数量
            }
            picGoods.push(goodsJson)
          })
          picGoods.push(...picGoodsTow)
        }
        // 存储勾选商品信息
        this.mut_picGoods(picGoods)

        // 存储删除信息
        this.mut_delImgs(delImgs)
        // console.log(orderItempProcessChooseGoodsVos, picGoods, completeJson)

        // 存储选片详情
        let ditelJson = { bookCount, bottomCount, countBookCount, countBottomCount }
        this.mut_details(ditelJson)
      }).catch(err => {
        console.log(`获取选片详情:`, err)
      })
    }

  },
  created () {
    this.parseUrlJson = parseUrl(window.location.href)

    // 存储到vuex中
    if (!this.get_parseUrl.itemId) {
      this.mut_setParseUrl(this.parseUrlJson)

      // 获取选片详情
      this.getChooseDetails(this.get_parseUrl.itemId)
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  position: relative;
    min-height: 100vh;
    width: 100%;

}
</style>
