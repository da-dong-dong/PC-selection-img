<template>
  <div class="allDel" @click="allFun($event)">
    <div>
      <div :class="['sheji-page', mood ? '' : 'bigger']">
        <div class="result-box">
          <vue-drag-select v-model="selectedArr" value-key="photoName" :item-margin="[8, 8, 60, 8]" ref="dragSelectArr">
            <template v-for="(item, index) in this.ky_delArr">
              <drag-select-option :key="index" :value="item" :item-index="index">
                <div
                  class="item-self"
                  @contextmenu.prevent="rightPopup($event, item)"
                  @click="imgPopupClick(item, index)"
                  @dblclick="showImgFun(item, index)"
                  @keyup.delete="deleteImgFun($event, item, index)"
                >
                  <img v-lazy="item.url" :alt="item.photoName" />
                </div>
                <div class="text-secondary ellipsis-2">{{ item.id }}</div>
                <div class="selectedNote ellipsis-2 fs-14" style="padding-bottom:0.5rem;">
                  {{ item.photoNames.join(",") }}
                </div>
              </drag-select-option>
            </template>
          </vue-drag-select>
        </div>
      </div>
    </div>
    <!--点击单张图片 弹出modal-->

    <Modal class="" :mask="false" ref="index-right-modal" v-model="imgPopup" :closable="false" width="350">
      <div class="modalTitle" slot="header">
        <span v-once>设计版确认</span>
        <span class="dianji" v-once>点击添加相片修改要求</span>
      </div>
      <div>
        <div v-for="(k, i) in this.ky_lookArr" :key="i" class="checkClass">
          <Checkbox v-model="k.isSelected" @on-change="checkboxChangeFun($event, k, i)">
            <span>{{ k.title }}</span>
          </Checkbox>
          <span :class="{biaoji:!k.biaoji}">[{{ k.num.length }}]</span>
          <!-- <span v-if="k.biaoji" @click="linkFun" style="cursor:pointer;color:dodgerblue">标记说明</span> -->
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>

    <Modal
      class=""
      :mask="false"
      v-model="opinionModal"
      :closable="false"
      width="500"
      class-name="vertical-center-modal"
      title="客人要求"
    >
      <div class="px-1 py-2" v-if="currentBool">
        <div>当前相片：<span>{{this.currentImgObj.id}}</span></div>
        <Input v-model="singleNote" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" />
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
import bus from "@/util/bus"
export default {
  data () {
    return {
      mood: false,
      currentBool: false,
      currentImgObj: null,
      opinionModal: false,
      singleNote: "", // 客人要求
      imgPopup: false, // 点击图片弹出modal
      // imgListLength:0,
      selectedArr: []
    }
  },
  created () {},
  mounted () {},
  computed: {
    ...mapGetters(["ky_serveArr", "ky_imgList", "ky_photoUrl", "ky_lookArr", "ky_modifyArr", "ky_okArr", "ky_delArr"])
  },
  methods: {
    ...mapMutations([
      "set_ky_serveArr",
      "set_ky_photoUrl",
      "set_ky_imgList",
      "set_ky_lookArr",
      "set_ky_modifyArr",
      "set_ky_okArr",
      "set_ky_delArr"
    ]),
    init () {},
    /***
     * 点击图片，右键打开图片popup
     * selectedArr是选中的数组，为0，不打开，弹出警告提示
     */
    rightPopup (e, k) {
      this.imgPopup = true
      this.$nextTick(() => {
        let modal = this.$refs["index-right-modal"].$el
        let div = modal.querySelector(".ivu-modal")
        // ivu-modal
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
        this.ky_lookArr.forEach((k) => {
          k.isSelected = false
        })
      })
    },
    /**
     * Checkbox true或者false
     */
    checkboxChangeFun (e, k, i) {
      if (k.name == "modify") {
        this.selectedArr.forEach((v) => {
          this.ky_delArr.forEach((v2) => {
            if (v.id === v2.id) {
              this.ky_lookArr.forEach((v3) => {
                if (v3.title == k.title) {
                  v.photoNames.push(k.title)
                  Array.from(new Set(v.photoNames))
                  v.modify = 2
                  console.log(v3)
                  v3.num.push(v.url)
                  Array.from(new Set(v3.num))
                  this.ky_imgList.push(v2)
                  this.ky_delArr.splice(this.ky_delArr.indexOf(v2), 1)
                }
              })
            }
          })
        })
        Array.from(new Set(this.ky_imgList))
      } else {
        this.selectedArr.forEach((v) => {
          this.ky_delArr.forEach((v2) => {
            if (v.id === v2.id) {
              this.ky_lookArr.forEach((v3) => {
                if (v3.title == k.title) {
                  v.photoNames.push(k.title)
                  Array.from(new Set(v.photoNames))
                  v.modify = 1
                  v.modify_note = ""
                  v3.num.push(v.url)
                  Array.from(new Set(v3.num))
                  this.ky_imgList.push(v2)
                  this.ky_delArr.splice(this.ky_delArr.indexOf(v2), 1)
                }
              })
            }
          })
        })
        Array.from(new Set(this.ky_imgList))
      }
    },
    openOpinion () {
      this.opinionModal = true
    },
    /**
     * 单击图片,currentBool解决初始为空的bug，
     * 一开始待修改是没有图片对象，浏览器报错，所以加个if来判断
     */
    imgPopupClick (k, i) {
      this.currentBool = true
      this.currentImgObj = k
    },
    /**
     * 双击图片打开详情图片
     */
    showImgFun (k, i) {
      bus.$emit('alldelviewer', k)
    },
    /**
     * 主要是取消右键弹窗用的
     */
    allFun (e) {
      // console.log(e);
      this.imgPopup = false
    },
    /**
     * deleteImgFun 删除图片
     */
    deleteImgFun (e, k, i) {
      console.log("删除图片操作~~")
    },
    linkFun () {
      bus.$emit("ps-show", this.currentImgObj)
    }
  },
  watch: {
    // mood() {
    //   clearTimeout(this.timeClick);
    //   this.timeClick = setTimeout(() => {
    //     this.$refs.dragSelectArr.elementLayout(200, 230);
    //   }, 500);
    // },
    selectedArr: {
      handler () {
      }
    },
    ky_lookArr: {
      handler () {
      }
    },
    ky_imgList: {
      handler () {
        let modifyArr = []
        let okArr = []
        okArr = this.ky_imgList.filter((k) => {
          return k.modify == 1
        })
        modifyArr = this.ky_imgList.filter((k) => {
          return k.modify == 2
        })
        okArr.forEach((k) => {
          if (k.photoNames.includes('确认修改ok!')) {
            k.photoNames.splice(k.photoNames.indexOf('确认修改ok!'), 1)
          }
        })
        this.set_ky_modifyArr(modifyArr)
        this.set_ky_okArr(okArr)
        // console.log(this.ky_modifyArr);
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.fs-14 {
  font-size: 14px;
}
.text-center {
  text-align: center;
}
.px-1 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.py-2 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.modalTitle {
  display: flex;
  justify-content: space-between;
  color: #fff;
}
.checkClass {
  display: flex;
  justify-content: space-between;
  padding: 4px 10px;
}
.ellipsis-1 {
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.ellipsis-2 {
  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.sheji-page {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 0 0 400px;
  transition: all 0.3s ease;
  .result-box {
    width: 100%;
    height: 500px;
    padding-top: 0px;
    transition: all 0.3s;
    .vue-drag-select {
      background-color: #fff;
    }
    .selectedNote {
      // padding-top: 4px;
      font-size: 14px;
      color: crimson;
    }
    .item-self {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: 1px solid #fff;
      background-color: #fff;
      transition: all 0.3s ease;
      overflow: hidden;
      &:hover {
        box-shadow: 0px 2px 20px -2px rgba(0, 0, 0, 0.5);
      }
      img {
        width: 100%;
      }
    }
    // .selected-item {
    //   .item-self {
    //     border: 1px solid red;
    //     border-color: rgb(65, 98, 255);
    //     box-shadow: rgb(65, 98, 255) 0px 0px 0px 2px !important;
    //   }
    // }
  }
}
.selected-item {
  .item-self {
    border: 1px solid red;
    border-color: rgb(65, 98, 255);
    box-shadow: rgb(65, 98, 255) 0px 0px 0px 2px !important;
  }
}
.item-self {
  border: 1px solid #ccc;
  // height: 180px;
}
.bigger {
  width: 100%;
  padding: 0px;
  .result-box {
    // height: 768px;
    height: calc(100vh - 14px);
  }
}
.text-dark {
  color: #282828;
}
.text-secondary {
  color: #606266;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>
