/******************************** 内容 ***************************************/
<template>
    <div>
        <h3 class="paddingL15">{{textTile}}</h3>
        <div class="result-box" style="height: 100%;" @click="onClickShowModel($event)" v-if="tabIndex!==9">
            <div v-if="tabIndex==8">
              <Button @click="backSelectImg">还原所选</Button>
              <Button @click="allBackImg" style="margin-left:0.5rem;">全部还原</Button>
            </div>
            <vue-drag-select v-if="tabIndex!=8" v-model="selectedList" value-key="name" ref="dragSelect" :item-width="120" :item-height="180" :item-margin="[10, 10, 10, 10]"
                :warpper-padding="[10, 10, 10, 10]">
                <template v-for="(item, index) in get_allImg"  :class="actives.indexOf(item.id) >= 0 ? 'img-list-box-active' : ''"
                  v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                    <!-- 入册 入底 -->
                    <drag-select-option v-if="item.goodsNames.includes(tabIndexText) && (tabIndex == 4 || tabIndex == 5)" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <imgModel :item="item" @OnRightModel="OnRightModel"/>
                    </drag-select-option>
                    <!-- 未选 -->
                    <drag-select-option v-else-if="item.goodsNames.length === 0 && tabIndex == 3" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <imgModel :item="item" @OnRightModel="OnRightModel"/>
                    </drag-select-option>
                    <!-- 已经 -->
                    <drag-select-option v-else-if="item.goodsNamesId.includes(tabIndexText) && tabIndex == 2" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <imgModel :item="item" @OnRightModel="OnRightModel"/>
                    </drag-select-option>
                    <!-- 全部 -->
                    <drag-select-option v-else-if="tabIndex == 0" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <imgModel :item="item" @OnRightModel="OnRightModel" v-on="$listeners"/>
                    </drag-select-option>
                </template>
            </vue-drag-select>
            <vue-drag-select v-else v-model="selectedList" value-key="name" ref="dragSelect" :item-width="120" :item-height="180" :item-margin="[10, 10, 10, 10]"
                :warpper-padding="[10, 10, 10, 10]">
                <template v-for="(item, index) in get_delImgs"  :class="actives.indexOf(item.id) >= 0 ? 'img-list-box-active' : ''"
                  v-dragging="{ item: item, get_delImgs: get_delImgs, group: 'item' }">
                    <!-- 删除 -->
                    <drag-select-option :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, get_delImgs: get_delImgs, group: 'item' }">
                        <imgModel :item="item" @OnRightModel="OnRightModel"/>
                    </drag-select-option>
                </template>
            </vue-drag-select>
        </div>

        <!-- 右键弹窗 -->
        <div>
          <rightModel :evnets="evnets" v-if="showRightModel" @goodsChange="goodsChange" @onClickShowModel="onClickShowModel" v-on="$listeners"/>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import rightModel from "@/components/rightModel.vue"
import imgModel from "./components/imgModel.vue"
export default {
  props: ["textTile", "tabIndexText", "tabIndex", "showRightModel", "selectedBig"],
  components: {
    rightModel,
    imgModel
  },
  computed: {
    ...mapGetters("typeModule", [
      "get_allImg"
    ]),
    ...mapGetters("app", [
      "get_picGoods",
      "get_delImgs"
    ])
  },
  data () {
    return {
      selectedList: [],
      evnets: ''
    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_picGoods',
      'mut_delImgs'
    ]),
    ...mapMutations("typeModule", [
      "mut_allImg"
    ]),
    // 监听窗口变化
    geiWindowChange () {
      window.onresize = () => {
        // 触发更新视图
        this.$refs.dragSelect.elementLayout()
      }
    },

    // 右键弹窗
    OnRightModel (e, val) {
      e.preventDefault()
      // 兼容右键 优化右键可以选中
      if (this.selectedList.length === 0) {
        this.selectedList.push(val)
      }
      if (this.selectedList.length === 1) {
        if (this.selectedList[0].id !== val.id) {
          this.selectedList.splice(0, 1, val)
        }
      }
      this.$emit("update:showRightModel", true)
      this.evnets = e

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

    // 关闭弹窗
    onClickShowModel (e) {
      this.$emit("update:showRightModel", false)
    },

    // 勾选按钮
    goodsChange (e, val) {
      const arrp = Array.from(new Set([...this.selectedList]))
      let delImg = []
      if (e) {
        // 选中
        for (let i = 0; i < arrp.length; i++) {
          if (!arrp[i].goodsNamesId.includes(val.itemGoodsId)) {
            arrp[i].goodsNames.push(val.name)
            arrp[i].goodsNamesId.push(val.itemGoodsId)
            this.$set(arrp[i], 'isCheck', true)
          }
          delImg.push(arrp[i].id)
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
      // 更新商品
      this.mut_picGoods(picGoods)
      let allImg = this.get_allImg
      if (delImg.length > 0) allImg.push(...this.get_delImgs.filter(item => delImg.includes(item.id)))
      // 更新删除数据
      this.mut_delImgs(this.get_delImgs.filter(item => !delImg.includes(item.id)))
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
      // 更新全部图片
      this.mut_allImg(allImg)

      // 隐藏弹框
      if (this.tabIndex !== 0) {
        this.$emit("update:showRightModel", false)
        // 清空选中值
        this.selectedList = []
      }
    },

    // 还原所选
    backSelectImg () {
      let allImg = this.get_allImg
      let delImg = this.selectedList.map(item => item.id)
      allImg.push(...this.get_delImgs.filter(item => delImg.includes(item.id)))
      // 更新删除数据
      this.mut_delImgs(this.get_delImgs.filter(item => !delImg.includes(item.id)))
      // 更新全部图片
      this.mut_allImg(allImg)
    },

    // 还原全部
    allBackImg () {
      let allImg = this.get_allImg
      let delImg = this.get_delImgs.map(item => item.id)
      allImg.push(...this.get_delImgs.filter(item => delImg.includes(item.id)))
      // 更新删除数据
      this.mut_delImgs(this.get_delImgs.filter(item => !delImg.includes(item.id)))
      // 更新全部图片
      this.mut_allImg(allImg)
    }
  },
  mounted () {
    this.geiWindowChange()
  },
  watch: {
    // 监听选中值
    selectedList () {
      this.$emit("update:selectedBig", this.selectedList)
    }
  }

}
</script>

<style lang="scss" scoped>
.selected-item {
  .img-box {
    transition: all 0.5s;
    border: 1px solid red;
    border-color: rgb(65, 98, 255);
    box-shadow: rgb(65, 98, 255) 0px 0px 0px 2px !important;
    height: 180px;
  }
}
.img-box {
  border: 1px solid #ccc;
  height: 180px;
}
img {
    border-style: none;
    max-width: 100%;
    width: 100%;
    height: 100%;
}
.ellipse{
  word-break:break-all;
text-overflow:ellipsis;
display:-webkit-box;
-webkit-box-orient:vertical;
-webkit-line-clamp:2;
overflow:hidden;
}
.vh-100{
  height:100vh;
}
.vw-100{
  width:100vw;
}
.f-center{
  display: flex;
  align-items: center;
  justify-content: center;
}
.p-1{
  padding:0.25rem;
}
.autoHiehgt{
  max-height:450px;
  overflow: auto;
}
.text_over{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
