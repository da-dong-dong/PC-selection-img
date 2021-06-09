/******************************** 全部图片展示 ***************************************/
<template>
    <div>
        <div class="img-box" @contextmenu.prevent="OnRightModel($event, item)" @dblclick="onClickDB()">
            <div :class="get_cacheFileCheck?'CacheFile':''">
                <img :src="imgF2ShowUrl" alt="" v-if="get_imgF2Show">
                <img v-else v-lazy="item.url" alt="" />
            </div>
            <div style="text-align:center;font-size:12px;">
                <div class="text_over" :title="item.name">{{ item.name }}</div>
                <div :title="item.goodsNames.join(',')" class="ellipse"> {{ item.goodsNames.join(",") }} </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ["item"],
  computed: {
    ...mapGetters("typeModule", [
      "get_imgF2Show",
      "get_cacheFileCheck"
    ])

  },
  data () {
    return {
      selectedList: [],
      imgF2ShowUrl: require("../../../assets/JPGE2.png"),
      evnets: ''
    }
  },
  methods: {
    // 右键弹窗
    OnRightModel (e, val) {
      this.$emit("OnRightModel", e, val)
    },

    // 双击点击
    onClickDB () {
      this.$emit("onClickDB")
    }
  }
}
</script>

<style lang="scss" scoped>
 .CacheFile{
    width: 70%;
    margin: 0 auto;
  }
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
