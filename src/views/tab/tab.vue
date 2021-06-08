/******************************** tab栏  内容 ***************************************/
<template>
  <div @click="onClickShowModel">
      <!-- tab栏 -->
      <tab :tabIndex="tabIndex" @onClickTab="onClickTab" />

      <!-- 内容 -->
      <contents :textTile="textTile" :tabIndexText="tabIndexText" :tabIndex="tabIndex" :showRightModel.sync="showRightModel" :selectedBig.sync="selectedBig"  @onClickDB="onClickDB" @onPlist="onPlist" @showPopup="showPopup"/>

      <!-- 虚拟设计 -->
      <pList v-if="tabIndex===9" :itemGoodsId="itemGoodsId"/>

      <!-- 大图展示 -->
      <imgBig ref="imgBig" v-if="imgBigShow && selectedBig.length === 1" :selectedBig.sync="selectedBig" :imgBigShow.sync="imgBigShow" :imgIndex="imgIndex" @onPlist="onPlist" @showPopup="showPopup"/>

      <!-- 客人要求 -->
      <Modal v-model="showPhotoInstructions" class-name="vertical-center-modal" class="yunmeng setPhonx" title="客人要求">
        <div style="padding: 16px;" class="setPhonx">
          <Input type="textarea" v-model="photoInstructions" :autosize="{ minRows: 5, maxRows: 10 }" placeholder="请输入"/>
        </div>
        <div class="cl" style="padding: 0 16px 16px 16px;text-align: right;">
          <Button type="primary" @click="onClickSetPhone">确定</Button>
        </div>
      </Modal>

      <!-- 保存 -->
      <save v-if="tabIndex===6"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import tab from "./components/tab.vue"
