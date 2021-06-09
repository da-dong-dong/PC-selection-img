<template>
  <div class="allDel" @click="allFun($event)">
    <div>
      <div :class="['sheji-page', mood ? '' : 'bigger']">
        <div class="result-box">
          <vue-drag-select v-model="selectedArr" value-key="photoName" :item-margin="[8, 8, 60, 8]" ref="dragSelectArr">
            <template v-for="(item, index) in this.ky_modifyArr">
              <drag-select-option :key="index" :value="item" :item-index="index">
                <div
                  class="item-self"
                  @contextmenu.prevent="rightPopup($event, item)"
                  @click="imgPopupClick(item, index)"
                  @dblclick="showImgFun(item, index)"
                  @keyup.delete="deleteImgFun($event, item, index)">
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
        <span class="dianji" v-once @click="openOpinion">点击添加相片修改要求</span>
      </div>
      <div>
        <div v-for="(k, i) in this.ky_lookArr" :key="i" class="checkClass">
          <Checkbox v-model="k.isSelected" v-bind:disabled="k.disabled" @on-change="checkboxChangeFun($event, k, i)">
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
      :closable="true"
      width="500"
      title="客人要求"
      class-name="vertical-center-modal">
      <div class="px-1 py-2" v-if="this.currentBool">
        <div>当前相片：{{this.currentImgObj.id}}</div>
        <Input v-model="singleNote" type="textarea" :autosize="{ minRows: 4, maxRows: 8 }" />
      </div>
      <div slot="footer">
        <Button type="primary" @click="opinionOk">确定</Button>
        <Button type="primary" @click="opinionCancel">取消</Button>
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
      currentImgObj: null,
      currentBool: false,
      opinionModal: false,
      singleNote: "", // 客人要求
      imgPopup: false, // 点击图片弹出modal
      // imgListLength:0,
      selectedArr: []
    }
  },
  created () {},
  mounted () {
    console.log('modify.vue')
    console.log(this.ky_modifyArr)
    /**
     * keycode:8是退格事件
     * keycode:46是delete事件
     */
    // const g = this;
    // document.addEventListener("keydown", function(e) {
    //   if (e.keyCode === 8 || e.keyCode === 46) {
    //     g.delFun();
    //   }
    // });
  },
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
      console.log(e)
      console.log(k)
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
        this.selectedArr.forEach((k) => {
          this.ky_lookArr.forEach((k2) => {
            if (k2.num.includes(k.url)) { // 包含
              delete k2.isSelected
              this.$set(k2, 'isSelected', true)
              // k.isSelected=true;
            } else { // 不包含
              this.$set(k2, 'isSelected', false)
            }
          })
        })
      })
    },
    /**
     * Checkbox true或者false
     */
    checkboxChangeFun (e, k, i) {
      if (e) {
        this.selectedArr.forEach((v) => {
          this.ky_lookArr.forEach((v2) => {
            if (v2.title === k.title) {
              console.log('v2.title === k.title')
              v.photoNames.push(v2.title)
              v.modify = 2
              v.isModify = true
              v2.isSelected = true
              v2.num.push(v.url)
              Array.from(new Set(v2.num))
              Array.from(new Set(v.photoNames))
            }
            if (v2.title !== k.title) {
              console.log('v2.title !=== k.title')
              // 不需要修改
              v.modify = 1
              v.isModify = false
              v.photoNames.splice(v.photoNames.indexOf(v2.title), 1)
              v2.isSelected = false
              v2.num.splice(v2.num.indexOf(v.url), 1)
            }
          })
        })
      } else {
        console.log("elseelseelse")
        this.selectedArr.forEach((v) => {
          this.ky_modifyArr.forEach((v2) => {
            if (v.id == v2.id) {
              v2.photoNames.splice(v2.photoNames.indexOf(k.title), 1)
              v2.modify_note = ""// 可能会有备注，置空它
              v2.modify = 1// 1是不用修改；2是要修改，3是删除的；
              v2.isModify = false
              this.ky_lookArr.forEach((v3) => {
                if (v3.title == k.title) {
                  v3.isSelected = false
                  v3.num.splice(v3.num.indexOf(k.url), 1)
                  // console.log(v3);
                }
                if (v3.title !== k.title) {
                  v3.isSelected = true
                  v3.num.push(k.url)
                  Array.from(new Set(v3.num))
                }
              })
            }
          })
        })
      }
    },
    delFun () {
      console.log("delFun")
      console.log(this.selectedArr)
      if (this.selectedArr.length == 0) {
        this.$Modal.info({
          title: "提示消息~",
          content: "亲，您还没有选中想要删除的照片，请先选择要删除的照片~"
        })
      } else {
        this.$Modal.confirm({
          title: "提示消息!",
          content: "确定要删除选中的相片吗？确定点“确定”，不删除点“取消”",
          onOk: () => {
            let arr = []
            this.selectedArr.forEach((k) => {
              this.ky_imgList.forEach((k2) => {
                if (k.id === k2.id) {
                  k2.isSelected = false
                  arr.push(k2)
                  Array.from(new Set(arr))
                  arr.forEach((k3) => {
                    k3.modify = 3 // 3表示已删除的；
                    k3.photoNames.length = 0
                  })
                  this.set_ky_delArr(arr) // 把删除的数组存到vuex中
                  console.log(this.ky_delArr)
                  this.ky_imgList.splice(this.ky_imgList.indexOf(k2), 1)
                  console.log(k2)
                  // 解决删除图片，弹出窗口数量没减少的情况
                  for (let i = 0; i < this.ky_lookArr.length; i++) {
                    let y = this.ky_lookArr[i]
                    if (y.num.includes(k2.url)) {
                      y.num.splice(y.num.indexOf(k2.url), 1)
                    }
                  }
                }
              })
            })
            this.$Message.info("删除图片成功")
          },
          onCancel: () => {
            this.$Message.info("取消了删除图片")
          }
        })
      }
    },
    /**
     * 点击添加相片修改要求
     * 第一步，判断选中的数组this.selectedArr.length是不是等于1，如果是，就执行==1的，如果不是，return；
     * 第二部，进一步确认当前选中的照片是否==this.currentImgObj单击选中的元素；
     * 第三步，modify为1和3的不要，1是默认不更改，3是删除照片的
     */
    openOpinion () {
      if (this.selectedArr.length == 1) {
        this.selectedArr.forEach((k) => {
          if (k.id == this.currentImgObj.id) {
            if (k.modify == 1 || k.modify == 3) {

            } else if (k.modify == 2) {
              this.singleNote = k.modify_note
              this.opinionModal = true
            }
          }
        })
      } else {

      }
    },
    opinionOk () {
      this.selectedArr.forEach((k) => {
        if (k.id == this.currentImgObj.id) {
          k.modify_note = this.singleNote
        }
      })
      this.opinionModal = false
    },
    opinionCancel () {
      this.selectedArr.forEach((k) => {
        if (k.id == this.currentImgObj.id) {
          k.modify_note = ""
        }
      })
      this.opinionModal = false
    },
    /**
     * 单击图片
     */
    imgPopupClick (k, i) {
      this.curerntBool = true
      this.currentImgObj = k
    },
    /**
     * 双击图片打开详情图片
     */
    showImgFun (k, i) {
      bus.$emit('modifyviewer', k)
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
    /**
     * 标记说明
     */
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
