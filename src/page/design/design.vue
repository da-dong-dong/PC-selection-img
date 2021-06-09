<template>
  <div>
    <viewer
      :images="this.ky_imgList"
      :options="options"
      class="viewer"
      ref="viewer"
      @inited="inited">
      <img v-for="( k ,i ) in this.ky_imgList" :src="k.url" :data-source="k.source" :key="i" class="imageke" />
    </viewer>

    <Modal class="" :mask="false" ref="index-right-modal" v-model="imgPopup" :closable="false" width="350">
      <div class="modalTitle" slot="header">
        <span v-once>设计版确认</span>
        <span class="dianji" v-once @click="openOpinion">点击添加相片修改要求</span>
      </div>
      <div>
        <div v-for="(k, i) in this.ky_lookArr" :key="i" class="checkClass">
          <Checkbox v-model="k.isSelected" @on-change="checkboxChangeFun($event, k, i)">
            <span>{{ k.title }}</span>
          </Checkbox>
          <span>[{{ k.num.length }}]</span>
          <!-- <span>标记说明</span> -->
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
        <div v-if="curImgId">当前相片</div>
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
import { mapGetters } from "vuex"
export default {
  data () {
    return {
      opinionModal: false,
      imgPopup: false,
      singleNote: '',
      curImgId: 1,
      options: {
        url: "data-source",
        backdrop: false,
        zIndex: 1001,
        toolbar: true,
        title: false,
        tooltip: true,
        navbar: true,
        movable: false,
        rotatable: false,
        scalable: false
      },
      index: 0,
      images: []
    }
  },
  computed: {
    ...mapGetters(["ky_imgList", "ky_lookArr"])
  },
  mounted () {
  },
  methods: {
    initDiv () {
      const body = document.getElementsByTagName('body')[0]
      const div = document.createElement('div')
      div.setAttribute('id', 'indexWrap')
      const prev = document.createElement('div')
      const next = document.createElement('div')
      prev.setAttribute('id', 'indexprev')
      next.setAttribute('id', 'indexnext')
      prev.innerHTML = '<img src="https://s1.ax1x.com/2020/09/04/wFhqaj.png" style="width:48px;height:48px;" />'
      next.innerHTML = '<img src="https://s1.ax1x.com/2020/09/04/wFhbZQ.png" style="width:48px;height:48px;" />'
      div.append(prev, next)
      body.appendChild(div)
      const that = this
      prev.addEventListener('click', function () {
        that.$viewer.prev()
      })
      next.addEventListener('click', function () {
        that.$viewer.next()
      })
    },
    inited (viewer) {
      this.$viewer = viewer
      // this.initDiv();
      this.$viewer.view(this.index)
      // console.log(this.$viewer);
    },
    view (index) {
      // this.index = 2;
      // this.$viewer.view(this.index);
      // console.log(this.index);
    },
    show (k) {
      // console.log(k);
      // console.log(this.ky_imgList);
      // this.$viewer.view();
    },
    hidden () {
      console.log('hide')
      console.log(this.$viewer)
    },
    play () {
      this.$viewer.play()
    },
    destroy (viewer) {
      this.$viewer = viewer
      console.log(this.$viewer)
      console.log('destroy')
      this.prev()
    },
    openOpinion () {

    },
    checkboxChangeFun (e, k, i) {

    },
    closableCancel () {

    },
    opinionOk () {

    },
    opinionCancel () {

    }
  }
}
</script>

<style>
.viewer-loading > img {
  display: none; /* hide big images when it is loading */
}
.imageke {
  display:none;
}
.viewer-container{
  background:#000;
}
#indexprev{
  position: absolute;
  z-index: 1024;
  top: 50%;
  left: 10%;
}
#indexnext{
  position:absolute;
  z-index: 1024;
  top:50%;
  right:10%;
}
</style>