import contents from "../contents/contents"
import pList from "../pList/pList"
import imgBig from "../imgBig/imgBig"
import save from "../save/save"
export default {
  computed: {
    ...mapGetters('typeModule', [
      'get_allImg',
      'get_imgF2Show'
    ]),
    ...mapGetters('app', [
      'get_delImgs',
      'get_picGoods',
      "get_photoInstructions"
    ])
  },
  components: {
    tab,
    contents,
    imgBig,
    pList,
    save
  },
  data () {
    return {
      tabIndex: 0,
      textTile: '全部图片',
      showRightModel: false,
      imgBigShow: false, // 大图展示
      selectedBig: [], // 选中的值
      imgIndex: 0, // 大图展示索引值
      tabIndexText: '', // 过滤入底入册
      itemGoodsId: '', // 虚拟设计id
      showPhotoInstructions: false,
      photoInstructions: '' // 客人要求
    }
  },
  methods: {
    ...mapMutations('typeModule', [
      'mut_allImg',
      'mut_imgF2Show',
      'mut_imgF4'
    ]),
    ...mapMutations('app', [
      'mut_delImgs',
      'mut_picGoods',
      'mut_photoInstructions'
    ]),

    // 点击tab
    onClickTab (e) {
      this.tabIndex = e.val
      let title = ''
      let title1 = ''
      let num = 0

      switch (e.val) {
        case 0:
          num = this.get_allImg.length
          break
        case 2:
          this.tabIndexText = e.itemGoodsId
          num = e.num ? e.num : 0
          break
        case 3:
          num = this.get_allImg.filter(item => item.goodsNames.length === 0).length
          break
        case 4:
          this.tabIndexText = "入底"
          num = this.get_allImg.filter(item => item.goodsNames.includes("入底")).length
          break
        case 5:
          this.tabIndexText = "入册"
          num = this.get_allImg.filter(item => item.goodsNames.includes("入册")).length
          break
        case 8:
          num = this.get_delImgs.length
          break
        case 9:
          title1 = `虚拟设计-${e.title}`
          break
        case 6:
          title1 = `保存`
          break
      }

      title = `${e.title}(共${num}张)`
      this.textTile = title1 || title
    },

    // 监听键盘事件
    onKeyDownFun (e) {
      let code = e.keyCode
      console.log(code)
      switch (code) {
        case 113:
          // f2显示隐藏图片
          this.mut_imgF2Show(!this.get_imgF2Show)
          break
        case 115:
          // f4乱序
          this.mut_imgF4()
          break
        case 13:
          // 回车键看大图
          if (this.tabIndex !== 0) return
          this.imgBigShow = true
          this.selectBigIndex()
          break
        case 46:
          // 删除图片
          if (this.tabIndex === 8) return
          this.onDelImg()
          if (this.$refs.imgBig) this.$refs.imgBig.updateImgBig()
          break
        case 67:
          // 删除图片
          if (this.tabIndex === 8) return
          this.onDelImg()
          if (this.$refs.imgBig) this.$refs.imgBig.updateImgBig()
          break
        case 119:
          // 跳转删除
          this.onClickTab({ val: 8, title: "所有删除" })
          break
      }
    },

    // 关闭右键弹窗
    onClickShowModel (e) {
      this.showRightModel = false
    },

    // 选中大图索引值
    selectBigIndex () {
      for (let i = 0; i < this.get_allImg.length; i++) {
        if (this.get_allImg[i].id === this.selectedBig[0].id) {
          this.imgIndex = i
        }
      }
    },
    // 双击点击图片
    onClickDB () {
      this.imgBigShow = true
      this.selectBigIndex()
    },

    // 删除图片
    onDelImg () {
      let lodDelImg = this.get_delImgs
      let delId = []
      for (let i = 0; i < this.selectedBig.length; i++) {
        if (this.selectedBig[i].goodsNames.length === 0) {
          delId.push(this.selectedBig[i].id)
        } else {
          this.$Modal.warning({
            title: "提示",
            content: "选中的相片不能删除，请先取消选中状态！"
          })
          return
        }
      }
      let delImg = this.selectedBig.map(item => {
        return item
      })
      let allImg = this.get_allImg.filter(item => !delId.includes(item.id))

      lodDelImg.push(...delImg)
      // 更新删除图片
      this.mut_delImgs(lodDelImg)
      // 更新全部图片
      this.mut_allImg(allImg)
    },

    // 接收虚拟参数
    onPlist (val) {
      let falg = true
      if (val.isVirtualDesign === 0 && val.imgIds.length > 0) {
        falg = false
      }
      if (falg) {
        this.itemGoodsId = val.itemGoodsId
        this.onClickTab({ val: 9, title: val.name })
        if (this.imgBigShow) {
          this.$refs.imgBig.delBigImg()
        }
      } else {
        this.$Modal.confirm({
          title: "提示",
          content: `产品 "${val.name}" 已选有相片，如果开启此产品的 "虚拟设计" 时，此产品已选相片将会被清除。确定要开启此产品的 "虚拟设计" 吗？`,
          onOk: () => {
            console.log('删除商品')
            let picGoods = { ...val }
            picGoods.imgIds = []
            picGoods.p_list = []
            // 更新
            let goodArr = this.get_picGoods.map(item => {
              if (item.itemGoodsId === val.itemGoodsId) {
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
            this.itemGoodsId = val.itemGoodsId
            this.onClickTab({ val: 9, title: val.name })
            if (this.imgBigShow) {
              this.$refs.imgBig.delBigImg()
            }
          },
          onCancel: () => {}
        })
      }
    },
    // 弹窗客人要求
    showPopup () {
      console.log(this.get_photoInstructions, '客人要求')
      this.showPhotoInstructions = true
      this.selectedBig.map(item => {
        this.photoInstructions = this.get_photoInstructions[item.id]
      })
    },
    // 确认客人要求
    onClickSetPhone () {
      this.selectedBig.map(item => {
        this.get_photoInstructions[item.id] = this.photoInstructions
      })
      this.mut_photoInstructions(this.get_photoInstructions)
      this.showPhotoInstructions = false
    }
  },
  created () {
    document.addEventListener("keydown", this.onKeyDownFun, false)
    this.textTile = `查看全部(共${this.get_allImg.length}张)`
  },
  destroyed () {
    document.removeEventListener("keydown", this.onKeyDownFun, false)
  },

  watch: {
    // 监听选中值
    // get_allImg () {
    //   this.textTile = `查看全部(共${this.get_allImg.length}张)`
    // }
  }

}
</script>

<style lang="scss">
.setPhonx .ivu-modal-wrap{
  z-index: 2024 !important;
}
</style>
