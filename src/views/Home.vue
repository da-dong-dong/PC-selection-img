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
import { getChooseDetails, getItemChooseSaleSumPrice, getCategoryId, categoryList } from '@/api/apiAll.js'
import { parseUrl, formatDate } from '@/util/util.js'
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
      'get_delImgs',
      'get_record',
      'get_details'
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
      'mut_delImgs',
      'mut_record',
      "mut_customerInstructions",
      "mut_photoInstructions"
    ]),
    ...mapMutations('typeModule', [
      'mut_allImg',
      'mut_jtotalPrice',
      'mut_saleCategoryId',
      'mut_pickList',
      'mut_goodesList'
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
        let { orderItempProcessChooseGoodsVos, completeJson, bookCount, bottomCount, countBookCount, countBottomCount, contactNames, orderNo, itemNo, financeId, orderId } = res.data
        console.log(res.data)
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
          // 判断是否使用选片记录
          completeJson = this.get_record ? this.get_record : JSON.parse(completeJson)
          picGoods = []
          orderItempProcessChooseGoodsVos.map(item => {
            completeJson.productList.map(_ => {
              if (item.itemGoodsId === _.itemGoodsId) {
                let json = {
                  ..._,
                  salePrice: item.salePrice, // 销售价格
                  countNum: item.countNum, // 总数量
                  remark: item.remark, // 备注
                  pSalePrice: item.pSalePrice, // P销售价格
                  isInputPNum: false, // 修改p数量
                  isInputNum: false, // 修改数量
                  isBeizhu: false, // 修改备注
                  goodsStatus: item.goodsStatus, // 商品状态
                  pickupModeCategoryId: [item.pickupModeCategoryId] || '' // 更新id
                }
                if (item.expeditedTime) {
                  if (item.expeditedTime.toString().length === 10) {
                    json.expeditedTime = formatDate(item.expeditedTime * 1000)
                  } else {
                    json.expeditedTime = formatDate(item.expeditedTime)
                  }
                } else {
                  json.expeditedTime = ''
                }
                picGoods.push(json)
              }
            })
          })
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
              countP: item.countP, // 默认p的数量
              salePrice: item.salePrice, // 销售价格
              countNum: item.countNum, // 总数量
              remark: item.remark, // 备注
              pSalePrice: item.pSalePrice, // P销售价格
              isInputPNum: false, // 修改p数量
              isInputNum: false, // 修改数量
              isBeizhu: false, // 修改备注
              goodsStatus: item.goodsStatus, // 商品状态
              pickupModeCategoryId: [item.pickupModeCategoryId] || '' // 更新id
            }
            // 加急时间
            if (item.expeditedTime) {
              if (item.expeditedTime.toString().length === 10) {
                goodsJson.expeditedTime = formatDate(item.expeditedTime * 1000)
              } else {
                goodsJson.expeditedTime = formatDate(item.expeditedTime)
              }
            } else {
              goodsJson.expeditedTime = ''
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
              countP: item.countP, // 默认p的数量
              salePrice: item.salePrice, // 销售价格
              countNum: item.countNum, // 总数量
              remark: item.remark, // 备注
              pSalePrice: item.pSalePrice, // P销售价格
              isInputPNum: false, // 修改p数量
              isInputNum: false, // 修改数量
              isBeizhu: false, // 修改备注
              goodsStatus: item.goodsStatus, // 商品状态
              pickupModeCategoryId: [item.pickupModeCategoryId] || '' // 更新id
            }
            // 加急时间
            if (item.expeditedTime) {
              if (item.expeditedTime.toString().length === 10) {
                goodsJson.expeditedTime = formatDate(item.expeditedTime * 1000)
              } else {
                goodsJson.expeditedTime = formatDate(item.expeditedTime)
              }
            } else {
              goodsJson.expeditedTime = ''
            }
            picGoods.push(goodsJson)
          })
          picGoods.push(...picGoodsTow)
        }
        // 过滤删除的商品
        picGoods = picGoods.filter(item => item.goodsStatus === 'NORMAL')
        // 存储勾选商品信息
        this.mut_picGoods(picGoods)

        // 存储删除信息
        this.mut_delImgs(delImgs)
        console.log(orderItempProcessChooseGoodsVos, picGoods, completeJson)

        // 存储选片详情
        let ditelJson = { bookCount, bottomCount, countBookCount, countBottomCount, contactNames: contactNames[0], orderNo, itemNo, financeId, orderId }
        this.mut_details(ditelJson)

        // 存储客户信息，相片备注
        let getJsonPhone = {}
        completeJson.photoInstructions.split("\n").map(item => item.split(":")).map(res1 => {
          if (res1[0]) {
            getJsonPhone[res1[0]] = res1[1]
          }
        })
        this.mut_customerInstructions(completeJson.customerInstructions)
        this.mut_photoInstructions(getJsonPhone)

        // 清除缓存记录
        this.mut_record('')
      }).catch(err => {
        console.log(`获取选片详情:`, err)
      })
    },

    // 获取加挑信息
    getItemChooseSaleSumPrice (itemId) {
      getItemChooseSaleSumPrice({ itemId }).then(res => {
        this.mut_jtotalPrice(res.data)
      })
    },

    // 获取选片师类别
    getCategoryId () {
      const params = {
        categoryType: 'SALES_NAME',
        name: '选片师二销'
      }
      getCategoryId(params).then(res => {
        this.mut_saleCategoryId(res.data)
      })
    },

    // 取件方式
    categoryList (t) {
      let parmas = {
        compare: "",
        id: "",
        idisCategoryMenu: "",
        level: "",
        parentId: "",
        type: t
      }
      categoryList(parmas).then(res => {
        console.log(res.data)
        this.mut_pickList(res.data)
      })
    },
    // 商品类别
    goodsCategoryList (t) {
      let parmas = {
        compare: "",
        id: "",
        idisCategoryMenu: "",
        level: "",
        parentId: "",
        type: t
      }
      categoryList(parmas).then(res => {
        console.log(res.data)
        this.mut_goodesList(res.data)
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

    // 是否使用缓存记录
    if (this.get_record) {
      this.getChooseDetails(this.get_parseUrl.itemId)
    }

    // 获取加挑信息
    this.getItemChooseSaleSumPrice(this.get_parseUrl.itemId)
    // 获取选片师类别
    this.getCategoryId()
    // 取件方式
    this.categoryList("PICKUP_METHOD")
    // 商品类别
    this.goodsCategoryList("GOODS")
    // 查找是否有缓存图片
    if (window.MainWindow) {
      window.MainWindow.fsSlectImg(this.get_details.orderNo)
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
