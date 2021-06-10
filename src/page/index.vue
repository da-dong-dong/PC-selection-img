<template>
  <div class="container">
    <indexMenu></indexMenu>
    <!-- <div class="indexTitle" v-show="showTitle">{{ title }}&nbsp;-&nbsp;照片张数：{{ length }}</div> -->
    <div class="indexTitle" v-show="showTitle">{{ title }}</div>

    <router-view></router-view>

    <!--进入保存 start modal--------------------------------------------------->
    <Modal title="看设计状态" v-model="saveModal" :styles="{ top: '200px' }" width="960px" :mask="true">
      <div class="mx-2">
        <div class="d-flex align-items-center">
          <Form :model="formItem" :label-width="180">
            <FormItem label="请选择本次看设计状态：">
              <Select v-model="formItem.select" style="width:180px">
                <Option value="PROCESSING">待修改</Option>
                <Option value="COMPLETE">OK</Option>
                <Option value="NOT_PROCESSING">未看</Option>
              </Select>
            </FormItem>
          </Form>
          <div style="margin-left:12px;">
            <Button type="primary" @click="updateClick">&nbsp;&nbsp;确定&nbsp;&nbsp;</Button>
          </div>
        </div>

        <div>
          <Input
            v-model="textareaNote"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20 }"
            placeholder="输入本次看设计备注说明~~"
          />
        </div>

        <!-- 相片说明 -->
         <div style="margin-top:20px">
          <Input
            v-model="textareaPhone"
            disabled
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20 }"
            placeholder="相片说明~~"
          />
        </div>

        <!-- <div class="text-right py-2">
          <Checkbox v-model="allExpedited" @on-change="expeditedChange">全部加急</Checkbox>
          <span>
            <span>加急取件日期：</span>
            <DatePicker
              type="date"
              v-model="date"
              placeholder="请选择加急取件日期"
              style="width: 200px"
              @on-change="changeDatePicker"
            ></DatePicker>
          </span>
        </div>

        <div class="pb-2">
          <Table
            height="250"
            border
            :columns="columns1"
            :data="tableData"
            @on-row-dblclick="rowDbclickFun"
            @on-cell-click="cellClickFun"
            @on-row-click="rowClickFun"
          ></Table>
        </div>
        <div class="pb-2 text-center">
          <Page
            :total="dataTotal"
            :page-size="pageSize"
            show-sizer
            show-total
            prev-text="上一页"
            next-text="下一页"
            @on-change="changepage"
            @on-page-size-change="pagesizechange"
          />
        </div> -->
      </div>
      <div slot="footer"></div>
    </Modal>
    <!--进入保存 end modal--------------------------------------------------->

    <Modal
      title="请选择要看设计版的相片"
      v-model="startModal"
      width="400"
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <div>
        <div style="padding:1rem 10px 0.5rem 10px;">
          <Select v-model="selectServer" style="width:100%" placeholder="请选择服务器" @on-change="selectChangeServe">
            <Option v-for="item in serverArr" :value="item.id" :key="item.id">{{ item.serverName }}</Option>
          </Select>
        </div>
        <div style="padding: 10px;">
          <!-- <Select v-model="selectType" style="width:100%" placeholder="请选择设计版类型" @on-change="selectChangeType"> -->
            <!-- <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option> -->
            <!-- <Option value="设计版">设计版</Option> -->
          <!-- </Select> -->
        </div>
      </div>
      <div slot="footer" style="text-align:center">
        <Button type="primary" @click="openIndex(1)">进入查看设计模式</Button>
        <!-- <Button type="primary" @click="openIndex(2)">查看设计版模式</Button> -->
      </div>
    </Modal>

    <!-- 标记说明 绘制图片 -->
    <Modal v-model="popup7" fullscreen :closable="false" :footer-hide="true">
      <div class="ps-header-title" slot="header">
        <span class="title">标记说明</span>
        <div class="right-btn-box">
          <span @click="originalImg">显示原图</span>
          <span @click="savePsImg">绘制完成</span>
          <span @click="hidePsFun">关闭</span>
        </div>
      </div>
      <ps ref="pss"></ps>
    </Modal>

    <Modal
      v-model="popup2"
      width="360"
      title="请输入日期"
      :mask="true"
      :mask-closable="true"
      ref="popup22"
      class-name="vertical-center-modal"
    >
      <div style="text-align:center;padding:1rem 0rem;">
        <Input v-model="popup2value" placeholder="请输入加急取件日期（如：2020-10-10）" style="width: 300px" />
      </div>
    </Modal>
    <!-- end标记说明 绘制图片 -->
    <imgViewer></imgViewer>
  </div>
</template>

