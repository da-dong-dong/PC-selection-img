/******************************** 解析url，http请求判断 ***************************************/
<template>
  <div>
    <div>解析url，http请求判断</div>
    <!-- 选择相片服务器 -->
    <Modal class="yunmeng" class-name="vertical-center-modal" v-model="picServerModel" title="请选择要选片的相片" width="400" :mask-closable="false">
      <div class="padding10 paddingB0">
        <Select v-model="serverVal" style="width:100%" placeholder="请选择服务器" @on-change="serverListChange">
          <Option v-for="(item,index) in picServerList" :value="index" :key="item.id">{{item.serverName}}</Option>
        </Select>
      </div>
      <div class="padding10">
        <Select v-model="selectTypeVal" style="width:100%" @on-change="selectChangeType" placeholder="请选择选片类型">
          <Option v-for="(item,key) in selectTypeList" :value="key" :key="key">{{ item }}</Option>
        </Select>
      </div>
      <div class="padding10 textR paddingT0">
        <Checkbox v-model="CacheFileShow" v-if="CacheFileCheck" @on-change="onCacheFileShow">使用缓存选片</Checkbox>
        <Button type="primary" :disabled="offImg" @click="onClickList(1)">进入选片模式</Button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <Button type="primary" :disabled="offImg" @click="onClickList(2)">进入查看模式</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { getPicConfigList, isIntranetAvailable, getCloudChooseType, updateCloudChooseType, getPhotoServer, getAllPic } from '@/api/apiAll.js'
