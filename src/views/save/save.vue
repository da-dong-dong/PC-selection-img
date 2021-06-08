/******************************** tab栏  内容 ***************************************/
<template>
    <div>
        <Modal class="yunmeng save" class-name="vertical-center-modal" v-model="showSave" title="选片保存" width="1000" :footer-hide="true" >
            <div class="cl my-form" style="min-height: 400px;overflow: auto" @click="containerClickFun">
                <!-- 单号 -->
                <div class="save-form">
                    <Form label-position="right" :label-width="80">
                        <div class="form-list">
                            <div>
                                <FormItem label="订单号"><Input :value="get_details.orderNo" disabled style="width:140px;"></Input></FormItem>
                            </div>
                            <div>
                                <FormItem label="客人姓名" disabled> <Input :value="get_details.contactNames" disabled style="width:110px;"></Input> </FormItem>
                            </div>
                            <div>
                                <FormItem label="拍摄张数"><Input :value="get_allImg.length" disabled></Input></FormItem>
                            </div>
                            <div>
                                <FormItem label="入底"><Input :value="get_details.bottomCount" disabled style="width:auto"></Input></FormItem>
                            </div>
                            <div>
                                <FormItem label="入册"><Input :value="get_details.bookCount" disabled style="width:auto"></Input> </FormItem>
                            </div>
                        </div>
                    </Form>
                </div>

                <!-- qq 联系方式 -->
                <div class="save-form">
                    <Form label-position="right" :label-width="80">
                        <div class="form-list">
                        <div>
                            <FormItem label="寄件地址"> <Input v-model="mailAddress" placeholder="请输入您的寄件地址"></Input></FormItem>
                        </div>
                        <div>
                            <FormItem label="QQ"> <Input v-model="qq" placeholder="请输入您的qq号码"></Input> </FormItem>
                        </div>
                        <div>
                            <FormItem label="电子邮件"> <Input v-model="email" placeholder="请输入您的电子邮箱"></Input> </FormItem>
                        </div>
                        </div>
                    </Form>
                </div>

                <!-- 客户要求，相片说明 -->
                <div class="form-list" style="height:80px">
                    <div class="save-form" style="margin: 0 5px 5px 10px">
                        <Form label-position="right" :label-width="80">
                            <FormItem label="客户要求">
                                <Input :rows="2" type="textarea" v-model="get_customerInstructions" placeholder="请输入"/>
                            </FormItem>
                        </Form>
                    </div>
                    <div class="save-form delsParn" style="margin: 0 10px 5px 5px">
                        <Form label-position="right" :label-width="100">
                            <Icon @click="onClickDelSetPhon" class="dels" type="ios-trash-outline" :size="18" />
                            <FormItem label="相片说明">
                                <Input :rows="2" type="textarea" :value="photoInstructions" placeholder="请输入" :disabled='true'/>
                            </FormItem>
                        </Form>
                    </div>
                </div>
                <!-- 选片详情 加挑总金额 -->
                <div class="form-list" style="height:85px">
                    <div class="save-form" style="margin: 0 5px 5px 10px">
                        <Form label-position="right" :label-width="80">
                        <FormItem label="选片详情">
                            <p style="height: 20px;line-height: 20px;">
                                选片总张数：{{ statistics.total }}张&nbsp;
                            </p>
                            <p style="height: 20px;line-height: 20px;">
                                已选入底：{{ statistics.bottomTotal }}张
                                &nbsp;&nbsp;已选入册：{{ statistics.bookTotal }}张
                            </p>
                            <p style="height: 20px;line-height: 20px;">
                                入底加挑：{{ statistics.bottomChooseTotal }}张
                                &nbsp;&nbsp;入册加挑：{{ statistics.bookChooseTotal }}张
                            </p>
                        </FormItem>
                        </Form>
                    </div>
                    <div class="save-form" style="margin: 0 10px 5px 5px">
                        <Form label-position="right" :label-width="120">
                        <FormItem label="加挑总金额(元)">
                            <Input style="width: 100px;" disabled :value="get_jtotalPrice"/>
                            &nbsp;&nbsp;
                            <Button :disabled="get_moduleFlge==2?true:false" type="primary" @click="openpopup9">添加</Button>
                            &nbsp;&nbsp;
                        </FormItem>
                        </Form>
                    </div>
                </div>

                <!-- 表格 -->
                <tables  style="z-index='3000'" ref="tablea"/>

                <!-- 按钮 -->
                 <div slot="footer" style="padding:0 10px 10px 10px;text-align: right;">
                    <Button type="primary" @click="openpopup15" style="margin-right:8px;" :disabled="get_moduleFlge==2?true:false">保存选片</Button>
                    <Button type="default" @click="openPrint" style="margin-right:8px;">打单</Button>
                    <Button type="default" @click="popup13 = true" style="margin-right:8px;">打印小图</Button>
                    <Button type="default" @click="showSave = false" style="margin-right:8px;">关闭</Button>
                    <Button type="primary" @click="recordClickFn">查看选片记录</Button>
                </div>
            </div>
        </Modal>

        <!-- 添加价格 -->
        <Modal class="yunmeng" class-name="vertical-center-modal" v-model="popup9" title="加挑详情" :mask="false" width="400">
            <div style="padding: 10px;">
                <div class="my-form">
                <Form label-position="right" :label-width="100">
                    <FormItem label="加挑总金额" id="co"> <span style="color:red;">{{jtotalPrice}}</span> </FormItem>
                    <FormItem label="本次加挑金额"> <InputNumber v-model="addPrice" style="width: 200px;"></InputNumber> </FormItem>
                    <FormItem label="本次加挑商品"> <Input type="textarea" :autosize="true" placeholder="请输入" v-model="remarks"/></FormItem>
                </Form>
                </div>
                <div slot="footer" style="padding:0 10px 10px 10px;text-align: right;">
                    <Button type="primary" @click="popup9submit">确定</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button type="default" @click="popup9cancel">取消</Button>
                </div>
            </div>
        </Modal>

    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import tables from "./components/tables.vue"
