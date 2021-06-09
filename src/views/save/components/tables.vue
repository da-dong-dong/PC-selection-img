/******************************** tab栏  内容 ***************************************/

<template>
    <div>
        <div class="goods-table my-table">
          <Table border :columns="columns1" :data="get_picGoods" height="300" @on-contextmenu="rightFun">
            <template slot-scope="{ row }" slot="bianhao">{{ row.name }}</template>
            <template slot-scope="{ row }" slot="shangpingmingchen">{{row.name}}</template>
            <template slot-scope="{ row }" slot="jiage">{{row.salePrice}}</template>
            <template slot-scope="{ row, index }" slot="pshuliang">
              <div v-if="!row.isInputPNum" @dblclick="showInput(row, index, 'isInputPNum')" :style="`height: 100%;width: 100%;color:${row.countP > row.defaultP ? 'red' : '#1a1a1a'}`">{{ row.countP }}</div>
              <input class="product-table-input" type="number" :ref="`isInputPNum${index}`" v-if="row.isInputPNum" @blur="hideInputFun(row)" v-model="row.countP" @change="inputChange($event, row, index, 'countP')"/>
            </template>
            <template slot-scope="{ row, index }" slot="shuliang">
              <div v-show="!row.isInputNum" @dblclick="showInput(row, index, 'isInputNum')" style="height: 100%;width: 100%;">{{ row.countNum }}</div>
              <input class="product-table-input" type="number" :ref="`isInputNum${index}`" v-if="row.isInputNum" @blur="hideInputFun(row)" v-model="row.countNum" @change="inputChange($event, row, index, 'countNum')"/>
            </template>
            <template slot-scope="{ row }" slot="yingshoujiage">
              <span>{{ row.pSalePrice }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="qujianriqi">
              <DatePicker
                size="small"
                type="date"
                v-if="row.name !== '入底' && row.name !== '入册'"
                 :transfer="true"
                v-model="row.expeditedTime"
                placeholder="请选择"
                style="width: 100%"
                @on-change="dateChange($event, row, index)"></DatePicker>
            </template>
            <template slot-scope="{ row, index }" slot="qujianfangshi">
              <Cascader
                :transfer="true"
                v-model="row.pickupModeCategoryId"
                v-if="row.name !== '入底' && row.name !== '入册'"
                :data="pickupArr"
                size="small"
                @on-change="inputChange($event, row, index, 'pickupModeCategoryId')"></Cascader>
            </template>
            <template slot-scope="{ row, index }" slot="beizhu">
              <div
                v-show="!row.isBeizhu"
                @dblclick="showInput(row, index, 'isBeizhu')"
                v-if="row.name !== '入底' && row.name !== '入册'"
                style="height: 26px;width: 100%;">
                {{ row.remark }}
              </div>
              <input
                class="product-table-input"
                type="text"
                :ref="`isBeizhu${index}`"
                v-if="row.isBeizhu && row.name !== '入底' && row.name !== '入册'"
                @blur="hideInputFun(row)"
                v-model="row.remark"
                @change="inputChange($event, row, index, 'remark')"/>
            </template>
            <template slot-scope="{ row }" slot="xiangpianbianhao">{{ photoNoText(row) }}</template>
          </Table>
        </div>
        <!-- 产品表格 右键 -->
        <Modal class="yunmeng right-el" ref="right-el-modal2" v-model="popup8" width="200" :mask="false" :closable="false">
          <div>
              <ul class="product-right">
              <li @click="operationFun(3)">
                  <span class="name text-h" style="display: inline-block">加选商品</span>
              </li>
              <li @click="operationFun(4)">
                  <span class="name text-h" style="display: inline-block">商品升级</span>
              </li>
              <li @click="operationFun(6)">
                  <span class="name text-h" style="display: inline-block">重选</span>
              </li>
              <li @click="operationFun(7)">
                  <span class="name text-h" style="display: inline-block">全部重选</span>
              </li>
              <li  @click="operationFun(8)" >
                  <span class="name text-h" style="display: inline-block">删除</span>
              </li>
              </ul>
          </div>
          <div slot="footer"></div>
        </Modal>

         <!-- 加选商品 -->
    <Modal
      class="yunmeng"
      class-name="vertical-center-modal"
      v-model="popup10"
      :title="isUpgrade ? '商品升级' : '加选商品'"
      :mask="false"
      width="900">
      <div style="padding: 10px;">
        <div>
          <span style="vertical-align: middle;">商品类别：</span>
          <Cascader
            style="width: 150px;display: inline-block;"
            :data="goodsTypeArr"
            ref="refCascader"
            @on-change="goodsTypeChange"
           ></Cascader>
          <div style="display: inline-block;width: 200px;vertical-align: middle;position: relative;top: -1px;margin-left: 10px;">
            <Input search enter-button placeholder="搜索" v-model="goodsName" @on-search="searchFun"/>
          </div>
          <Button type="info" style="position: relative;margin-left: 10px;" @click="refreshFun">刷新商品档案</Button>
        </div>
        <div class="jiatiao-goods-list my-table">
          <div class="left-list">
            <Table border :columns="goodsHead" :data="goodsList" height="400">
              <template slot-scope="{ row }" slot="caozuo">
                <Button size="small"  type="primary" @click.stop="addGoods(row)">添加</Button>
              </template>
            </Table>
          </div>
          <div class="right-list" style="border: 1px solid #e8eaec;">
            <div class="sel-goods-list sel-goods-list-head" style="background-color: #f8f8f9">
              <span>商品名称</span>
              <span>销售价</span>
              <span>商品P数</span>
              <span>操作</span>
            </div>

            <div v-for="(k, i) in increaseList" :key="k.id">
              <p class="list-label">{{ k.name }}</p>
              <div class="sel-goods-list" v-for="(s, si) in k.goodsList" :key="`${s.id}-${si}`" @dblclick="delIncreaseGoodsFun(k, i, s, si)">
                <span>{{ s.name }}</span>
                <span>{{ s.pSalePrice }}</span>
                <span>{{ s.defaultP }}</span>
                <span><Button size="small" type="warning" @click="delIncreaseGoodsFun(k, i, s, si)">删除</Button></span>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" style="padding:0 10px 10px 10px;text-align: right;">
          <Button type="primary" @click="saveGoodsListFun">确定</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="default" @click="popup10 = false">取消</Button>
        </div>
      </div>
    </Modal>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { updateChildData, getGoodsList, andChoose, upChildOrderGrade, delChildOrder } from '@/api/apiAll.js'
export default {
  computed: {
    ...mapGetters('app', [
      'get_picGoods',
      'get_parseUrl'
    ]),
    ...mapGetters('typeModule', [
      'get_pickList',
      'get_goodesList',
      'get_allImg'
    ])
  },
  data () {
    return {
      columns1: [
        {
          title: "商品名称",
          key: "age",
          ellipsis: true,
          width: 100,
          slot: "shangpingmingchen"
        },
        {
          title: "价格",
          ellipsis: true,
          slot: "jiage",
          width: 50,
          key: "salePrice"
        },
        {
          title: "P数量",
          ellipsis: true,
          width: 60,
          slot: "pshuliang",
          key: "address"
        },
        {
          title: "数量",
          ellipsis: true,
          width: 60,
          slot: "shuliang",
          key: "address"
        },
        {
          title: "销售价",
          ellipsis: true,
          width: 60,
          slot: "yingshoujiage",
          key: "pSalePrice"
        },
        {
          title: "加急日期",
          ellipsis: true,
          slot: "qujianriqi",
          width: 180,
          key: "expeditedTime"
        },
        {
          title: "取件方式",
          ellipsis: true,
          slot: "qujianfangshi",
          width: 100
        },
        {
          title: "备注",
          slot: "beizhu",
          ellipsis: true,
          width: 200
        },
        {
          title: "相片编号",
          ellipsis: true,
          slot: "xiangpianbianhao",
          width: 300
        }
      ],
      pickupArr: [],
      popup8: false,
      popup10: false, // 加选商品
      isUpgrade: true, // 加选   升级
      goodsTypeArr: [], // 商品类别
      goodsName: "", // 类别名称搜索
      goodsTypeVal: [],
      goodsList: [], // 商品数据
      increaseSelGoodsObj: {}, // 商品选中对象
      rightSaveTableData: {}, // 列表选中对象
      goodsHead: [
        {
          title: "商品名称",
          key: "name",
          ellipsis: true
        },
        {
          title: "销售价",
          width: 60,
          align: "center",
          key: "salePrice",
          ellipsis: true
        },
        {
          title: "商品P数",
          width: 60,
          align: "center",
          key: "defaultP",
          ellipsis: true
        },
        {
          title: "操作",
          width: 80,
          align: "center",
          key: "caozuo",
          ellipsis: true,
          slot: "caozuo"
        }
      ],
      increaseList: [] // 右侧值
    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_picGoods'
    ]),
    ...mapMutations('typeModule', [
      'mut_allImg'
    ]),

    //  右键弹框
    rightFun (d, e) {
      e.stopPropagation()
      e.preventDefault()
      let modal = this.$refs["right-el-modal2"].$el
      let div = modal.querySelector(".ivu-modal")
      div.style.position = "absolute"
      div.style.left = `${e.x}px`
      div.style.top = `${e.y}px`
      div.style.zIndex = '3000'
      this.popup8 = true
      this.rightSaveTableData = d
    },
    // 右键点击
    operationFun (e) {
      let goodsArr = []
      let valImgs = this.get_allImg
      switch (e) {
        case 3:
          // 添加商品
          this.getGoodsList()
          this.increaseSelGoodsObj = {}
          this.increaseList = []
          this.isUpgrade = false
          this.popup10 = true
          break
        case 4:
          // 升级产品
          this.increaseSelGoodsObj = {}
          this.increaseList = []
          this.isUpgrade = true
          this.popup10 = true
          break
        case 6:
          // 重选当前
          goodsArr = this.get_picGoods.map(item => {
            if (this.rightSaveTableData.itemGoodsId === item.itemGoodsId) {
              item.imgIds = []
              item.p_list = []
            }
            return item
          })
          // 更新全部图片
          valImgs.map(item => {
            let json = {}
            goodsArr.map(_ => {
              if (_.imgIds.includes(item.id)) {
                json[_.itemGoodsId] = _.name
              }
            })
            item.goodsNamesId = Object.keys(json)
            item.goodsNames = Object.keys(json).map(item => json[item])
          })

          // 存储商品信息
          this.mut_picGoods(goodsArr)
          this.mut_allImg(valImgs)
          break
        case 7:
          // 全部重选
          goodsArr = this.get_picGoods.map(item => {
            item.imgIds = []
            item.p_list = []
            return item
          })
          // 更新全部图片
          valImgs.map(item => {
            let json = {}
            goodsArr.map(_ => {
              if (_.imgIds.includes(item.id)) {
                json[_.itemGoodsId] = _.name
              }
            })
            item.goodsNamesId = Object.keys(json)
            item.goodsNames = Object.keys(json).map(item => json[item])
          })

          // 存储商品信息
          this.mut_picGoods(goodsArr)
          this.mut_allImg(valImgs)
          break
        case 8:
          // 删除
          this.delChildOrder(this.rightSaveTableData.itemGoodsId)
          break
      }
      this.popup8 = false
      console.log(e)
    },
    // 关闭弹窗
    outRightShow () {
      this.popup8 = false
    },

    // 更新当前数据
    upData (itemGoodsId, type, val, row) {
      // 提交接口，更新数据
      let params = {
        countNum: row.countNum,
        countP: row.countP,
        expeditedTime: row.expeditedTime ? new Date(row.expeditedTime).getTime() : 0,
        id: row.itemGoodsId,
        pickupModeCategoryId: row.pickupModeCategoryId[row.pickupModeCategoryId.length - 1] || '',
        remark: row.remark
      }
      updateChildData(params).then(res => {
        if (res.code === 200) {
          let goodsArr = this.get_picGoods.map(item => {
            if (itemGoodsId === item.itemGoodsId) {
              item[type] = val
            }
            return item
          })
          // 存储勾选商品信息
          this.mut_picGoods(goodsArr)
        }
      })
    },

    // 显示输入框并自动获取焦点
    showInput (k, i, n) {
      if (k.name !== "入册" && k.name !== "入底") {
        k[n] = true
        this.$nextTick(() => {
          this.$refs[`${n}${i}`].focus()
        })
      }
    },

    // 时间格式
    dateChange (e, k, i) {
      console.log(e, k, i)
      this.upData(k.itemGoodsId, 'expeditedTime', e, k)
    },

    // 修改数量
    inputChange (e, row, index, val) {
      let es = row[val]
      if (e instanceof Array) {
        es = e
      }
      this.upData(row.itemGoodsId, val, es, row)
    },

    // 隐藏输入框
    hideInputFun (k) {
      k.isInputPNum = false
      k.isInputNum = false
      k.isInputSalePrice = false
      k.isBeizhu = false
    },
    photoNoText (k) {
      let str = ``
      let num = 0
      let arr = []
      let arr2 = []
      k.imgIds.forEach((s) => {
        arr.push(s.slice(s.lastIndexOf(`\\`) + 1))
      })
      if (k.name === "入底" || k.name === "入册") {
        if (arr.length >= 1) {
          return (str = `共${k.imgIds.length + num}张，${arr.join(",")}`)
        } else {
          return str
        }
      }
      arr2 = [...arr]
      if (arr2.length >= 1) {
        str = `共${k.imgIds.length}张，${arr.join(",")}`
      }
      return str
    },
    // 递归遍历树结构
    multistageFun (d) {
      let data = JSON.parse(d)
      let map = {}
      let arr = []
      data.forEach((k) => {
        map[k.id] = k
      })
      // console.log(map);
      data.forEach((k) => {
        let parent = map[k.parentId]
        if (parent) {
          (parent.children || (parent.children = [])).push(
            Object.assign(k, { label: k.name, value: k.id })
          )
        } else {
          arr.push(Object.assign(k, { label: k.name, value: k.id }))
        }
      })
      return arr
    },

    // 商品选择
    goodsTypeChange (val) {
      this.goodsName = ""
      this.goodsTypeVal = val
      this.getGoodsList()
    },

    // 搜索
    searchFun () {
      this.goodsTypeVal = []
      this.getGoodsList()
    },

    // 添加到右侧
    addGoods (k) {
      // 获取商品类型
      console.log('k addgoods获取商品类型-----------')
      let id = this.goodsTypeVal[this.goodsTypeVal.length - 1] || k.categoryId
      // let id =k.categoryId;
      this.getIdData(this.goodsTypeArr, "id", id).then((d) => {
        if (this.isUpgrade) {
          // 产品升级, 如果有产品 禁止再次添加产品
          for (let i = 0; i < this.increaseList.length; i++) {
            if (this.increaseList[i].goodsList.length >= 1) {
              this.$Modal.warning({
                title: "提示",
                content: "升级商品时每次只能选择一个商品"
              })
              return
            }
          }
        }
        if (this.increaseSelGoodsObj[d.id]) {
          this.increaseSelGoodsObj[d.id].goodsList.push(k)
        } else {
          this.increaseSelGoodsObj[d.id] = d
          this.increaseSelGoodsObj[d.id].goodsList = []
          this.increaseSelGoodsObj[d.id].goodsList.push(k)
        }
        this.objConversionArr(this.increaseSelGoodsObj).then((arr) => {
          this.increaseList = arr
        })
      })
    },

    // 递归找到某个字段 并返回相关数据
    getIdData (list = [], keyName, val) {
      return new Promise((resolve, reject) => {
        let cell = (arr, key, v) => {
          arr.forEach((k) => {
            if (k.children && k.children.length >= 1 && k[key] !== v) {
              cell(k.children, key, v)
            } else if (k[key] === v) {
              resolve(k)
            }
          })
        }
        cell(list, keyName, val)
      })
    },

    // 异步对象转数组
    objConversionArr (obj) {
      let len = Object.keys(obj).length
      let arr = []
      let i = 0
      return new Promise((resolve, reject) => {
        for (let k in obj) {
          i++
          arr.push(obj[k])
          if (i >= len) {
            resolve(arr)
          }
        }
        if (len <= 0) {
          // reject('数据错误')
        }
      })
    },

    // 删除
    delIncreaseGoodsFun (k, i, s, si) {
      if (this.isUpgrade) {
        this.increaseSelGoodsObj = {}
        this.increaseList = []
      } else {
        for (let j = 0; j < this.increaseList.length; j++) {
          if (this.increaseList[j].id === k.id) {
            if (this.increaseList[j].goodsList.length === 1) {
              this.increaseList.splice(j, 1)
              delete this.increaseSelGoodsObj[k.id]
            } else {
              // 怎么多console是为了解决祖传bug，已解决，删除从下到上没问题，从上到下和顺便找一个删除，会出现删除两个的情况
              this.increaseSelGoodsObj[k.id].goodsList.splice(si, 1)
              // this.increaseList.splice
            }
          }
        }
      }
      this.increaseList = [...this.increaseList]
    },

    // 刷新产品档案
    refreshFun () {
      this.goodsName = ""
      this.goodsTypeVal = ""
      this.$refs.refCascader.clearSelect()// 刷新商品档案，清空选择级联选择器
    },

    // 加选商品/商品升级 确定
    saveGoodsListFun () {
      if (this.isUpgrade) {
        this.upChildOrderGradeFun()
      } else {
        this.andChooseFun()
      }
    },

    // 加选商品
    andChooseFun () {
      let arr = []
      // todo 可能存在传参问题， 部分数据为空默认会传0;
      for (let i = 0; i < this.increaseList.length; i++) {
        if (this.increaseList[i].goodsList && this.increaseList[i].goodsList.length >= 1) {
          for (let j = 0; j < this.increaseList[i].goodsList.length; j++) {
            let d = this.increaseList[i].goodsList[j]
            arr.push({
              countNum: d.countNum || 0,
              countP: d.countP || 0,
              defaultP: d.defaultP,
              expeditedTime: d.expeditedTime || 0,
              goodsId: d.id,
              isSelect: d.isSelect,
              name: d.name,
              pSalePrice: d.pSalePrice || 0,
              pickupModeCategoryId: d.pickupModeCategoryId || 0,
              psalePrice: d.pSalePrice || 0,
              remark: `${d.remark || ""}（新增）`,
              salePrice: d.salePrice || 0,
              specification: d.specification || "",
              // shopId: Number(this.shopId),
              sort: d.sort || 0,
              stockStatus: d.stockStatus
            })
          }
        }
      }
      const params = {
        itemId: Number(this.get_parseUrl.itemId),
        orderItemProcessGoodsDtos: arr,
        shopId: Number(this.get_parseUrl.shopId)
      }

      andChoose(params).then(res => {
        if (res.code === 200) {
          let goodsArr = this.get_picGoods
          res.data.map(item => {
            let goodsJson = {
              p_list: [], // 虚拟设置p数
              imgIds: [], // 所选的图片
              isVirtualDesign: 0, // 是否虚拟设计
              itemGoodsId: item.id, // 商品唯一编号
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
              goodsStatus: "NORMAL", // 商品状态
              pickupModeCategoryId: [item.pickupModeCategoryId] || '' // 更新id
            }
            goodsArr.unshift(goodsJson)
          })
          this.mut_picGoods(goodsArr)
          this.$Message.success("新增成功")
          this.popup10 = false
        }
      })
    },

    // 新增商品
    upChildOrderGradeFun () {
      // todo 可能存在传参问题， 部分数据为空默认会传0 祖传;
      let pickupModeCategoryId = this.rightSaveTableData.pickupModeCategoryId[this.rightSaveTableData.pickupModeCategoryId.length - 1]
      let d = this.increaseList[0].goodsList[0]
      let time = this.rightSaveTableData.expeditedTime ? new Date(this.rightSaveTableData.expeditedTime).getTime() : ""
      console.log(this.rightSaveTableData.expeditedTime)
      let obj = {
        countNum: this.rightSaveTableData.countNum || 0,
        countP: this.rightSaveTableData.countP || 0,
        defaultP: d.defaultP || 0,
        expeditedTime: time,
        goodsId: d.id,
        isSelect: d.isSelect,
        name: d.name,
        pSalePrice: d.pSalePrice || 0,
        parentId: this.rightSaveTableData.itemGoodsId,
        pickupModeCategoryId: pickupModeCategoryId || 0,
        psalePrice: d.pSalePrice || 0,
        remark: `${this.rightSaveTableData.remark || ""}（${this.rightSaveTableData.name}升级成${d.name}）`,
        salePrice: d.salePrice || 0,
        specification: d.specification || "",
        shopId: Number(this.get_parseUrl.shopId),
        sort: d.sort || 0,
        stockStatus: d.stockStatus
      }

      upChildOrderGrade(obj).then(res => {
        if (res.code === 200) {
          let goodsArr = this.get_picGoods
          let valImgs = [...this.get_allImg]
          let resItem = res.data
          goodsArr.map(_ => {
            if (this.rightSaveTableData.itemGoodsId === _.itemGoodsId) {
              // 替换id，价格，名称，销售价
              _.goodsId = resItem.goodsId
              _.itemGoodsId = resItem.id
              _.name = resItem.name
              _.salePrice = resItem.salePrice
              _.pSalePrice = resItem.pSalePrice
              _.remark = `${this.rightSaveTableData.remark || ""}（${this.rightSaveTableData.name}升级成${resItem.name}）`
            }
          })
          // 替换全部图片
          valImgs = valImgs.map(item => {
            if (item.goodsNamesId.includes(`${this.rightSaveTableData.itemGoodsId}`)) {
              item.goodsNamesId.splice(item.goodsNamesId.indexOf(this.rightSaveTableData.itemGoodsId), 1, `${resItem.id}`)
              item.goodsNames.splice(item.goodsNames.indexOf(this.rightSaveTableData.name), 1, `${resItem.name}`)
            }
            return item
          })
          // 更新数据
          this.mut_picGoods(goodsArr)
          this.mut_allImg(valImgs)
          this.$Message.success("更新成功")
          this.popup10 = false
        }
      })
    },

    // 删除商品
    delChildOrder (id) {
      delChildOrder({ id }).then(res => {
        if (res.code === 200) {
          let goodsArr = []
          let valImgs = this.get_allImg
          goodsArr = this.get_picGoods.map(item => {
            if (id === item.itemGoodsId) {
              item.imgIds = []
              item.p_list = []
            }
            return item
          })
          // 更新全部图片
          valImgs.map(item => {
            let json = {}
            goodsArr.map(_ => {
              if (_.imgIds.includes(item.id)) {
                json[_.itemGoodsId] = _.name
              }
            })
            item.goodsNamesId = Object.keys(json)
            item.goodsNames = Object.keys(json).map(item => json[item])
          })

          // 删除商品
          goodsArr = goodsArr.filter(item => item.itemGoodsId !== id)

          // 存储商品信息
          this.mut_picGoods(goodsArr)
          this.mut_allImg(valImgs)
          this.$Message.success("删除成功")
        }
      })
    },

    // 获取商品列表
    getGoodsList () {
      let id = this.goodsTypeVal.length >= 1 ? this.goodsTypeVal[this.goodsTypeVal.length - 1] : ""
      const params = {
        categoryId: id,
        isSearchCount: true,
        commodityUses: ['UNIVERSAL', 'LATE'],
        limit: 16,
        name: this.goodsName,
        page: 1,
        shopId: Number(this.get_parseUrl.shopId)
      }
      getGoodsList(params).then(res => {
        this.goodsList = res.data.records
      })
    }
  },
  created () {
    this.pickupArr = this.multistageFun(JSON.stringify(this.get_pickList))[0].children
    this.goodsTypeArr = this.multistageFun(JSON.stringify(this.get_goodesList))[0].children
    this.getGoodsList()
  }
}
</script>

