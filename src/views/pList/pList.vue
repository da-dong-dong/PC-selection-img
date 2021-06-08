/******************************** 虚拟设计 ***************************************/
<template>
    <div class="box" @click="onShowOff">
        <div class="Pleft">
            <h2>{{leftAllJson.name}}</h2>
            <div class="btn">
                <Button type="primary" long @click="onAddPList">添加</Button>
            </div>
            <div class="leftList">
                <div class="boxLef" v-for="(item,index) in PLeft" :key="index">
                    <p class="del" @click="onDelPleft(index)"><Icon type="ios-close-circle" /></p>
                    <p class="topP">第 {{item.p}} P： <span>{{item.title}}</span></p>
                    <draggable v-model="item.list" group="site" animation="300" dragClass="dragClass" @add="moveAddClick(index)" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStart" @end="onEnd">
                        <transition-group class="list">
                            <div v-for="(_,index1) in item.list" :key="_.id" @contextmenu.prevent="rightPopupFun1($event, item, index, _, index1)">
                                <div class="imgBox" >
                                    <img v-lazy="defaultImgUrl" alt="" v-if="get_imgF2Show">
                                    <img v-lazy="_.url" alt="" v-else>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
                    <p class="botB">已选 {{item.list.length}} 张</p>
                </div>

            </div>
        </div>
        <!-- p组操作 -->
            <Modal v-model="leftShow" class="my-modal1" width="150" :mask="false">
            <div >
                <!-- <p class="p-list" @click="pClickImgFun(1)">标记说明</p> -->
                <p class="p-list" @click="pClickImgFun(2)">设置模板页名称</p>
        <!--        <p class="p-list" @click="pClickImgFun(3)">查看当前选择相片</p>-->
                <p class="p-list" @click="pClickImgFun(4)">移除当前选择</p>
                <p class="p-list" @click="pClickImgFun(5)">全部移除选择</p>
                <p class="p-list" @click="pClickImgFun(6)">删除[当前页/P]</p>
        <!--        <p class="p-list" @click="pClickImgFun(7)">刷新[当前页/P]</p>-->
            </div>
            </Modal>
        <div class="Pright">
            <vue-drag-select style="min-height:500px"  v-model="selectedArr" value-key="name" :item-margin="[30,18]" :warpper-padding="[10, 10, 10, 10]" ref="dragSelectArr">
                <draggable v-model="Pright" group="site" animation="100" dragClass="dragClass" ghostClass="ghostClass" chosenClass="chosenClass" @start="onStart" @end="onEnd">
                    <transition-group>
                        <drag-select-option v-for="(item,index) in Pright" :key="index"  :value="item" :item-index="index" ref="dragSelectOption" v-dragging="{ item: item, list: Pright, group: 'k' }">
                            <li class="yunmeng-img-list-box" :class="classFlag(item.id)?'border_select':''" @contextmenu.prevent="rightPopupFun($event, item, index)" >
                                <div class="img-box">
                                    <img v-lazy="defaultImgUrl" alt="" v-if="get_imgF2Show">
                                    <img v-lazy="item.url" alt="" v-else>
                                </div>
                                <div class="txt ">
                                    <div class="name text-h">{{item.name}}</div>
                                </div>
                            </li>
                        </drag-select-option>
                    </transition-group>
                </draggable>
            </vue-drag-select>
            <!-- 选择P数 -->
        <Modal v-model="rightShow" class="my-modal" width="150" :mask="false">
            <div >
                <p class="p-list" v-for="(k, i) in PLeft" :key="i" @click="joinPFun(i)">第{{k.p}}P</p>
            </div>
        </Modal>
        </div>
        <!-- 设置模板页面名称 -->
        <Modal v-model="showTitle" class="yunmeng" title="模板页名称" width="300">
        <div style="padding: 16px;">
            <Input type="text" v-model="title" placeholder="请输入" />
        </div>
        <div class="cl" style="padding: 0 16px 16px 16px;text-align: right;">
            <Button type="primary" @click="tempNameFun">确定</Button>
        </div>
        </Modal>
    </div>
</template>