import { addEntryReceipt, getItemChooseSaleSumPrice } from '@/api/apiAll.js'
export default {
  computed: {
    ...mapGetters('typeModule', [
      'get_allImg',
      'get_moduleFlge',
      'get_jtotalPrice',
      'get_saleCategoryId'

    ]),
    ...mapGetters('app', [
      'get_details',
      'get_customerInstructions',
      'get_photoInstructions',
      'get_parseUrl',
      'get_details'
    ]),
    jtotalPrice () {
      return this.get_jtotalPrice + this.addPrice
    }
  },
  components: {
    tables
  },
  data () {
    return {
      showSave: true, // 弹窗显示
      mailAddress: '', // 寄件地址
      qq: '', // QQ
      email: '', // 电子邮件
      photoInstructions: '',
      statistics: {
        total: 0,
        bottomTotal: 0,
        bookTotal: 0,
        bottomChooseTotal: 0,
        bookChooseTotal: 0
      },
      popup9: false, // 加挑弹窗
      addPrice: 0, // 本次加挑金额
      remarks: '', // 本次加挑商品
      popup13: false // 打印小图
    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_photoInstructions'
    ]),
    ...mapMutations('typeModule', [
      'mut_jtotalPrice'
    ]),

    // 关闭弹窗
    containerClickFun () {
      console.log('关闭弹窗')
      this.$refs.tablea.outRightShow()
    },

    // 删除要求
    onClickDelSetPhon () {
      this.mut_photoInstructions({})
      this.photoInstructions = ''
      console.log('删除')
    },

    // 查找-选片二销总金额 -- 触发
    openpopup9 () {
      this.popup9 = true
    },
    // 查找-选片二销总金额 取消按钮
    popup9cancel () {
      this.popup9 = false
      this.remarks = null
      this.addPrice = 0
    },
    // 查找-选片二销总金额 确认
    popup9submit () {
      let employeePerformances = [
        {
          actorId: Number(this.get_parseUrl.userId), // 参与人
          performanceMoney: this.addPrice, // 业绩金额
          resultsRatio: 1 // 业绩比例点击快速类似
        }
      ]
      if (this.addPrice == null) {
        this.$Message.warning('您还没有加挑商品')
        return
      } else if (this.remarks == null) {
        this.$Message.warning('备注为空')
        return
      }
      let params = {
        billEntryReceiptDtos: null,
        employeePerformances: employeePerformances,
        inputEntryTypeEnum: 'ASSEMBLY',
        itemId: Number(this.get_parseUrl.itemId),
        markNo: this.get_details.itemNo,
        name: this.remarks, // 消费项目
        receiptShopId: Number(this.get_parseUrl.shopId),
        receiptTime: new Date().getTime(),
        receiptUser: Number(this.get_parseUrl.userId),
        recordId: Number(this.get_details.financeId),
        remark: "",
        saleCategoryId: this.get_saleCategoryId,
        saleName: '选片师二销',
        // shopId:14,
        shopId: Number(this.get_parseUrl.shopId),
        sumPrice: this.addPrice
      }
      addEntryReceipt(params).then(res => {
        if (res.code === 200) {
          this.remarks = null
          this.addPrice = 0
          getItemChooseSaleSumPrice({ itemId: this.get_parseUrl.itemId }).then(res => {
            this.mut_jtotalPrice(res.data)
            this.$Message.success('提交成功！')
            this.popup9 = false
          })
        }
      })
    },

    // 打开选片记录
    recordClickFn () {
      this.recordShow = true
      // 选片日志接口
      this.geiLogs()
    },

    // 打单
    openPrint () {
      this.printModal = true
      this.$refs.printRef.firstLoad([this.chooseDetails.itemId])
    },

    // 保存选片弹出弹窗 start
    openpopup15 () {
      this.popup15 = true
    }
  },
  created () {
    for (let key in this.get_photoInstructions) {
      this.photoInstructions += `${key}:${this.get_photoInstructions[key]}\n`
    }
    // 计算已经选好
    let noSelectImgNum = 0
    let prtImgNum = 0
    let outImgNum = 0
    this.get_allImg.map(item => {
      if (item.goodsNames.length === 0) {
        noSelectImgNum++
      }
      if (item.goodsNames.includes('入册')) {
        prtImgNum++
      }
      if (item.goodsNames.includes('入底')) {
        outImgNum++
      }
    })
    this.statistics.total = this.get_allImg.length - noSelectImgNum
    this.statistics.bookTotal = prtImgNum
    this.statistics.bottomTotal = outImgNum
  }

}
</script>

<style lang="scss" scoped>
.save{
  /deep/.ivu-modal-wrap{
    z-index: 1018 !important;
}
      /deep/.ivu-modal-mask{
    z-index: 1006 !important;
}

}
.save-form{
     margin: 10px;
    border: 1px #dcdee2 solid;
    padding: 10px;
    padding-bottom: 5px;
}
.ivu-select-dropdown{
  z-index: 3000;
}
.form-list{
  display: flex;
  height: 35px;
  >div{
    flex: 1;
  }
}
.delsParn{
  position: relative;
  /deep/ .ivu-form-item-label{
    text-align: left;
  }
  .dels{
    cursor: pointer;
    position: absolute;
    left: 75px;
    top: 17px;
  }
}
#co .ivu-form-item-label{
        color: red;
}
</style>