<script>
import indexMenu from "@/components/indexComponents/index-top-menu/menu"
import imgViewer from "@/components/indexComponents/index-img-viewer/index-img-viewer"
import bus from "@/util/bus"
import { mapGetters, mapMutations } from "vuex"
import ps from "@/components/ps"
import { isIntranetAvailable, getAllPic, getPicConfigList, getDesignList, getListUsing, updateDegign } from '@/api/apiAll.js'
import { sha1 } from '@/util/util.js'
export default {
  components: {
    indexMenu,
    ps,
    imgViewer
  },
  data () {
    return {
      textareaPhone: '', // 相片说明
      popup2: false,
      popup7: false,
      length: 0,
      psModel: false,
      selectType: "设计版", // 首次弹出窗口选择选片类型
      selectServer: "", // 首次弹出窗口选择服务器
      currentSelectServer: null,
      serverArr: [],
      startModal: false, // 一开始出现的modal
      saveModal: false,
      title: "", // 顶部路由title
      showTitle: true, // 控制title
      allExpedited: true, // 全部加急
      selServerObj: {}, // 当前选中的服务器
      designListObj: null, // 设计片详情对象
      popupdate: new Date(),
      popup2value: "dd",
      date: new Date(), // 加急取件日期
      timestamp: new Date().getTime(), // 获取时间戳
      productListObj: null,
      iscellClickFun: false,
      photoNum: 0, // 照片张数
      textareaNote: "", // textarea
      obj1: null,
      obj2: null,
      obj3: null,
      obj4: {},
      list3: [],
      list4: [],
      formItem: {
        select: "PROCESSING"
      },
      dataTotal: 0, // 初始化信息总条数；
      pageSize: 10, // 每页显示多少条
      tableData: [], // 绑定表格数据
      cellEvent: null,
      page: 1, // 当前页码
      imgObj: null,
      ajaxtableData: [], // 查找-子订单商品列表传过来的数据做动态分页处理
      columns1: [
        {
          title: "商品名称",
          key: "name",
          width: "170"
        },
        {
          title: "价格",
          key: "salePrice",
          width: "90"
        },
        {
          title: "P数",
          key: "countP",
          width: "65"
        },
        {
          title: "数量",
          key: "countNum",
          width: "65"
        },
        // {
        //   title: "加急",
        //   key: "expedited",
        //   width: '80'
        // },
        {
          title: "加急日期",
          key: "expeditedTime",
          width: "130",
          render: (h, params) => {
            if (!this.allExpedited) {
              return h('Input', {
                props: {
                  value: params.row.expeditedTime
                },
                attrs: {
                },
                on: {
                  "on-blur": event => {
                    console.log(event)
                    console.log(this.common.isDate(event.target.value))
                    let t = this.common.isDate(event.target.value)
                    console.log(t)
                    if (t) {
                      console.log('这里这里')
                      console.log(t)
                      params.row.expeditedTime = event.target.value
                      this.rendeRexpeditedTime(params.row)
                    } else {
                      console.log(t)
                      console.log('是哪里哪里')
                      event.target.value = ""
                      params.row.expeditedTime = event.target.value
                      this.rendeRexpeditedTime(params.row)
                    }
                  }
                }
              }, params.row.expeditedTime)
            } else {
              return h('div', {
                props: {
                  value: params.row.expeditedTime
                },
                attrs: {
                }
              }, params.row.expeditedTime)
            }
          }
        },
        {
          title: "产品备注",
          key: "remark",
          width: "auto",
          render: (h, params) => {
            if (!this.allExpedited) {
              return h('Input', {
                props: {
                  value: params.row.remark
                },
                attrs: {
                },
                on: {
                  "on-blur": event => {
                    console.log(event)
                    params.row.remark = event.target.value
                    this.rendeRexpeditedTime(params.row)
                  }
                }
              }, params.row.remark)
            } else {
              return h('div', {
                props: {
                  value: params.row.remark
                },
                attrs: {
                }
              }, params.row.remark)
            }
          }
        }
      ],
      designJson: [],
      photolookDesign: [],
      okArr: [],
      modifyArr: [],
      delArr: [],
      imgList: [],
      dbclickX: 0,
      dbclickY: 0,
      itemIds: '',
      ids: '',
      ccIds: '',
      tickets: '',
      shopIds: '',
      userIds: ''
    }
  },
  created () {
    // 初始化this.title
    this.title = this.$route.meta.title
    console.log(this.$route)
    // 接受menu组件传过来的值
    this.handlerSaveFun()
    // 获取url字
    const itemIds = sessionStorage.getItem("kyitemId")
    console.log(itemIds)
    if (!itemIds) {
      console.log('url截取')
      this.itemIds = this.common.getUrlParam2("itemId")
      const itemIds = this.common.getUrlParam2("itemId")
      this.ids = this.common.getUrlParam2("id")
      this.tickets = this.common.getUrlParam2("ticket")
      this.shopIds = this.common.getUrlParam2("shopId")
      this.userIds = this.common.getUrlParam2("userId")
      this.ccIds = this.common.getUrlParam2("ccId")
      console.log(this.itemIds)
      sessionStorage.setItem("kyIndex", 'kyIndex')
      sessionStorage.setItem("kyitemId", this.itemIds)
      sessionStorage.setItem('kyticket', this.tickets)
      sessionStorage.setItem("kyccId", this.ccIds)
      sessionStorage.setItem('kyshopId', this.shopIds)
      sessionStorage.setItem('kyuserId', this.userIds)
      this.set_ky_ccId(this.ccIds)
    } else {
      console.log('刷新后拿到itemid')
      this.itemIds = sessionStorage.getItem('kyitemId')
      this.tickets = sessionStorage.getItem('kyticket')
      this.shopIds = sessionStorage.getItem('kyshopId')
      this.userIds = sessionStorage.getItem('kyuserId')
      this.ccIds = sessionStorage.getItem('kyccId')
      sessionStorage.setItem("kyIndex", 'kyIndex')
      sessionStorage.setItem("kyitemId", this.itemIds)
      sessionStorage.setItem('kyticket', this.tickets)
      sessionStorage.setItem("kyccId", this.ccIds)
      sessionStorage.setItem('kyshopId', this.shopIds)
      sessionStorage.setItem('kyuserId', this.userIds)
    }
  },
  computed: {
    ...mapGetters(["ky_serveArr", "ky_imgList", "ky_photoUrl", "ky_lookArr", "ky_modifyArr", "ky_okArr", "ky_delArr", "ky_ccId", "getCacheFileShow"])
  },
  mounted () {
    this.getInit()
    // 对图片标记说明，ps组件，mouted接受来自children的bus传值；
    bus.$on("ps-show", (d) => {
      this.popup7 = true
      this.imgObj = d
      this.$nextTick(() => {
        this.$refs.pss.fileFun(d)
      })
    })
  },
  methods: {
    ...mapMutations([
      "set_ky_serveArr",
      "set_ky_photoUrl",
      "set_ky_imgList",
      "set_ky_lookArr",
      "set_ky_modifyArr",
      "set_ky_okArr",
      "set_ky_delArr",
      "set_ky_photoList",
      "set_ky_ccId"
    ]),
    /**
     * 初始化数据
     * await getServer获取服务器列表
     * await getImg获取图片数据
     */
    async getInit () {
      await this.getServerList() // 获取服务器列表
      this.getDesignList() // 获取设计版详情
      this.startModal = true
      this.intranetAvailable() // 判断当前内网地址是否可用
    },
    async intranetAvailable () {
      console.log(this.currentSelectServer)
      let isUrlAvailable = await this.isUrlAvailable(this.currentSelectServer.intranetAddress) // 判断当前服务器可用不可用
      if (isUrlAvailable) {
        console.log("内网可用")
        this.set_ky_photoUrl(this.currentSelectServer.intranetAddress) // 如果可用，把地址存到vuex中去调取服务器图片
        sessionStorage.setItem("A", this.currentSelectServer.intranetAddress)
      } else {
        console.log("内网不可用")
        if (this.currentSelectServer.enableFrpPublicAddress) {
          let isUrlAvaliable = this.isUrlAvailable(this.currentSelectServer.publicAddress).then((res) => {
            console.log(res)
            if (res) {
              console.log("外网可用")
              this.set_ky_photoUrl(this.currentSelectServer.publicAddress)
              sessionStorage.setItem("A", this.currentSelectServer.publicAddress)
              // sessionStorage.setItem("hhh", this.itemIds);
              const content = `<div>您选择的${this.currentSelectServer.serverName}的${this.selectType}功能未启动服务！是否要继续操作？</div>`
              this.$Modal.confirm({
                title: "利亚方舟智能设计片系统提醒您！",
                content: content,
                onOk: () => {
                  this.startModal = false
                },
                onCancel: () => {
                  window.close()
                }
              })
            }
          })
        } else {
          const content = `<div>您选择的${this.currentSelectServer.serverName}的${this.selectType}功能未启动服务！是否要继续操作？</div>`
          this.$Modal.confirm({
            title: "利亚方舟智能设计片系统提醒您！",
            content: content,
            onOk: () => {
              this.startModal = false
            },
            onCancel: () => {
              window.close()
            }
          })
        }
      }
    },
    /**
     * 获取服务器列表
     * this.selectServer是当前默认显示服务器id；
     * this.currentSelectServer是当前默认的第一个服务器id所在的数组
     */
    getServerList () {
      return new Promise((resolve, reject) => {
        getPicConfigList().then(res => {
          console.log("获取服务器")
          console.log(res)
          this.serverArr = res.data
          if (this.serverArr.length >= 1) {
            this.selectServer = this.serverArr[0].id
            this.currentSelectServer = this.serverArr[0]
            sessionStorage.setItem("B", this.serverArr[0].serverKey)
          } else {
            this.$Message.error("暂无服务器~~")
          }
          this.set_ky_serveArr(res.data) // 把服务器列表存到vuex;
          resolve()
        }).catch((e) => {
          this.$Message.error("获取服务器失败" + e.msg)
        })
      })
    },
    /**
     * 获取当前可用服务器地址url，内网外网是否可用；
     * 可以在intranetAvailable()里找到；可用返回true,不可用返回false
     */
    isUrlAvailable (url) {
      return new Promise((resolve, reject) => {
        isIntranetAvailable(url).then(() => {
          resolve(true)
        }).catch(() => {
          resolve(false)
        })
      })
    },
    /**
     * 获取图片列表
     * this.designObj={
     * designJson: null
     * financeId: 35
     * itemId: 159
     * itemName: "佳兆业1"
     * itemNo: "ZYD00-1-01"
     * orderId: 228
     * orderNo: "ZYD00-1"}
     */
    getImg (obj) {
      return new Promise((resolve, reject) => {
        let newData = new Date().getTime()
        let nonce = Math.floor(Math.random(1) * 10000)
        let sha1s = sha1(`lyfz.net${newData}${nonce}`)
        let headers = {
          signature: sha1s,
          timestamp: newData,
          nonce: nonce,
          app_key: sessionStorage.getItem('B'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
        let params = {
          OrderNumber: this.designListObj.orderNo,
          SubOrderNumber: this.designListObj.itemNo,
          ImportType: 4,
          recursive: 1,
          searchPattern: "JPG"
        }
        let json = {
          url: sessionStorage.getItem('A'),
          params,
          headers
        }
        getAllPic(json).then((res) => {
          console.log("获取图片列表res~~")
          console.log(res)
          let arr = []
          let photoArr = []
          let itemNo = this.designListObj.itemNo
          arr = res.data
          this.obj1 = {
            title: "确认ok!",
            name: "ok",
            isSelected: true,
            num: [],
            disabled: true,
            biaoji: true
          }
          this.obj2 = {
            title: "待修改",
            name: "modify",
            isSelected: false,
            num: [],
            disabled: false,
            biaoji: true
          }
          arr.forEach((k) => {
            let str = k.slice(k.lastIndexOf(`${itemNo}\\`) + 1 + itemNo.length)
            this.obj4 = {
              isModify: false,
              photoName: [str.slice(str.lastIndexOf(`\\`) + 1)],
              modify_note: "",
              modify: 1,
              photoNames: [],
              p: 0,
              photoIds: [],
              status: 0,
              id: str,
              url: `${this.ky_photoUrl}/fserver/iDownloadFile?keypath=${k}`,
              thumbnail: `${this.ky_photoUrl}/fserver/iDownloadFile?keypath=${k}${window.MainWindow && this.getCacheFileShow ? '' : '&size=s'}`,
              source: `${this.ky_photoUrl}/fserver/iDownloadFile?keypath=${k}&size=p`
            }
            this.list3.push(this.obj4)
          })
          if (this.imgList.length == 0) {
            console.log("执行了这里")
            this.list4.push(this.obj1, this.obj2)
            this.set_ky_imgList(this.list3) // 存到vuex中去
            this.set_ky_lookArr(this.list4)
            this.$router.push({ name: "indexAllImg" }).catch(() => {})
          } else {
            console.log("8888888888")
            console.log(this.imgList, this.list3)
            this.list3.forEach((k) => {
              this.imgList.forEach((k2) => {
                if (k.id == k2.photoName) {
                  k.modify = k2.modify
                  k.modify_note = k2.modify_note
                }
              })
            })
            this.okArr = this.list3.filter((k) => {
              return k.modify == 1
            })
            this.modifyArr = this.list3.filter((k) => {
              return k.modify == 2
            })
            this.delArr = this.list3.filter((k) => {
              return k.modify == 3
            })
            photoArr = this.list3.filter((k) => {
              return k.modify == 1 || k.modify == 2
            })
            this.list3.forEach((k) => {
              if (k.modify == 1) {
                this.obj1.num.push(k.url)
                Array.from(new Set(this.obj1.num))
              }
              if (k.modify == 2) {
                this.obj2.num.push(k.url)
                Array.from(new Set(this.obj2.num))
                k.photoNames.push(this.obj2.title)
                Array.from(new Set(k.photoNames))
              }
            })
            this.list4.push(this.obj1, this.obj2)
            this.set_ky_lookArr(this.list4)
            sessionStorage.setItem("ky_design", "1")
            sessionStorage.setItem("ky_lookArr", JSON.stringify(this.list4))
            sessionStorage.setItem("ky_imgList", JSON.stringify(photoArr))
            this.set_ky_photoList(photoArr)
            this.set_ky_imgList(photoArr) // 存到vuex中去
            this.set_ky_okArr(this.okArr)
            this.set_ky_modifyArr(this.modifyArr)
            this.set_ky_delArr(this.delArr)
            this.$router.push({ name: "indexAllImg" }).catch(() => {})
          }
        }).catch(() => {
          resolve([])
        })
      })
    },
    /**
     * 查找，设计看版详情
     */
    getDesignList () {
      const params = {
        itemId: Number(sessionStorage.getItem('kyitemId'))
      }
      return getDesignList(params)
        .then((res) => {
          console.log("查找，设计看板详情~~")
          console.log(res)
          let arr = []
          console.log(JSON.parse(res.data.designJson))
          this.designListObj = res.data
          this.designJson = JSON.parse(res.data.designJson)
          console.log("designJson ---------------------------")
          this.photolookDesign = this.designJson.PhotoLookDesign
          let newObj = this.designJson
          /**  解析数据 =>
           * {  delImgs: [], // 删除
           *    confirmPhoto: ["正常(490)\\185f439d7afcfa760d9022a95e35e265.jpg"], 确认OK的相片
           *    modifiedPhoto: ["正常(490)\\185f439d7afcfa760d9022a95e35e265.jpg"], 需要修改的相片
           *    photoInstructions: "",  跟选片一样 相片说明
           *    customerInstructions: "111" 客户说明
           * }
           */

          /**   装置数据=>
           * {
           *  modify: 1,  => 1:ok, 2:待修改， 3：删除
           *  modify_note: "", => 备注
           *  photoName: "加拍(304)\\aa.jpg"
           * }
          */
          let newImgList = []
          // 删除
          newObj.delImgs.map(item => {
            let json = {
              modify: 3,
              modify_note: "",
              photoName: item
            }
            newImgList.push(json)
          })
          // 确认OK
          newObj.confirmPhoto.map(item => {
            let json = {
              modify: 1,
              modify_note: "",
              photoName: item
            }
            newImgList.push(json)
          })
          // 需要修改
          newObj.modifiedPhoto.map(item => {
            let json = {
              modify: 2,
              modify_note: "",
              photoName: item
            }
            newImgList.push(json)
          })
          // 添加相片说明
          let strArr = newObj.photoInstructions.split("\n").map(item => item.split(":"))
          newImgList.map(item => {
            strArr.map(item_ => {
              if (item.photoName == item_[0]) {
                item.modify_note = item_[1]
              }
            })
          })
          console.log('new', newImgList)

          this.imgList = newImgList

          this.textareaNote = newObj.customerInstructions // 客户要求
          this.textareaPhone = newObj.photoInstructions // 相片说明
          this.designListObj = res.data
          sessionStorage.setItem("ky_designList", JSON.stringify(res.data))
        })
        .catch((e) => {
          this.$Message.warning(`${e.message}`)
        })
    },
    /**
     * ajax.updateDegign更新设计看版详情
     * 合并数据列表，做去重处理
     * reduce数组对象去重
     * map生成特定格式
     * {
        "general_require":"客户修改要求",
        "last_modify_time":"",
        "order_status":1,
        "PhotoLookDesign":[
        {
        "photoName":"001.jpg",
        "modify":1,
        "modify_note":"相片修改要求"
        }
        ]
        }
        order_status:1选片完成，0表示未选片；
        last_modify_time：当前的时间（时间戳）
        modify 1表示不需要修改，modify_note不需要填写
        modify 2表示需要修改，modify_note为修改要求内容

        统一数据格式
      * {  delImgs: [], // 删除
      *    confirmPhoto: ["正常(490)\\185f439d7afcfa760d9022a95e35e265.jpg"], 确认OK的相片
      *    modifiedPhoto: ["正常(490)\\185f439d7afcfa760d9022a95e35e265.jpg"], 需要修改的相片
      *    photoInstructions: "正常(490)\\185f439d7afcfa760d9022a95e35e265.jpg:aaa\n",  跟选片一样 相片说明
      *    customerInstructions: "111" 客户说明
      * }
     */
    updateClick () {
      let designJson = []
      designJson = [...this.ky_imgList, ...this.ky_okArr, ...this.ky_modifyArr, ...this.ky_delArr]
      designJson = designJson.reduce((cur, next) => {
        designJson[next.id] ? "" : (designJson[next.id] = true && cur.push(next))
        return cur
      }, [])
      designJson = designJson.map((k) => {
        return {
          photoName: k.id,
          modify: k.modify,
          modify_note: k.modify_note
        }
      })
      console.log(designJson)
      // 组装统一格式
      let delArr = []
      let confirmArr = []
      let modifiedArr = []
      let strPhot = ''
      designJson.map(item => {
        // modify => 1:ok, 2:待修改， 3：删除
        switch (item.modify) {
          case 1:
            confirmArr.push(item.photoName)
            break
          case 2:
            modifiedArr.push(item.photoName)
            break
          case 3:
            delArr.push(item.photoName)
            break
        }
        // 相片说明
        if (item.modify == 2 && item.modify_note) {
          strPhot += `${item.photoName}:${item.modify_note}\n`
        }
      })
      let newObj = {
        customerInstructions: this.textareaNote, // 客户说明
        delImgs: delArr, // 删除
        confirmPhoto: confirmArr, // 确认OK
        modifiedPhoto: modifiedArr, // 修改
        photoInstructions: strPhot // 相片说明
      }
      console.log('new', newObj)
      let updatedObj = {
        general_require: this.textareaNote,
        last_modify_time: new Date().getTime(),
        order_status: 1,
        PhotoLookDesign: Object.assign([], designJson)
      }
      const params = {
        designJson: JSON.stringify(newObj),
        itemId: Number(sessionStorage.getItem('kyitemId')),
        processStatus: this.formItem.select
      }
      console.log(params)
      return updateDegign(params)
        .then((res) => {
          console.log("更新，设计看版详情~~")
          console.log(res)
          this.$Message.info('提交成功~')
        })
        .catch((e) => {
          console.log(e)
        })
    },
    /**
     * 查看设计版模式两个按钮
     * this.startModal关闭弹窗
     */
    openIndex (t) {
      switch (t) {
        case 1:
          this.startModal = false
          this.getImg()
          // this.getDesignList();//获取设计版详情
          this.loadTableData() // 获取表格数据
          break
        case 2:
          this.startModal = false
          break
      }
    },
    /**
     * 首次弹窗，选择服务器change事件
     */
    selectChangeServe (k) {
      console.log(k)
      console.log(this.selectServer)
    },
    /**
     * 首次弹窗，选择相片列表change事件
     */
    selectChangeType (k) {
      console.log(k)
      console.log(this.selectType)
    },
    /**
     * 打开保存modal
     */
    handlerSaveFun () {
      const that = this
      bus.$on("indexmenuclick", (msg) => {
        // console.log(msg);
        if (msg.title === "进入保存") {
          that.saveModal = true
          // that.loadTableData();
          // 渲染相片说明
          let designJson = []
          designJson = [...that.ky_imgList, ...that.ky_okArr, ...that.ky_modifyArr, ...that.ky_delArr]
          designJson = designJson.reduce((cur, next) => {
            designJson[next.id] ? "" : (designJson[next.id] = true && cur.push(next))
            return cur
          }, [])
          designJson = designJson.map((k) => {
            return {
              photoName: k.id,
              modify: k.modify,
              modify_note: k.modify_note
            }
          })
          console.log(designJson)
          let strPhot = ''
          designJson.map(item => {
            // 相片说明
            if (item.modify == 2 && item.modify_note) {
              strPhot += `${item.photoName}:${item.modify_note}\n`
            }
          })
          this.textareaPhone = strPhot
        }
      })
    },
    /**
     * 用时间戳判断是否有加急，有时间戳，返回加急
     * 没有，则返回空字符串
     */
    expeditedFun (time) {
      if (time) {
        return "加急"
      } else {
        return ""
      }
    },
    /**
     * 点击保存，请求加载表格数据
     * 当ajax获取到的长度小于 this.pageSize:10,//每页显示多少条
     * 直接赋值this.tableData=this.ajaxtableData;
     * 否则this.ajaxtableData数组slice切割数据；
     */
    loadTableData () {
      const params = {
        itemId: sessionStorage.getItem('kyitemId')
      }
      return getListUsing(params)
        .then((res) => {
          console.log("获取表格数据")
          console.log(res)
          const that = this
          this.ajaxtableData = res.data
          this.ajaxtableData = this.ajaxtableData.map((k) => {
            return {
              countNum: k.countNum,
              countP: k.countP,
              defaultP: k.defaultP,
              expeditedTime: k.expeditedTime,
              // expeditedTime: this.date,
              goodsId: k.goodsId,
              expedited: "加急",
              id: k.id,
              name: k.name,
              pSalePrice: k.pSalePrice,
              pickupModeCategoryId: k.pickupModeCategoryId,
              remark: k.remark,
              salePrice: k.salePrice
            }
          })
          console.log(this.ajaxtableData)
          this.ajaxtableData.forEach((k) => {
            if (k.expeditedTime == 0) {
              k.expeditedTime = ""
              this.allExpedited = false
              this.date = ""
            } else {
              k.expeditedTime = this.common.formatDate(k.expeditedTime)
            }
          })
          this.dataTotal = res.data.length // 分页总数，共多少条
          if (this.ajaxtableData.length < this.pageSize) {
            this.tableData = this.ajaxtableData
          } else {
            this.tableData = this.ajaxtableData.slice(0, this.pageSize)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    /**
     * changepage（index）返回当前的页码；
     * 点击页码，切换table；
     * 用slice切割数组，然后赋值给绑定table的this.tableData；
     */
    changepage (index) {
      console.log("changepage" + index)
      this.page = index
      let _start = (index - 1) * this.pageSize
      let _end = index * this.pageSize
      this.tableData = this.ajaxtableData.slice(_start, _end)
    },
    /**
     * pagesizechagne(index)，返回选择的条数；
     * 多少条/页，比如10条/页，更改多少条页数后，数据显示多少条
     */
    pagesizechange (index) {
      console.log("pagesizechange" + index)
      let _start = (this.page - 1) * index
      let _end = this.page * index
      this.tableData = this.ajaxtableData.slice(_start, _end)
      this.pageSize = index
    },
    /**
     * 加急日期checkbox
     * 默认为true
     * true:全部表格加急字段为“加急”,全部表格加急时间字段和日期选择器时间相同；
     * false:全部表格加急字段为空，加急时间字段为空；
     */
    expeditedChange (e) {
      console.log(e)
      if (e) {
        console.log("true 了了较高的洛杉矶广联达")
        let arr = []
        this.date = new Date()
        this.ajaxtableData.forEach((k) => {
          k.expedited = "加急"
          k.expeditedTime = this.common.formatDate(this.timestamp)
        })
        arr = this.ajaxtableData.map((k) => {
          return {
            countNum: Number(k.countNum),
            countP: Number(k.countP),
            expeditedTime: Number(new Date(k.expeditedTime).getTime()) || 0,
            id: Number(k.id),
            pickupModeCategoryId: Number(k.pickupModeCategoryId),
            remark: k.remark
          }
        })
        arr.forEach((k) => {
          return this.ajax.updateChildGoods(k).then((res) => {
            console.log('提交成功')
          }).catch((e) => {
            console.log(e)
          })
        })
      } else {
        console.log("false 拉过来三国杀多久")
        let arr = []
        this.date = ""
        this.ajaxtableData.forEach((k) => {
          k.expedited = ""
          k.expeditedTime = ""
        })
        arr = this.ajaxtableData.map((k) => {
          return {
            countNum: Number(k.countNum),
            countP: Number(k.countP),
            expeditedTime: Number(new Date(k.expeditedTime).getTime()) || 0,
            id: Number(k.id),
            pickupModeCategoryId: Number(k.pickupModeCategoryId),
            remark: k.remark
          }
        })
        arr.forEach((k) => {
          return this.ajax.updateChildGoods(k).then((res) => {
            // console.log(res);
            console.log('提交成功')
          }).catch((e) => {
            console.log(e)
          })
        })
      }
    },
    /**
     * k:打印出当前选择的时间：yy-mm-dd
     * allExpedited是checkbox全部加急为true;
     * 遍历数组，全部加急字段为“加急”;
     * 全部加急时间字段为当前选择的k值
     */
    changeDatePicker (k) {
      if (k == "" || k == undefined) {
        console.log(k)
        this.allExpedited = false
        let arr = []
        this.date = k
        this.ajaxtableData.forEach((k) => {
          k.expedited = "加急"
          k.expeditedTime = this.date
        })
        // console.log(this.ajaxtableData);
        arr = this.ajaxtableData.map((k) => {
          return {
            countNum: Number(k.countNum),
            countP: Number(k.countP),
            expeditedTime: Number(new Date(k.expeditedTime).getTime()) || 0,
            id: Number(k.id),
            pickupModeCategoryId: Number(k.pickupModeCategoryId),
            remark: k.remark
          }
        })
        // console.log(arr);
        arr.forEach((k) => {
          return this.ajax
            .updateChildGoods(k)
            .then((res) => {
              console.log('提交成功')
            })
            .catch((e) => {
              console.log(e)
            })
        })
      } else {
        console.log("111")
        console.log(k)
        this.allExpedited = true
        let arr = []
        this.date = k
        this.ajaxtableData.forEach((k) => {
          k.expedited = "加急"
          k.expeditedTime = this.date
        })
        console.log(this.ajaxtableData)
        arr = this.ajaxtableData.map((k) => {
          return {
            countNum: Number(k.countNum),
            countP: Number(k.countP),
            expeditedTime: Number(new Date(k.expeditedTime).getTime()) || 0,
            id: Number(k.id),
            pickupModeCategoryId: Number(k.pickupModeCategoryId),
            remark: k.remark
          }
        })
        // console.log(arr);
        arr.forEach((k) => {
          return this.ajax
            .updateChildGoods(k)
            .then((res) => {
              console.log('提交成功')
            })
            .catch((e) => {
              console.log(e)
            })
        })
      }
    },
    /**
     * 点击单元格时触发
     */
    cellClickFun (row, column, data, event) {
      console.log("点击单元格时触发")
      // console.log(row);
      // console.log(column);
      // console.log(data);
      // console.log(event);
      // this.cellEvent=event;
      // if (column.key == "remark") {
      //   console.log("点击了产品备注单元格");
      //   console.log(column);
      // }
      // if (column.key == "expeditedTime") {
      //   console.log("点击了加急日期单元格");
      //   console.log(column);
      //   console.log(event);
      //   let obj = null;
      //   let newObj = null;
      //   this.tableData.forEach((v) => {
      //     if (v.id == row.id) {
      //       v.expeditedTime = "";
      //       obj = v;
      //     }
      //   });
      //   newObj = {
      //     countNum: Number(obj.countNum) || 0,
      //     countP: Number(obj.countP) || 0,
      //     expeditedTime: Number(new Date(obj.expeditedTime).getTime()) || 0,
      //     id: Number(obj.id) || 0,
      //     pickupModeCategoryId: Number(obj.pickupModeCategoryId) || 0,
      //     remark: obj.remark || "",
      //   };
      //   console.log(newObj);
      //   return this.ajax
      //     .updateChildGoods(newObj)
      //     .then((res) => {
      //       console.log(res);
      //     })
      //     .catch((e) => {
      //       console.log(e);
      //     });
      // }
    },
    /**
     * 点击某一行时触发；
     */
    rowClickFun (data) {
      // console.log("单击某一行时触发");
      // console.log(data);
      // console.log(this.tableData);
    },
    /**
     * 双击某一行触发；
     */
    rowDbclickFun (data) {
      console.log("双击某一行触发")
      console.log(data)
      let obj = null
      let newObj = null
      this.tableData.forEach((v) => {
        if (v.id == data.id) {
          v.expeditedTime = ""
          this.allExpedited = false
          obj = v
        }
      })
      newObj = {
        countNum: Number(obj.countNum),
        countP: Number(obj.countP),
        expeditedTime: Number(obj.expeditedTime),
        id: Number(obj.id),
        pickupModeCategoryId: Number(obj.pickupModeCategoryId),
        remark: obj.remark
      }
      console.log(newObj)
      return this.ajax
        .updateChildGoods(newObj)
        .then((res) => {
          console.log(res)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    /**
     * renden回调函数
     */
    renderRemark (k) {
      console.log('回调函数')
      console.log(k)
      let obj = {}
      let newObj = {}
      this.tableData.forEach((v) => {
        if (v.id == k.id) {
          console.log(v)
          v.remark = k.remark
          obj = v
        }
      })
      let time = Number(new Date(obj.expeditedTime).getTime())
      console.log(time)
      newObj = {
        countNum: Number(obj.countNum),
        countP: Number(obj.countP),
        // expeditedTime: Number(new Date(obj.expeditedTime).getTime()),
        expeditedTime: time,
        id: Number(obj.id),
        pickupModeCategoryId: Number(obj.pickupModeCategoryId),
        remark: obj.remark
      }
      return this.ajax.updateChildGoods(newObj).then((res) => {
        console.log('提交成功')
      })
        .catch((e) => {
          console.log(e)
        })
    },
    /**
     * render回调函数
     */
    rendeRexpeditedTime (k) {
      console.log('回调函数')
      console.log(k)
      let obj = {}
      let newObj = {}
      this.tableData.forEach((v) => {
        if (v.id == k.id) {
          v.expeditedTime = k.expeditedTime
          obj = v
          console.log(v)
        }
      })
      var b = Number(new Date(obj.expeditedTime).getTime())
      if (isNaN(b)) {
        b = 0
      } else {
        return b
      }
      newObj = {
        countNum: Number(obj.countNum),
        countP: Number(obj.countP),
        // expeditedTime: Number(new Date(obj.expeditedTime).getTime()),
        expeditedTime: b,
        id: Number(obj.id),
        pickupModeCategoryId: Number(obj.pickupModeCategoryId),
        remark: obj.remark
      }
      console.log(newObj)
      return this.ajax.updateChildGoods(newObj).then((res) => {
        console.log('提交成功')
      })
        .catch((e) => {
          console.log(e)
        })
    },
    updateGoods () {},
    // 标记说明
    // 显示原图
    originalImg () {
      this.$refs.pss.resetDrawFun()
      this.$refs.pss.fileFun(this.imgObj, 1)
    },
    hidePsFun () {
      this.$refs.pss.resetDrawFun()
      this.popup7 = false
    },
    savePsImg () {
      this.$refs.pss.screenshots().then((base64) => {
        this.common.base64ToFile(base64, this.imgObj.name).then((file) => {
          let path = this.imgObj.url.slice(this.imgObj.url.indexOf("=") + 1)
          this.ajax.uploadFile2(
            {
              data: { file: file, fileFullName: path },
              success: (res) => {
                this.$Message.success("操作成功")
                this.hidePsFun()
              },
              error: (res) => {
                this.$Message.error(res.msg)
              }
            },
            { serverKey: this.selServerObj.serverKey }
          )
        })
      })
    }
  },
  watch: {
    /**
     * 监听路由变化，to是到那个链接，from是从哪里来(看路由文件)
     * 但是会有一个bug，就是初始化，所以初始化在create里赋值this.title
     */
    ky_imgList: {
      handler () {
        console.log('this.imgList')
        sessionStorage.setItem("kyIndex", 'kyIndex')
        sessionStorage.setItem("kyitemId", this.itemIds)
        sessionStorage.setItem('kyticket', this.tickets)
        sessionStorage.setItem("kyccId", this.ccIds)
        sessionStorage.setItem('kyshopId', this.shopIds)
      }
    },
    $route (to, from) {
      this.title = to.meta.title
      if (to == "" || to == undefined || to == null) {
        this.showTitle = false
      }
    }
  },
  beforeDestroy () {
    // 销毁bus
    console.log("销毁bus")
    // bus.$off("indexmenuclick");
    bus.$off("ps-show")
  }
}
</script>

<style scoped lang="scss">
/deep/.vue-drag-select .select-wrapper {
    min-height: 100% !important;
}
.vertical-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.d-flex {
  display: flex;
}
.text-center {
  text-align: center;
}
.align-items-center {
  align-items: center;
}
.indexTitle {
  text-align: center;
  font-size: 18px;
  background: antiquewhite;
  color: #ff0000;
  padding: 4px 0px;
}
/deep/.ivu-form-item {
  margin-top: 24px;
}
.mx-2 {
  margin-left: 1rem;
  margin-right: 1rem;
}
.text-right {
  text-align: right;
}
.py-1 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-2 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.pb-2 {
  padding-bottom: 1rem;
}
.ps-header-title {
  position: relative;
  height: 30px;
}
.ps-header-title .title {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #fff;
}
.ps-header-title .right-btn-box {
  float: right;
  height: 30px;
  line-height: 30px;
}
.ps-header-title .right-btn-box > span {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  color: #fff;
  cursor: pointer;
  border: 1px rgba(0, 0, 0, 0) solid;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