<script>
import draggable from "vuedraggable"
import { mapGetters, mapMutations } from 'vuex'
export default {
  props: ['itemGoodsId'],
  components: {
    draggable
  },
  computed: {
    ...mapGetters("typeModule", [
      "get_imgF2Show",
      "get_allImg"
    ]),
    ...mapGetters("app", [
      "get_picGoods"
    ])
  },
  data () {
    return {
      drag: false,
      defaultImgUrl: require('@/assets/JPGE2.png'),
      leftAllJson: {}, // 商品全部数据
      selectedArr: [], // 选中
      rightShow: false, // 右边弹窗
      leftShow: false, // 左边弹窗
      PLeft: [
        // {
        //   p: 1,
        //   title: 'www.itxst.com',
        //   imgArr: ['正常(494)\\2O9A0445.jpg']
        // }
      ],
      indexL: 0,
      indexL1: 0,
      showTitle: false, // 标题页
      title: '',
      Pright: [
        //   { id: 122, name: '444', url: 'aa' }
      ]
    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_picGoods'
    ]),
    ...mapMutations("typeModule", [
      "mut_allImg"
    ]),
    // 监听窗口变化
    geiWindowChange () {
      window.onresize = () => {
        // 触发更新视图
        this.$refs.dragSelectArr.elementLayout()
      }
    },
    // 添加
    onAddPList () {
      console.log('增加')
      this.PLeft.unshift({
        p: this.PLeft.length + 1,
        title: '',
        list: []
      })
      console.log(this.PLeft)
    },

    // 删除
    onDelPleft (index) {
      console.log('删除')
      this.Pright.push(...this.PLeft[index].list)
      this.PLeft.splice(index, 1)
      // 更新数据
      this.dataUpdate()
    },

    // 样式赋值
    classFlag (id) {
      let assi = this.selectedArr.filter(item => {
        return item.id === id
      })
      if (assi.length > 0) {
        return true
      }
    },

    // 左键
    rightPopupFun1 (e, item, index, item1, index1) {
      this.leftShow = true
      this.rightShow = false
      this.$nextTick(() => {
        let modal = document.querySelector('.my-modal1')
        let div = modal.querySelector('.ivu-modal')
        modal.querySelector('.ivu-modal-footer').style.display = 'none'
        modal.querySelector('.ivu-icon').style.display = 'none'
        let DH = div.clientHeight
        let DW = div.clientWidth
        let BH = document.body.clientHeight
        let BW = document.body.clientWidth
        let l = e.clientX
        let t = e.clientY
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
      this.indexL = index
      this.indexL1 = index1
    },
    // 左边弹窗选中
    pClickImgFun (val) {
      console.log(val)
      switch (val) {
        case 1:

          break

        case 2:
          // 设置模板页
          this.showTitle = true
          break
        case 4:
          // 移除当前选着

          this.Pright.push(this.PLeft[this.indexL].list[this.indexL1])
          this.PLeft[this.indexL].list.splice(this.indexL1, 1)
          // 更新数据
          this.dataUpdate()
          break
        case 5:
          // 移除p
          this.Pright.push(...this.PLeft[this.indexL].list)
          this.PLeft[this.indexL].list = []
          // 更新数据
          this.dataUpdate()
          break
        case 6:
          // 删除p
          this.onDelPleft(this.indexL)
          break
      }
      this.leftShow = false
    },

    // 确定修改title
    tempNameFun () {
      this.PLeft[this.indexL].title = this.title
      // 更新数据
      this.dataUpdate()
      this.showTitle = false
    },

    // 右键
    rightPopupFun (e, k) {
      this.rightShow = true
      this.leftShow = false
      if (this.selectedArr.length === 0 || this.selectedArr.length === 1) {
        this.selectedArr = [k]
      }
      this.$nextTick(() => {
        let modal = document.querySelector('.my-modal')
        let div = modal.querySelector('.ivu-modal')
        modal.querySelector('.ivu-modal-footer').style.display = 'none'
        modal.querySelector('.ivu-icon').style.display = 'none'
        let DH = div.clientHeight
        let DW = div.clientWidth
        let BH = document.body.clientHeight
        let BW = document.body.clientWidth
        let l = e.clientX
        let t = e.clientY
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

    // 关闭弹窗
    onShowOff () {
      this.rightShow = false
      this.leftShow = false
    },

    // 添加p数
    joinPFun (e) {
      this.selectedArr.map(item => {
        this.PLeft[e].list.push(item)
        this.Pright.map((item1, index1) => {
          if (item1.id === item.id) {
            this.Pright.splice(index1, 1)
          }
        })
      })
      this.selectedArr = []
      this.rightShow = false
      // 更新数据
      this.dataUpdate()
    },

    // 拖拽添加
    moveAddClick (index) {
      if (this.selectedArr.length === 1) return
      this.joinPFun(index)
      // 过滤
      let obj = {}
      this.PLeft[index].list = this.PLeft[index].list.reduce((cur, next) => {
        obj[next.id] ? "" : obj[next.id] = true && cur.push(next)
        return cur
      }, [])
      // 更新数据
      this.dataUpdate()
    },

    onStart () {
      this.drag = true
      if (this.selectedArr.length === 1) {
        this.selectedArr = []
      }
    },
    onEnd () {
      this.drag = false
      let arrList = []
      this.PLeft.map(item => {
        item.list.map(_ => {
          arrList.push(_.id)
        })
      })
      this.Pright = this.get_allImg.filter(item => !arrList.includes(item.id))

      // 更新数据
      this.dataUpdate()
    },

    // 监听更新数据
    dataUpdate () {
      console.log("总数据", this.leftAllJson)
      let picGoods = []
      let imgIds = []
      let pList = this.leftAllJson.p_list.map(item => {
        let imgArr = []
        if (item.hasOwnProperty('list')) {
          item.list.map(_ => {
            imgArr.push(_.id)
            imgIds.push(_.id)
          })
          item.imgArr = imgArr
        }
        return item
      })

      pList = pList.map(item => {
        return { p: item.p, title: item.title, imgArr: item.imgArr }
      })

      picGoods = this.get_picGoods.filter(item => item.itemGoodsId === this.itemGoodsId)
      picGoods = { ...picGoods[0] }
      if (imgIds.length > 0) {
        picGoods.isVirtualDesign = 1
        picGoods.imgIds = imgIds
        picGoods.p_list = pList
      } else {
        picGoods.isVirtualDesign = 0
        picGoods.imgIds = []
        picGoods.p_list = []
      }
      // 更新
      let goodArr = this.get_picGoods.map(item => {
        if (item.itemGoodsId === this.itemGoodsId) {
          item = picGoods
        }
        return item
      })
      this.mut_picGoods(goodArr)
      let allImg = [...this.get_allImg]
      allImg.map(item => {
        let json = {}
        goodArr.map(_ => {
          if (_.imgIds.includes(item.id)) {
            json[_.itemGoodsId] = _.name
          }
        })
        item.goodsNamesId = Object.keys(json)
        item.goodsNames = Object.keys(json).map(item => json[item])
      })
      // 更新全部图片
      this.mut_allImg(allImg)
    }

  },
  created () {
    // 左侧内容数据
    let leftArr = this.get_picGoods.filter(item => item.itemGoodsId === this.itemGoodsId)
    this.leftAllJson = leftArr[0]
    let rightId = []
    // 过滤字段显示
    this.leftAllJson.p_list.map(item => {
      let arr = []
      this.get_allImg.map(_ => {
        if (item.imgArr.includes(_.id) && item.imgArr.length > 0) {
          arr.push(_)
          rightId.push(_.id)
        }
      })
      item.list = arr
    })
    this.Pright = this.get_allImg.filter(item => !rightId.includes(item.id))
    this.PLeft = this.leftAllJson.p_list
    if (this.PLeft.length === 0) {
      this.PLeft[0] = { p: 1, title: '', list: [], imgArr: [] }
    }
    console.log(this.PLeft, this.Pright)
  },
  mounted () {
    this.geiWindowChange()
  },
  watch: {

  }
}
</script>

<style lang="scss" scoped>
li{
        list-style: none;
}
.text-h{
        overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.p-list{
  height: 32px;
  text-align: center;
  color: #1a1a1a;
  line-height: 32px;
  cursor: pointer;
}
.p-list:hover{
  background-color: #2b85e4;
  color: #fff;
}
.box{
    height: 85vh;
    display: flex;
    justify-content: space-between;
    .Pleft{
        width: 312px;
        border: 1px #eaeaea solid;
        margin-left: 10px;
        h2{
            border-bottom: 1px #eaeaea solid;
            padding: 10px 0 10px 20px;
        }
        .btn{
            width: 90%;
            margin: 10px auto;
        }
        .leftList{
           border-top: 1px #eaeaea solid;
            overflow: auto;
            height: 88%;
           .boxLef{
                margin: 10px;
                border: 1px #eaeaea solid;
                position: relative;
                .del{
                    position: absolute;
                    right: 7px;
                    top: 0;
                }
                .topP{
                    padding-left: 10px;
                }
                .list{
                    min-height: 100px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    .imgBox{
                        border: 1px #eaeaea solid;
                        width: 103px;
                        height: 103px;
                        margin-top: 10px;
                        img{
                            width: 95%;
                            height: 95%;
                            margin: 0 auto;
                        }
                    }
                }
                .botB{
                    text-align: right;
                    padding-right: 10px;
                }
           }
        }
    }
    .Pright{
        width: 100%;
        border: 1px #eaeaea solid;
        margin:0 10px;
        min-height: 500px;
    }
}
.border_select{
        border: 1px solid red;
        border-color: rgb(65, 98, 255);
        box-shadow: rgb(65, 98, 255) 0px 0px 0px 2px !important;

  }
  .ivu-modal-footer{
      display: none;
  }
</style>
