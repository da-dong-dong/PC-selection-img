<template>
  <div>
    <viewer :images="this.List" :options="options" class="viewer index-viewer" ref="viewer" @inited="inited">
      <img v-for="(k, i) in this.List" :src="k.url" :data-source="k.source" :key="i" id="imageke" class="imageke" />
    </viewer>

    <Modal class="" :mask="false" ref="index-img-modal" v-model="imgviewerPopup" :closable="false" width="350">
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
          <span v-if="k.biaoji" @click="linkFun" style="cursor:pointer;color:dodgerblue">标记说明</span>
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
      class-name="vertical-center-modal"
      @on-cancel="closableCancel"
    >
      <!-- <div class="modalTitle" slot="header">
        <span v-once>客人要求</span>
      </div> -->
      <div class="px-1 py-2">
        <div>
          当前相片：<span v-if="curimgbool">{{ this.curImgObj.id }}</span>
        </div>
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
import bus from "@/util/bus"
import { mapGetters, mapMutations } from "vuex"
export default {
  data () {
    return {
      // curImgId: false,
      opinionModal: false,
      imgviewerPopup: false,
      singleNote: "",
      List: [],
      curImgObj: null,
      curimgbool: false, //
      myViewer: null,
      options: {
        url: "data-source",
        backdrop: false,
        zIndex: 1001,
        toolbar: false,
        title: false,
        tooltip: false,
        navbar: false,
        movable: false,
        rotatable: false,
        scalable: false,
        button: false
      },
      index: 0,
      images: []
    }
  },
  computed: {
    ...mapGetters([
      "ky_serveArr",
      "ky_imgList",
      "ky_photoUrl",
      "ky_lookArr",
      "ky_modifyArr",
      "ky_okArr",
      "ky_delArr",
      "ky_photoList"
    ])
  },
  beforeMount () {},
  mounted () {
    this.initDiv()
    const that = this
    bus.$on("okviewer", (msg) => {
      that.List = that.ky_okArr
      that.curImgObj = msg
      that.show(msg)
    })
    bus.$on("allviewer", (msg) => {
      that.List = that.ky_imgList
      that.curImgObj = msg
      // that.show(msg);
      that.show(msg)
    })
    bus.$on("modifyviewer", (msg) => {
      console.log("modifyviewer")
      that.List = that.ky_modifyArr
      that.curImgObj = msg
      that.show(msg)
    })
    bus.$on("alldelviewer", (msg) => {
      that.List = that.ky_delArr
      that.curImgObj = msg
      that.show(msg)
    })
    this.play()
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
    /**
     * 实例化 this.myViewer
     * this.myViewer==viewer // true;
     * this.initDiv()创建左右切换的dom
     */
    inited (viewer) {
      this.$viewer = viewer
      this.myViewer = viewer
      // console.log(this.$viewer);
      console.log('viewer实例化')
      this.$viewer.view(this.index)
    },
    view (index) {
      this.index = index
      console.log('view实例化')
    },
    /**
     * 接收传值
     * this.myViewer实例化viewer
     * this.view();显示左箭头，右箭头，关闭按钮
     * this.openModal()；绑定右键菜单；
     */
    show (k) {
      console.log("show")
      this.options.backdrop = false
      this.options.button = false
      this.options.toolbar = false
      this.options.navbar = false
      this.$nextTick(() => {
        for (let i = 0; i < this.List.length; i++) {
          let item = this.List[i]
          if (k.id == item.id) {
            this.index = i
            this.viewee()
            this.openModal()
            this.curImgObj = k
            this.curimgbool = true
            this.bindevent()
            this.$viewer.view(i)
          }
        }
      })
    },
    /**
     * 创建左右箭头切换，用addEventListener监听操作
     * close关闭按钮后，隐藏左右箭头，关闭按钮icon
     */
    initDiv () {
      console.log('initDiv')
      const body = document.getElementsByTagName("body")[0]
      const div = document.createElement("div")
      div.setAttribute("id", "indexWrap")
      const prev = document.createElement("div")
      const next = document.createElement("div")
      const close = document.createElement("div")
      prev.setAttribute("id", "indexprev")
      prev.setAttribute("style", "display: none")
      next.setAttribute("id", "indexnext")
      next.setAttribute("style", "display: none")
      close.setAttribute("id", "indexclose")
      close.setAttribute("style", "display: none")
      prev.innerHTML = '<img src="https://s1.ax1x.com/2020/09/04/wFhqaj.png" style="width:48px;height:48px;" />'
      next.innerHTML = '<img src="https://s1.ax1x.com/2020/09/04/wFhbZQ.png" style="width:48px;height:48px;" />'
      close.innerHTML = '<img src="https://s1.ax1x.com/2020/11/06/BfrUjH.png" style="width:23px;height:23px;" />'
      div.append(prev, next, close)
      body.appendChild(div)
    },
    /**
     * vc:访问dom，然后监听click操作，右键操作
     * click操作主要用来取消Modal的，contextmenu操作弹出右键菜单
     * $refs访问dom元素；
     */
    openModal () {
      this.$nextTick(() => {
        const body = document.getElementById("body")
        const vc = body.getElementsByClassName("viewer-canvas")[0]
        const that = this
        vc.addEventListener("click", function (e) {
          e.preventDefault()
          that.imgviewerPopup = false
        })
        vc.addEventListener("contextmenu", function (e) {
          e.preventDefault()
          that.imgviewerPopup = true
          let modal = that.$refs["index-img-modal"].$el
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
        })
      })
    },
    /**
     * 主要用来用户双击打开详情图片，左右箭头关闭按钮同时出来；
     */
    bindevent () {
      this.$nextTick(() => {
        const that = this
        const prevclick = document.getElementById('indexprev')
        console.log('prevclick')
        console.log(prevclick)
        const nextclick = document.getElementById('indexnext')
        const closeclick = document.getElementById('indexclose')
        prevclick.addEventListener("click", function (e) {
          e.preventDefault()
          that.prevImg()
        })
        nextclick.addEventListener("click", function (e) {
          e.preventDefault()
          that.nextImg()
        })
        closeclick.addEventListener("click", function (e) {
          // e.preventDefault();
          closeclick.setAttribute("style", "display: none !important")
          prevclick.setAttribute("style", "display: none !important")
          nextclick.setAttribute("style", "display: none !important")
          that.hideImg()
          that.imgviewerPopup = false
          that.opinionModal = false
        })
      })
    },
    viewee () {
      const prev = document.getElementById("indexprev")
      const next = document.getElementById("indexnext")
      const close = document.getElementById("indexclose")
      close.setAttribute("style", "display: block !important")
      prev.setAttribute("style", "display: block !important")
      next.setAttribute("style", "display: block !important")
    },
    /**
     * 上一张图片，和下一张图片；
     * this.$viewer是获取到当前的实例对象；
     * this.$viewer.viewer是获取当前dom结构；
     * 然后匹配数组找到当前图片对象；
     */
    prevImg () {
      // this.$refs.viewer.$viewer.prev();
      this.myViewer.prev()
      console.log("previmg")
      // console.log(this.$viewer.viewer);这个可以获取dom结
      this.ky_photoList.forEach((k, i) => {
        if (i === this.myViewer.index) {
          this.curImgObj = k
          console.log("当前图片对象")
          console.log(this.curImgObj)
        }
      })
    },
    nextImg () {
      this.myViewer.next()
      console.log("nextimg")
      this.ky_photoList.forEach((k, i) => {
        if (i === this.myViewer.index) {
          this.curImgObj = k
          console.log("当前图片对象")
          console.log(this.curImgObj)
        }
      })
    },
    hideImg () {
      this.myViewer.hide()
    },
    /**
     * bus传值，bus$emit发送，on接收
     * 全屏播放，接收来自组件的值，组件是munu.vue
     */
    play () {
      const that = this
      bus.$on("fullplay", (msg) => {
        that.List = that.ky_imgList
        console.log(msg)
        that.index = 0
        that.options.backdrop = true
        that.options.button = true
        that.options.toolbar = true
        that.options.navbar = true
      })
    },
    /**
     * 点击添加相片修改要求
     * 第一步，判断选中的数组this.selectedArr.length是不是等于1，如果是，就执行==1的，如果不是，return；
     * 第二部，进一步确认当前选中的照片是否==this.currentImgObj单击选中的元素；
     * 第三步，modify为1和3的不要，1是默认不更改，3是删除照片的
     */
    checkboxChangeFun (e, k, i) {
      console.log("详情图片checkbox")
      if (e) {
        // 这是选中的；
        this.ky_imgList.forEach((v) => {
          if (v.id === this.curImgObj.id) {
            console.log(v)
            console.log(k)
            k.num.push(v.url)
            v.photoNames.push(k.title)
            Array.from(new Set(v.photoNames))
            v.modify = 2
            v.isModify = true
            this.ky_lookArr.forEach((v2) => {
              if (v2.name !== k.name) {
                console.log(v2)
                v2.num.splice(v2.num.indexOf(v.url), 1)
                v2.isSelected = false
              }
            })
          }
        })
      } else {
        // 这是没选中的；
        console.log("卡萨回过神来")
        this.ky_imgList.forEach((v) => {
          if (v.id === this.curImgObj.id) {
            console.log(v)
            console.log(k)
            k.num.splice(k.num.indexOf(v.url), 1)
            v.photoNames.splice(v.photoNames.indexOf(k.title), 1)
            v.modify = 1
            v.isModify = false
            v.modify_note = ""
            this.ky_lookArr.forEach((v2) => {
              if (v2.name !== k.name) {
                console.log(v2)
                v2.isSelected = true
                v2.num.push(v.url)
                Array.from(new Set(v2.num))
              }
            })
          }
        })
      }
    },
    /**
     * 打开留言弹窗；
     * 循环数组对象
     * modify:1,不需要修改；modify:2,需要修改
     * this.singleNote是v-modal textarea
     */
    openOpinion () {
      // this.curImgId=true;
      console.log("弹窗")
      this.ky_imgList.forEach((k) => {
        if (k.id === this.curImgObj.id) {
          if (k.modify == 1 || k.modify == 3) {

          } else if (k.modify === 2) {
            console.log(k)
            this.singleNote = k.modify_note
            this.opinionModal = true
          }
        }
      })
      // this.opinionModal = true;
    },
    closableCancel () {
      this.ky_imgList.forEach((k) => {
        if (k.id === this.curImgObj.id) {
          k.modify_note = ""
        }
      })
      this.opinionModal = false
    },
    opinionOk () {
      this.ky_imgList.forEach((k) => {
        if (k.id === this.curImgObj.id) {
          k.modify_note = this.singleNote
        }
      })
      this.opinionModal = false
    },
    opinionCancel () {
      this.ky_imgList.forEach((k) => {
        if (k.id === this.curImgObj.id) {
          k.modify_note = ""
        }
      })
      this.opinionModal = false
    },
    linkFun () {
      bus.$emit("ps-show", this.curImgObj)
      // this.$router.push({name: 'ps'});
    }
  },
  beforeDestroy () {
    var prev = document.getElementById("indexprev")
    var next = document.getElementById("indexnext")
    var close = document.getElementById("indexclose")
    prev.removeEventListener("click")
    next.removeEventListener("click")
    close.removeEventListener("click", function (e) {
      console.log("销毁了bus")
    })
  }
}
</script>

<style>
.viewer-loading > img {
  display: none; /* hide big images when it is loading */
}
.imageke {
  display: none;
}
.viewer-container {
  background: #000;
}
#indexprev {
  position: absolute;
  z-index: 1024;
  top: 50%;
  left: 10%;
}
#indexnext {
  position: absolute;
  z-index: 1024;
  top: 50%;
  right: 10%;
}
.none {
  display: none;
}
#indexclose {
  position: absolute;
  z-index: 1024;
  top: 1%;
  right: 1%;
}
</style>