import { parseUrl, sha1 } from '@/util/util.js'
export default {
  computed: {
    ...mapGetters('app', [
      'get_parseUrl'
    ]),
    ...mapGetters('typeModule', [
      'get_cacheFileCheck'
    ])
  },
  data () {
    return {
      parseUrlJson: {}, // url参数
      picServerModel: true, // 弹窗
      serverVal: 0,
      picServerList: [], // 相片服务器
      selectTypeVal: '0', // 选片类型值
      selectTypeList: { 0: '原片', 1: '初修片', 3: '精修片', 4: '设计片' }, // 选片类型数据
      CacheFileShow: false, // 是否勾选使用缓存
      CacheFileCheck: false, // 是否展示缓存按钮
      offImg: true, // 服务器缓慢 限制点击
      checkHttpUrl: '', // 检查成功后的服务器地址
      photoServerJson: {}, // 获取子订单相片服务器
      allPicArr: [], // 全部图片
      errNum: 0 // 弹窗没有图片次数
    }
  },
  methods: {
    ...mapMutations('app', [
      'mut_setParseUrl'
    ]),
    ...mapMutations('typeModule', [
      'mut_setCacheFileCheck',
      'mut_moduleFlge'
    ]),

    // 获取相片服务器
    getPicConfigList () {
      getPicConfigList().then(res => {
        this.picServerList = res.data
        // 检测http
        this.checkHttp()
      }).catch(err => {
        console.log(`获取相片服务器:`, err)
      })
    },

    // 选择相片服务器
    serverListChange (e) {
      this.serverVal = e
    },

    // 判断外网/内网是否可用
    isIntranetAvailable (url) {
      return new Promise((resolve, reject) => {
        isIntranetAvailable(url).then(() => {
          resolve(true)
        }).catch(() => {
          resolve(false)
        })
      })
    },

    // 检测http
    async checkHttp () {
      const httpJson = this.picServerList[this.serverVal]
      let httpFlag
      if (httpJson.enablePhotoServer) {
        console.log('***内网开启***')
        httpFlag = await this.isIntranetAvailable(`${httpJson.intranetAddress}`)
        if (httpFlag) {
          console.log('***内网可用***')
          this.checkHttpUrl = httpJson.intranetAddress
          this.offImg = false
          return
        }
      }
      // 判断外网
      if (httpJson.enablePublicAddress) {
        console.log('***外网开启***')
        httpFlag = await this.isIntranetAvailable(`${httpJson.publicAddress}`)
        if (httpFlag) {
          console.log('***外网可用***')
          this.checkHttpUrl = httpJson.publicAddress
          this.offImg = false
          return
        }
      }

      const content = `<div>您选择的${httpJson.serverName}的${'原片'}功能未启动服务！是否要继续操作？</div>`
      this.$Modal.confirm({
        title: '利亚方舟智能选片系统提醒您！',
        content: content,
        onOk: () => {
          console.log('确认')
        },
        onCancel: () => {
          window.close()
        }
      })
    },

    // 更改选片类型值
    selectChangeType (e) {
      this.selectTypeVal = e
    },

    // 获取-子订单的选片类型
    getCloudChooseType (itemId) {
      getCloudChooseType({ itemId }).then(res => {
        this.selectTypeVal = res.data.toString()
      }).catch(err => {
        console.log(`子订单的选片类型:`, err)
      })
    },

    // 更新-子订单的选片类型
    updateCloudChooseType (itemId) {
      let cloudChooseType = ['ORIGINAL', 'REPAIR', 'TONING', 'REFINE', 'DESIGN', 'VIDEO']
      let parms = {
        cloudChooseType: cloudChooseType[this.selectTypeVal],
        itemId
      }
      updateCloudChooseType(parms).then(res => {
        if (res.code === 200) console.log('更新类型成功')
      }).catch(err => {
        console.log(`更新子订单的选片类型:`, err)
      })
    },

    // 查找-子订单相片服务器
    getPhotoServer (itemId) {
      getPhotoServer({ itemId }).then(res => {
        this.photoServerJson = res.data
      }).catch(err => {
        console.log(`子订单相片服务器:`, err)
      })
    },

    // 获取指定指订的相片集合
    getAllPic () {
      let newData = new Date().getTime()
      let nonce = Math.floor(Math.random(1) * 10000)
      let sha1s = sha1(`lyfz.net${newData}${nonce}`)
      let headers = {
        signature: sha1s,
        timestamp: newData,
        nonce: nonce,
        app_key: this.picServerList[this.serverVal].serverKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      let params = {
        OrderNumber: this.photoServerJson.orderNo,
        SubOrderNumber: this.photoServerJson.itemNo,
        ImportType: this.selectTypeVal,
        recursive: "1",
        searchPattern: "JPG"
      }
      let json = {
        url: this.checkHttpUrl,
        params,
        headers
      }
      return new Promise((resolve, reject) => {
        getAllPic(json).then((res) => {
          resolve(res.data)
        }).catch(() => {
          resolve([])
        })
      })
    },

    // 是否使用缓存方法
    onCacheFileShow (val) {
      this.mut_setCacheFileCheck(val)
    },

    // 确认选片
    async onClickList (type) {
      // 模式选择
      this.mut_moduleFlge(type)

      // 获取指定指订的相片集合
      let arrImg = await this.getAllPic()
      // 判断没有图片提供选择
      if (arrImg.length !== 0) {
        this.onClickChangeErr()
        return
      }

      if (type === 1) this.updateCloudChooseType(this.get_parseUrl.itemId)
    },

    // 弹窗提供选择
    onClickChangeErr () {
      this.picServerModel = false
      let errNum = this.errNum
      let typeImg = { 0: '原片', 1: '修片', 3: '精修片', 4: '设计片' }
      let newTypeImg = '原片'
      let lodTypeImg = typeImg[this.selectTypeVal]
      let newType = 0
      let content = `此订单没有找到相片`
      if (this.selectTypeVal === '0') {
        newTypeImg = '初修片'
        newType = 1
      }

      if (errNum < 1) {
        content = `<div>没有找到${lodTypeImg}，系统将自动查找${newTypeImg}进行选片</div>`
      }
      this.$Modal.confirm({
        title: '利亚方舟智能选片系统提醒您！',
        content: content,
        onOk: () => {
          this.selectTypeVal = newType.toString()
          if (errNum < 1) {
            setTimeout(() => {
              this.onClickList(1)
              errNum++
              this.errNum = errNum
            }, 500)
          }
        },
        onCancel: () => {

        }
      })
    }
  },
  created () {
    this.parseUrlJson = parseUrl(window.location.href)

    // 存储到vuex中
    if (!this.get_parseUrl.itemId) {
      this.mut_setParseUrl(this.parseUrlJson)
    }

    // 获取相片服务器
    this.getPicConfigList()

    // 获取-子订单的选片类型
    this.getCloudChooseType(this.get_parseUrl.itemId)

    // 查找-子订单相片服务器
    this.getPhotoServer(this.get_parseUrl.itemId)

    // 判断是否是客户端
    this.CacheFileCheck = window.MainWindow
  }
}
</script>

<style lang="scss" scoped>

</style>