<style lang="scss">

.goods-table {
  margin: 10px;
  height: 300px;
  position: relative;
  z-index: 3000;
}
.my-table{

  .ivu-table-cell{
    padding: 0;
    font-size: 14px !important;
  }
  .ivu-table td, .ivu-table th{
    height: 32px;
    cursor: pointer;
    padding: 0px 3px;
  }
}

.product-table-input{
  border:1px #dcdee2 solid;width: 100%;outline: 0;border-radius: 3px
}
.product-right {
  li {
    height: 26px;
    line-height: 26px;
    cursor: pointer;
    padding: 0 10px;
    .num {
      float: right;
    }
  }
  li:hover {
    background-color: #e8eaec;
  }
}
.jiatiao-goods-list{
  height: 400px;
  position: relative;
  margin: 10px 0;
  .left-list{
    position: absolute;
    left: 0;
    top: 0px;
    width: 500px;
    bottom: 0;
  }
  .right-list{
    position: absolute;
    top: 0px;
    right: 0;
    bottom: 0;
    width: 375px;
    overflow: auto;
    .list-label{
      height: 26px;
      line-height: 26px;
      color: #2d8cf0;
      border-bottom: 1px #2d8cf0 solid;
      margin: 0 5px;
    }
    .sel-goods-list{
      height: 26px;
      line-height: 26px;
      >span{
        display: inline-block;
      }
      >span:nth-child(1) {width: 50%;padding-left: 5px;box-sizing: border-box;}
      >span:nth-child(2) {width: 15%;text-align: center;}
      >span:nth-child(3) {width: 15%;text-align: center;}
      >span:nth-child(4) {width: 20%;text-align: center;}
    }
    .sel-goods-list-head{
      height: 32px;
      line-height: 32px;
      border-bottom: 1px  #e8eaec solid;
    }
  }
}
</style>
