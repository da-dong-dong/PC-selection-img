/******************************** tab栏  内容 ***************************************/
<template>
  <div>
      <!-- tab栏 -->
      <tab :tabIndex="tabIndex" @onClickTab="onClickTab"/>

      <!-- 内容 -->
      <contents :textTile="textTile" :tabIndexText="tabIndexText" :tabIndex="tabIndex" :showRightModel.sync="showRightModel"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import tab from "./components/tab.vue"
import contents from "../contents/contents"
export default {
  computed: {
    ...mapGetters('typeModule', [
      'get_allImg',
      'get_imgF2Show'
    ])
  },
  components: {
    tab,
    contents
  },
  data () {
    return {
      tabIndex: 0,
      textTile: '',
      showRightModel: false,
      tabIndexText: '' // 过滤入底入册
    }
  },
  methods: {
    ...mapMutations('typeModule', [
      'mut_allImg',
      'mut_imgF2Show',
      'mut_imgF4'
    ]),

    // 点击tab
    onClickTab (e) {
      this.tabIndex = e.val
      let title = ''
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
      }

      title = `${e.title}(共${num}张)`
      this.textTile = title
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
      }
    }
  },
  created () {
    document.addEventListener("keydown", this.onKeyDownFun, false)
  },
  destroyed () {
    document.removeEventListener("keydown", this.onKeyDownFun, false)
  },
  watch: {
    get_allImg () {
      this.textTile = `查看全部(共${this.get_allImg.length}张)`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
