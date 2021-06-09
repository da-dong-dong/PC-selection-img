<template>
  <div class="printingSub_container">
    <div class="print_head">
      打印模板
      <span class="float_r" @click="printClose">关闭</span>
    </div>
    <div class="prin_cont" :style="{ 'height': prHeight + 'px'}">
      <div class="cont_l">
        <div class="chose_print">
          选择打印模板
        </div>
        <Select v-model="printId" style="width:200px" class="mar_b10" @on-change="printChange">
          <Option v-for="item in printList" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Button @click="printClick" style="width:200px" class="mar_b10">
          开始打印
        </Button>
        <Button @click="saveImg" style="width:200px" class="mar_b10">
            保存为图片
        </Button>
        <Button @click="printClose" style="width:200px" class="mar_b10">
          取消打印
        </Button>
      </div>
      <div class="flex_1" v-html="htmlContent" id="htmlImg" ref="print">
        {{htmlContent}}
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { mapGetters } from 'vuex'
import { getTemList, getPrintOut } from '@/api/apiAll.js'
function doPrint3 (html) {
  var iframe = document.getElementById('print-iframe')
  var doc = null
  if (!iframe) {
    iframe = document.createElement('IFRAME')
    iframe.setAttribute('id', 'print-iframe')
    iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;')
    document.body.appendChild(iframe)
    doc = iframe.contentWindow.document
    doc.write('<div id="replace">' + html + '</div>')
  } else {
    doc = iframe.contentWindow.document
    doc.getElementById('replace').innerHTML = html
  }
  doc.close()
  iframe.contentWindow.focus()
  iframe.contentWindow.print()
  if (navigator.userAgent.indexOf('MSIE') > 0) {
    document.body.removeChild(iframe)
  }
}
export default {
  props: {
    type: String
  },
  computed: {
    ...mapGetters('typeModule', [
      'get_allImg'
    ]),
    ...mapGetters('app', [
      'get_parseUrl'
    ])
  },
  data () {
    return {
      printId: null,
      printList: [],
      itemIds: [],
      prHeight: 500,
      htmlContent: ''
    }
  },
  methods: {
    saveImg () {
      html2canvas(this.$refs.print, { allowTaint: true, useCORS: true }).then(function (canvas) {
        var a = document.createElement('a')
        a.href = canvas.toDataURL()
        var event = new MouseEvent('click')
        a.download = '打印'
        a.dispatchEvent(event)
      })
    },
    firstLoad (itemIds) {
      this.itemIds = itemIds
      this.getTemList(this.type).then(res => {
        if (this.printList.length > 0) {
          this.getPrintContent(itemIds, this.printId, true)
        }
      })
    },
    // 获得打印模板
    getPrintContent (itemIds, id, bool) {
      let params = {
        dataId: itemIds,
        id: id,
        shopId: Number(this.get_parseUrl.shopId)
      }
      if (this.type === 'ORDER_RECEIPT') {
        params.isShow = bool
      }
      return getPrintOut(params).then(res => {
        this.htmlContent = res.data
      })
    },
    printClick () {
      if (this.type === 'ORDER_RECEIPT') {
        this.getPrintContent(this.itemIds, this.printId, false).then(res => {
          doPrint3(this.$refs.print.innerHTML)
        })
      } else {
        doPrint3(this.$refs.print.innerHTML)
      }
    },
    printClose () {
      this.$parent.close()
    },
    // 获得打印模板
    getTemList (type) {
      let params = {
        printOrderType: 'DEFAULT',
        printTemplateType: type
      }
      if (type === 'ORDER_RECEIPT') {
        params.printOrderType = 'DEFAULT'
      }
      return getTemList(params).then(res => {
        this.printList = res.data
        if (this.printList.length > 0) {
          this.printId = this.printList[0].id
        }
      })
    },
    // 切换打印模板
    printChange (v) {
      this.getPrintContent(this.itemIds, v, true)
    }
  },
  created () {
    this.prHeight = window.innerHeight - 70
  }
}
</script>

<style lang="scss" scoped media="print">
.printingSub_container{
  width: 100%;
  background: #ffffff;
  height: 100%;
  position: relative;
  .mar_l5{
    margin-left: 5px;
  }
  .center_content{
    position: absolute;
    top: 25px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin: auto;
    width: 700px;
  }
  .date{
    display: inline-block;
    margin-right: 30px;
  }
  .sTable{
    margin-top: 5px;
    width: 100%;
    border: 1px solid #000;
    td{
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      padding-left: 3px;
    }
    tr{
      td:nth-child(1), td:nth-child(3) {
        width: 280px;
      }
      td:nth-child(2), td:nth-child(4) {
        width: 80px;
      }
      td:last-child{
        border-right: none;
      }
    }
    tr:last-child{
      td{
        border-bottom: none;
      }
    }
  }
  .oTable{
    margin-top: 5px;
    width: 100%;
    border: 1px solid #000;
    td{
      border-bottom: 1px solid #000;
      border-right: 1px solid #000;
      padding-left: 3px;
    }
    tr{
      td:nth-child(1), td:nth-child(3), td:nth-child(5) {
        width: 90px;
      }
      td:nth-child(2), td:nth-child(4), td:nth-child(6) {
        width: 145px;
      }
      td:last-child{
        border-right: none;
      }
    }
    tr:last-child{
      td{
        border-bottom: none;
      }
    }
  }
  .place{
    margin-top: 5px;
    border: 1px solid #000;
    padding: 5px;
  }
  .remark{
    margin-top: 5px;
    border: 1px solid #000;
    padding: 0px 5px;
  }
  .discribe{
    margin-top: 5px;
    padding: 5px;
    border: 1px solid #000;
  }
  .float_r{
    cursor: pointer;
    float: right;
  }
  .prin_cont{
    display: flex;
    .cont_l{
      width: 230px;
      border: 1px solid #dddddd;
      border-top: none;
      height: 100%;
      padding: 10px;
    }
    .chose_print{
      margin-bottom: 10px;
    }
    .flex_1{
      flex: 1;
      height: 100%;
      padding: 20px;
    }
  }
  .btn_absolute{
    position: absolute;
    right: 10px;
  }
  @page {
    size: A4 portrait;
  }
  @media print {
    .btn_absolute{
      display: none;
    }
    .print_head{
      display: none;
    }
    .cont_l{
      display: none;
    }
  }
  .print_head{
    background-color: #61a3ff;
    color: #ffffff;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }
  .mar_b10{
    margin-bottom: 10px;
  }
  .float_r{
    float: right;
    margin-right: 10px;
  }
  /deep/td, th {
    padding: 5px 10px;
    border: 1px solid #DDD;
  }
}
</style>
