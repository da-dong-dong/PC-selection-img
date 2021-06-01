/******************************** 内容 ***************************************/
<template>
    <div>
        <h3 class="paddingL15">{{textTile}}</h3>
        <div class="result-box" style="height: 100%;" @click="onClickShowModel($event)">
            <vue-drag-select v-model="selectedList" value-key="name" ref="dragSelect" :item-width="120" :item-height="180" :item-margin="[10, 10, 10, 10]"
                :warpper-padding="[10, 10, 10, 10]">
                <template v-for="(item, index) in get_allImg"  :class="actives.indexOf(item.id) >= 0 ? 'img-list-box-active' : ''"
                  v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                    <!-- 入册 入底 -->
                    <drag-select-option v-if="item.goodsNames.includes(tabIndexText) && (tabIndex == 4 || tabIndex == 5)" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <div id="clickFn" v-if="index==0"></div>
                        <div class="img-box" @contextmenu.prevent="OnRightModel($event, item)">
                          <div>
                              <img :src="imgF2ShowUrl" alt="" v-if="get_imgF2Show">
                              <img v-else v-lazy="item.url" alt="" />
                          </div>
                          <div style="text-align:center;font-size:12px;">
                              <div class="text_over" :title="item.name">{{ item.name }}</div>
                              <div :title="item.goodsNames.join(',')" class="ellipse"> {{ item.goodsNames.join(",") }} </div>
                          </div>
                        </div>
                    </drag-select-option>
                    <!-- 未选 -->
                    <drag-select-option v-else-if="item.goodsNames.length === 0 && tabIndex == 3" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <div id="clickFn" v-if="index==0"></div>
                        <div class="img-box" @contextmenu.prevent="OnRightModel($event, item)">
                          <div>
                              <img :src="imgF2ShowUrl" alt="" v-if="get_imgF2Show">
                              <img v-else v-lazy="item.url" alt="" />
                          </div>
                          <div style="text-align:center;font-size:12px;">
                              <div class="text_over" :title="item.name">{{ item.name }}</div>
                              <div :title="item.goodsNames.join(',')" class="ellipse"> {{ item.goodsNames.join(",") }} </div>
                          </div>
                        </div>
                    </drag-select-option>
                    <!-- 未选 -->
                    <drag-select-option v-else-if="item.goodsNamesId.includes(tabIndexText) && tabIndex == 2" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <div id="clickFn" v-if="index==0"></div>
                        <div class="img-box" @contextmenu.prevent="OnRightModel($event, item)">
                          <div>
                              <img :src="imgF2ShowUrl" alt="" v-if="get_imgF2Show">
                              <img v-else v-lazy="item.url" alt="" />
                          </div>
                          <div style="text-align:center;font-size:12px;">
                              <div class="text_over" :title="item.name">{{ item.name }}</div>
                              <div :title="item.goodsNames.join(',')" class="ellipse"> {{ item.goodsNames.join(",") }} </div>
                          </div>
                        </div>
                    </drag-select-option>
                    <!-- 全部 -->
                    <drag-select-option v-else-if="tabIndex == 0" :key="item.id" :value="item" :item-index="index" v-dragging="{ item: item, list: get_allImg, group: 'item' }">
                        <div id="clickFn" v-if="index==0"></div>
                        <div class="img-box" @contextmenu.prevent="OnRightModel($event, item)">
                          <div>
                              <img :src="imgF2ShowUrl" alt="" v-if="get_imgF2Show">
                              <img v-else v-lazy="item.url" alt="" />
                          </div>
                          <div style="text-align:center;font-size:12px;">
                              <div class="text_over" :title="item.name">{{ item.name }}</div>
                              <div :title="item.goodsNames.join(',')" class="ellipse"> {{ item.goodsNames.join(",") }} </div>
                          </div>
                        </div>
                    </drag-select-option>
                </template>
            </vue-drag-select>
        </div>

        <!-- 弹窗 -->
        <div ref="right-el-modalq">
          <rightModel :evnets="evnets" v-if="showRightModel" @goodsChange="goodsChange"/>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import rightModel from "./components/rightModel.vue"
export default {
  props: ["textTile", "tabIndexText", "tabIndex", "showRightModel"],
  components: {
    rightModel

  },
  computed: {
    ...mapGetters("typeModule", [
      "get_allImg",
      "get_imgF2Show"
    ]),
    ...mapGetters("app", [
      "get_picGoods"
    ])
  },
  data () {
    return {
      selectedList: [],
      imgF2ShowUrl: require("../../assets/JPGE2.png"),
      evnets: ''
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
        this.get_picGoods.map(_ => {
          if (_.imgIds.includes(item.id)) {
            json[_.itemGoodsId] = _.name
          }
        })
        item.goodsNamesId = Object.keys(json)
        item.goodsNames = Object.keys(json).map(item => json[item])
      })
      this.mut_allImg(allImg)

      // 隐藏弹框
      if (this.tabIndex !== 0) this.$emit("update:showRightModel", false)
    }
  },
  mounted () {
    this.geiWindowChange()
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
