<template>
  <div style="position: relative;height: 100%;width: 100%">
    <div class="print-content">
      <div id="printImg" style="padding: 10px">
        <div class="cl">
          <p style="height: 36px;line-height: 36px;border-bottom: 1px #eaeaea solid;padding: 0 10px;">
            <span style="float: left;font-weight: bold;">客人：{{name}}-选片小图</span>
            <span style="float: right">制表：管理员&nbsp;日期：{{time}}</span>
          </p>
          <div class="cl">
            <div class="yunmeng-img-list-box" v-for="(k, i) in list" :key="i">
              <div class="img-box">
                <img  :src="k.url" alt="" >
              </div>
              <div class="txt text-h"><span>{{k.name}}</span></div>
            </div>
            <div style="clear:both"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "print-img",
  computed: {
    ...mapGetters('typeModule', [
      'get_allImg'
    ]),
    ...mapGetters('app', [
      'get_picGoods'
    ])
  },
  data () {
    return {
      list: [],
      list2: [],
      uniqueList: [],
      time: new Date()
    }
  },
  props: {
    isDisplay: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    name: {
      type: String
    }
  },
  mounted () {},
  methods: {},
  watch: {
    isDisplay: function (e) {
      if (e) {
        this.list = this.get_allImg.filter(item => {
          if (item.goodsNamesId.length > 0) {
            return item
          }
        })
        console.log(this.list)
      }
    }
  },
  created () {}
}
</script>

<style scoped lang="scss">
.ivu-modal-header{
  background: #42A3F8ff;
  padding: 10px;
}
.ivu-modal-header-inner{
  color: #fff;
}

.print-content{
  border: 1px #eaeaea solid;
  overflow: auto;
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: #f2f2f2;
  padding: 20px 200px;
}
#printImg{
  background-color: #fff;
}

#printTest{
  background-color: #fff;
}
</style>
