<template>
  <div class="ps-container ps" @click="clickFun($event)">
    <div class="icon-top-btn lihe">
      <span class="icon-btn" title="重置 开始新的绘制" @click="resetDrawFun"><i class="iconfont icon-f14"></i></span>
      <span class="icon-btn" title="保存绘制完成的说明图片" @click="screenshots"><i class="iconfont icon-baocun_mian"></i></span>
      <span class="icon-btn xian"></span>
      <span class="icon-btn" title="新建文件" @click="popup1 = true"><i class="iconfont icon-xinchuangkou" style="font-size: 20px"></i></span>
      <span class="icon-btn" title="打开图片">
        <Upload action="" :before-upload="fileFun" accept="image/gif,image/jpeg,image/jpg,image/png"  :format="['jpg','jpeg','png']">
          <!-- <i class="iconfont icon-dakai" style="font-size: 15px;position: relative;top: -1px;color: #999"></i> -->
          <Icon type="md-albums" />
        </Upload>
      </span>
      <span class="icon-btn xian"></span>
      <Poptip  placement="bottom" :transfer="true">
        <div slot="title">
          画笔(大小，颜色)设置
        </div>
        <div slot="content" class="set-px">
          <span class="px" @click="pxNum = 2" :class="color === '#fff' && pxNum === 2 ? 'pxfff' : ''" :style="`${pxNum === 2 ? 'background:' +color +';' : ''}`"></span>
          <span class="px" @click="pxNum = 6" :class="color === '#fff' && pxNum === 6  ? 'pxfff' : ''" :style="`${pxNum === 6 ? 'background:' +color +';' : ''}`"></span>
          <span class="px" @click="pxNum = 10" :class="color === '#fff' && pxNum ===10 ? 'pxfff' : ''" :style="`${pxNum === 10 ? 'background:' +color +';' : ''}`"></span>
          <span class="color" :class="color === '#ed4014' ? 'color-active' : ''" @click="color = '#ed4014'" :style="``"></span>
          <span class="color" :class="color === '#ff9900' ? 'color-active' : ''" @click="color = '#ff9900'" :style="``"></span>
          <span class="color" :class="color === '#19be6b' ? 'color-active' : ''" @click="color = '#19be6b'" :style="``"></span>
          <span class="color" :class="color === '#2db7f5' ? 'color-active' : ''" @click="color = '#2db7f5'" :style="``"></span>
          <span class="color" :class="color === '#515a6e' ? 'color-active' : ''" @click="color = '#515a6e'" :style="``"></span>
          <span class="color" :class="color === '#fff' ? 'colorfff' : ''" @click="color = '#fff'" :style="``"></span>

          <!-- '#ed4014', '#ff9900', '#19be6b', '#2db7f5', '#515a6e', '#fff' -->
        </div>

        <span class="icon-btn" @click="drawClickFun(5)" title="画线"><i class="iconfont icon-pan_icon" style="font-size: 16px;"></i></span>
        <span class="icon-btn" title="箭头" @click="drawClickFun(2)"><i class="iconfont icon-arrow-up-copy"></i></span>
        <span class="icon-btn" @click="drawClickFun(1)" title="矩形"><i class="iconfont icon-juxing"></i></span>
        <span class="icon-btn" @click="drawClickFun(3)" title="圆形"><i class="iconfont icon-xuanze" style="font-size: 20px"></i></span>
        <span class="icon-btn" @click="drawClickFun(4)" title="文字"><i class="iconfont icon-A"></i></span>
      </Poptip>

      <span class="icon-btn xian"></span>
      <span class="icon-btn" v-show="isLoad" title="导入图片" style="position: relative;top: -1px;">
          <Upload action="" :before-upload="importImgFun" accept="image/gif,image/jpeg,image/jpg,image/png"  :format="['jpg','jpeg','png']">
           <i class="iconfont icon-method-draw-image" style="font-size: 16px;color: #999"></i>
          </Upload>
      </span>
      <span class="icon-btn" v-show="!isLoad"> <i class="iconfont icon-method-draw-image" style="font-size: 16px;color: #999"></i></span>

      <span class="icon-btn xian"></span>
      <span class="icon-btn" @click="narrowFun" title="缩小"><i class="iconfont icon-suoxiao"></i></span>
      <span class="icon-btn" @click="amplificationFun" title="放大"><i class="iconfont icon-fangda"></i></span>
      <span class="icon-btn xian"></span>
      <span class="icon-btn" title="可选择" @click="allElCanSel"><i class="iconfont icon-xuanze2" style="position: relative;top: -1px;font-size: 16px"></i></span>

      <span class="icon-btn xian"></span>
      <span class="icon-btn" title="裁剪" @click="linkTailoring"><i class="iconfont icon-jianqie"></i></span>

      <RadioGroup v-show="tailoring" v-model="radVal" size="small" style="position: relative;top: -3px;">
        <Radio label="1">矩形裁剪</Radio>
        <Radio label="2">圆形裁剪</Radio>
        <Radio label="3">圆角裁剪</Radio>
      </RadioGroup>
      <InputNumber  v-show="radVal === '3' && tailoring" :max="9999" :min="1" v-model="roundedNum" size="small" @on-change="roundedFun" style="width: 60px;position: relative;top: -2px;margin-right: 10px"></InputNumber>
<!--      <span style="position: relative;top:-2px;" v-show="tailoring">-->
<!--        透明度-->
<!--        <InputNumber :max="10" :min="1" size="small" style="width: 60px;" v-model="transparency" @on-change="setTransparencyFun"></InputNumber>-->
<!--      </span>-->
      <Select v-show="tailoring" :transfer="true" size="small" @on-change="sizeChange" v-model="sizeVal" style="width:150px;position: relative;top:-2px" placeholder="设置尺寸">
        <Option v-for="k in sizeList" :value="k.value" :key="k.value">{{ k.label }}</Option>
      </Select>
      <Button type="success" style="margin-left: 10px;position: relative;top:-2px" size="small" ghost v-show="tailoring"  @click="completeTailoringFun">完成裁剪</Button>
      <Button type="warning" style="margin-left: 10px;position: relative;top:-2px" size="small" ghost v-show="tailoring"  @click="cancelTailoringFun">取消</Button>
    </div>
    <div ref="canvas-content" style="position: absolute;left: 0;top: 40px;right: 0;bottom: 0;">
      <div class="canvas-box" ref="canvas-box" id="canvasbox" style="overflow: auto;">
        <!--  @mousemove.prevent="cansMoveFun($event)"
           @mousedown="cansDownFun($event)"
           @mouseup="cansUpFun($event)" -->
<!--        <div class="mask-box" ref="mask" v-show="tailoring"-->
<!--             @mousemove="mackMoveFun($event)"-->
<!--             @mousedown="maskDownFun($event)"-->
<!--             @mouseup="maskUpFun($event)"-->
<!--             @mouseout="maskOutFun($event)"-->
<!--             @mouseenter="maskEnterFun($event)">-->
<!--          <span class="x-xian"></span>-->
<!--          <span class="y-xian"></span>-->

<!--          <span class="l-xian" @mousedown="xianFun(1, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="t-xian" @mousedown="xianFun(2, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="r-xian" @mousedown="xianFun(3, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="b-xian" @mousedown="xianFun(4, $event)" @mouseup="isDrag = false"></span>-->

<!--          <span class="t-cell" @mousedown="xianFun(5, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="t-m-cell" @mousedown="xianFun(2, $event)" @mouseup="isDrag = false"></span>-->

<!--          <span class="r-cell" @mousedown="xianFun(6, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="r-m-cell" @mousedown="xianFun(3, $event)" @mouseup="isDrag = false"></span>-->

<!--          <span class="b-cell" @mousedown="xianFun(7, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="b-m-cell" @mousedown="xianFun(4, $event)" @mouseup="isDrag = false"></span>-->

<!--          <span class="l-cell" @mousedown="xianFun(8, $event)" @mouseup="isDrag = false"></span>-->
<!--          <span class="l-m-cell" @mousedown="xianFun(1, $event)" @mouseup="isDrag = false"></span>-->

<!--          <div class="radius-box" ref="radius-box" style="overflow:hidden;">-->
<!--            <div style="height: 100%;width: 100%;border-radius: 50px;box-sizing: border-box;box-shadow: 0px 0px 0px 20px rgba(0,0,0,.5);">-->
<!--              <img src="../../assets/MP4.png" ></img>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

        <vue-fabric v-if="isLoad"
                    @mouse:down="selCansFun"
                    ref="canvas"
                    id="canvas1"
                    :width="canvasW"
                    :height="canvasH"
                    @selection:created="selCansEl"
                    @object:added="addEl"
                    style="position: absolute;">
        </vue-fabric>
      </div>
    </div>

    <!-- 新建画布弹窗 -->
    <Modal v-model="popup1" class="ps" title="新建文件" width="300px" @on-ok="createCanvasBox">
      <div style="padding: 5px">
        <Form class="my-form"  label-position="right" :label-width="60">
          <FormItem label="画布宽">
            <InputNumber :max="9999" :min="1" v-model="createW" style="width: 125px"></InputNumber>
          </FormItem>
          <FormItem label="画布高">
            <InputNumber :max="9999" :min="1" v-model="createH" style="width: 125px"></InputNumber>
          </FormItem>
          <FormItem label="背景色">
            <ColorPicker v-model="cansColor"/>
          </FormItem>
        </Form>
      </div>
    </Modal>
    <!-- end新建画布弹窗 -->

    <!-- 右键弹窗 -->
    <div v-show="popup2" class="ps-right-el" ref="rightEl">
<!--      <div class="right-list-box">-->
<!--        <div></div>-->
<!--        <div>粘贴</div>-->
<!--      </div>-->
      <div class="right-list-box">
        <div></div>
        <div class="border">设置画布属性</div>
      </div>
      <div class="right-list-box">
        <div> <Checkbox style="margin: 0"></Checkbox></div>
        <div>显示文件工具栏</div>
      </div>
      <div class="right-list-box">
        <div><Checkbox style="margin: 0"></Checkbox></div>
        <div class="border">显示绘图工具栏</div>
      </div>
      <div class="right-list-box">
        <div></div>
        <div>设置裁剪比例</div>
      </div>
      <div class="right-list-box">
        <div></div>
        <div>裁剪框</div>
      </div>
    </div>
    <!-- end右键弹窗 -->
  </div>
</template>

<script>
import { fabric } from 'fabric'
import html2canvas from 'html2canvas'
export default {
  data () {
    return {
      popup1: false,
      popup2: false,
      color: '#ed4014',
      cansColor: '#fff',
      canvasH: 200,
      canvasW: 200,
      createW: 0,
      createH: 0,
      canvas: null,
      isLoad: false,
      selCans: null,
      pxNum: 6,
      scale: 1,
      x: 0,
      y: 0,
      tox: 0,
      toy: 0,
      isDraw: false,
      isStart: false,
      drawType: 0,
      square: null,
      textbox: null,
      moveCount: 0,
      tailoring: false,
      radVal: '0',
      roundedNum: 20,
      transparency: 2,
      mask: {
        h: 400,
        w: 400,
        moveX: 0,
        moveY: 0,
        left: 0,
        top: 0,
        xianY: 0,
        xianX: 0
      },
      c_mask: null,
      c_circle: null,
      c_img: null,
      isDown: false,
      isDrag: false,
      dragType: 0,
      maskEl: null,
      myCropper: null,
      sizeVal: 0,
      minSize: 0,
      sizeList: [
        { value: 0, label: '请选择尺寸设置' },
        { value: 1, label: '1600x900' },
        { value: 2, label: '1x1方形' },
        { value: 3, label: '200x500相框' },
        { value: 4, label: '2x1长方形' },
        { value: 5, label: '800x300相框' }
      ]
    }
  },
  methods: {
    // 裁剪框尺寸比例change
    sizeChange () {
      if (this.c_mask) {
        this.$refs.canvas.removeCurrentObj(this.c_mask)
      }
      if (this.c_circle) {
        this.$refs.canvas.removeCurrentObj(this.c_circle)
      }
      let W = 0
      let H = 0
      let T = 0
      let L = 0
      let X = 0
      let Y = 0
      if (this.sizeVal === 0) {
        console.log(this.sizeVal)
      }
      if (this.sizeVal === 1) {
        L = 0
        H = this.createH / 3
        W = this.createW
        T = (this.createH - H) / 2
        if (this.radVal === '2') {
          X = this.createW / 2
          Y = this.createH / 2
        }
        if (this.radVal === '3') {
          Y = X = this.roundedNum
        }
      }
      if (this.sizeVal === 2) {
        H = this.minSize
        W = this.minSize
        L = this.createW > this.minSize ? ((this.createW - this.minSize) / 2) : 0
        T = this.createH > this.minSize ? ((this.createH - this.minSize) / 2) : 0
        if (this.radVal === '2') {
          X = this.minSize / 2
          Y = this.minSize / 2
        }
        if (this.radVal === '3') {
          Y = X = this.roundedNum
        }
      }
      if (this.sizeVal === 3) {
        H = this.createH
        W = this.createW / 2
        T = 0
        L = (this.createW - W) / 2
        if (this.radVal === '2') {
          X = this.createW / 2
          Y = this.createH / 2
        }
        if (this.radVal === '3') {
          Y = X = this.roundedNum
        }
      }
      if (this.sizeVal === 4) {
        L = 0
        H = this.createH / 2
        W = this.createW
        T = (this.createH - H) / 2
        if (this.radVal === '2') {
          X = this.createW / 2
          Y = this.createH / 2
        }
        if (this.radVal === '3') {
          Y = X = this.roundedNum
        }
      }
      if (this.sizeVal === 5) {
        L = 0
        H = this.createH / 5
        W = this.createW
        T = (this.createH - H) / 2
        if (this.radVal === '2') {
          X = this.createW / 2
          Y = this.createH / 2
        }
        if (this.radVal === '3') {
          Y = X = this.roundedNum
        }
      }
      this.c_mask = new fabric.Rect({
        left: L,
        top: T,
        width: W,
        height: H,
        stroke: 'red',
        strokeWidth: 1,
        selectable: true,
        fill: 'rgba(255, 255, 255, 0)',
        id: 'c_mack',
        strokeDashArray: [5, 5],
        preserveObjectStacking: true,
        rx: X, // 圆角半径
        ry: Y // 圆角半径
      })
      this.setObjControls(this.c_mask)
      this.$refs.canvas.canvas.add(this.c_mask)
      this.$refs.canvas.canvas.setActiveObject(this.c_mask)
    },
    selCansEl (e) {},
    addEl (e) {
      if (e.target.id === 'img') {
        this.c_img = e.target
        this.c_img.selectable = false
        this.c_img.hasControls = false
      }
    },
    // 图片宽高比计算
    gcd (a, b) {
      if (a % b) { return this.gcd(b, a % b) } else { return b }
    },
    roundedFun () {
      console.log(this.c_mask)
      this.c_mask.set({ rx: this.roundedNum, ry: this.roundedNum })
      this.$refs.canvas.canvas.renderAll()
    },
    xianFun (t, e) {
      this.dragType = t
      this.isDrag = true
      this.isDown = false
      this.maskEl = this.$refs.mask
      let left = this.maskEl.style.left
      let top = this.maskEl.style.top
      this.mask.xianX = e.clientX
      this.mask.xianY = e.clientY
      this.mask.left = left
      this.mask.top = top
      this.mask.h = parseFloat(this.maskEl.style.height)
      this.mask.w = parseFloat(this.maskEl.style.width)
    },
    cansUpFun (e) {
      this.isDrag = false
      this.dragType = 0
    },
    cansDownFun (e) {
      this.isDrag = true
      this.maskEl = this.$refs.mask
      let left = this.maskEl.style.left
      let top = this.maskEl.style.top
      this.mask.left = left
      this.mask.top = top
    },
    cansMoveFun (e) {
      // this.isDown = false;
      if (this.isDrag) {
        let mask = this.maskEl

        let x = e.clientX
        let y = e.clientY
        if ((x + y) % 2) {
          return
        }
        let left = this.mask.left
        let top = this.mask.top
        if (this.dragType === 1) {
          // 向左拉伸
          let move_x = this.mask.xianX - x
          mask.style.height = `${this.mask.h + move_x}px`
          mask.style.width = `${this.mask.w + move_x}px`
          mask.style.left = `${parseFloat(left) - move_x}px`
          mask.style.top = `${parseFloat(top) - move_x / 2}px`
        }
        if (this.dragType === 2) {
          // 向上拉伸
          let move_y = this.mask.xianY - y
          mask.style.height = `${this.mask.h + move_y}px`
          mask.style.width = `${this.mask.w + move_y}px`
          mask.style.left = `${parseFloat(left) - move_y / 2}px`
          mask.style.top = `${parseFloat(top) - move_y}px`
        }
        if (this.dragType === 3) {
          // 向右拉伸
          let move_x = x - this.mask.xianX
          mask.style.height = `${this.mask.h + move_x}px`
          mask.style.width = `${this.mask.w + move_x}px`
          mask.style.left = `${parseFloat(left)}px`
          mask.style.top = `${parseFloat(top) - move_x / 2}px`
        }
        if (this.dragType === 4) {
          // 向下拉伸
          let move_y = y - this.mask.xianY
          mask.style.height = `${this.mask.h + move_y}px`
          mask.style.width = `${this.mask.w + move_y}px`
          mask.style.left = `${parseFloat(left) - move_y / 2}px`
          mask.style.top = `${parseFloat(top)}px`
        }
        if (this.dragType === 5) {
          // 向左上拉伸
          let move_x = this.mask.xianX - x
          mask.style.height = `${this.mask.h + move_x}px`
          mask.style.width = `${this.mask.w + move_x}px`
          mask.style.left = `${parseFloat(left) - move_x}px`
          mask.style.top = `${parseFloat(top) - move_x}px`
        }
        if (this.dragType === 6) {
          // 向右上拉伸
          let move_x = x - this.mask.xianX
          mask.style.height = `${this.mask.h + move_x}px`
          mask.style.width = `${this.mask.w + move_x}px`
          mask.style.left = `${parseFloat(left)}px`
          mask.style.top = `${parseFloat(top) - move_x}px`
        }
        if (this.dragType === 7) {
          // 向右下拉伸
          let move_y = y - this.mask.xianY
          mask.style.height = `${this.mask.h + move_y}px`
          mask.style.width = `${this.mask.w + move_y}px`
          mask.style.left = `${parseFloat(left)}px`
          mask.style.top = `${parseFloat(top)}px`
        }
        if (this.dragType === 8) {
          // 向左下拉伸
          let move_y = y - this.mask.xianY
          mask.style.height = `${this.mask.h + move_y}px`
          mask.style.width = `${this.mask.w + move_y}px`
          mask.style.left = `${parseFloat(left) - move_y}px`
          mask.style.top = `${parseFloat(top)}px`
        }
      }
    },
    maskEnterFun (e) {
      this.isDown = false
      this.mask.moveX = 0
      this.mask.moveY = 0
    },
    maskOutFun (e) {
      this.isDown = false
      this.mask.moveX = 0
      this.mask.moveY = 0
    },
    maskUpFun (e) {
      this.isDrag = false
      this.isDown = false
      this.mask.moveX = 0
      this.mask.moveY = 0
    },
    maskDownFun (e) {
      this.isDown = true
      this.maskEl = this.$refs.mask
      let left = this.maskEl.style.left
      let top = this.maskEl.style.top
      this.mask.moveX = e.clientX
      this.mask.moveY = e.clientY
      this.mask.left = left
      this.mask.top = top
    },
    // 移动裁剪框
    mackMoveFun (e) {
      // 移动位置， （计算移动方向，设置裁剪框位置）
      if (this.isDown) {
        let mask = this.maskEl
        let x = e.clientX
        let y = e.clientY
        if ((x + y) % 2) {
          return
        }

        console.log(e)
        mask.style.left = parseFloat(this.mask.left) + (x - this.mask.moveX) + 'px'
        mask.style.top = parseFloat(this.mask.top) + (y - this.mask.moveY) + 'px'
      }
    },
    // 显示裁剪功能
    linkTailoring () {
      this.tailoring = true
      this.tailorType()
    },
    // 取消裁剪功能 隐藏按钮 清除画布上的裁剪框
    cancelTailoringFun () {
      if (this.c_mask) {
        this.$refs.canvas.removeCurrentObj(this.c_mask)
      }
      if (this.c_circle) {
        this.$refs.canvas.removeCurrentObj(this.c_circle)
      }
      this.tailoring = false
    },
    // 初始化遮罩层裁剪框位置，大小
    initMaskTailoringFun () {
      let mask = this.$refs.mask
      let div = this.$refs['canvas-box']
      let divH = div.clientHeight
      let divW = div.clientWidth
      // 计算裁剪框尺寸  裁剪框上下边框尺寸 =画布高 - 裁剪框高 / 2  | 裁剪框左右边框尺寸 = 画布宽 - 裁剪框宽 / 2
      let tw = (divH - this.mask.h) / 2
      let bw = (divH - this.mask.h) / 2
      let lw = (divW - this.mask.w) / 2
      let rw = (divW - this.mask.w) / 2
      mask.style.borderTopWidth = `${tw}px`
      mask.style.borderBottomWidth = `${bw}px`
      mask.style.borderLeftWidth = `${lw}px`
      mask.style.borderRightWidth = `${rw}px`
    },
    // 设置遮罩层裁剪框 大小 上下左右距离
    setMaskTailoringFun () {
      let mask = this.$refs.mask
      let div = this.$refs['canvas-box']
    },
    // html截图
    screenshots () {
      return new Promise((resolve, reject) => {
        let el = this.$refs['canvas-box']
        html2canvas(el, {
          logging: true, // 启用日志记录以进行调试 (发现加上对去白边有帮助)
          allowTaint: true, // 否允许跨源图像污染画布
          backgroundColor: null, // 解决生成的图片有白边
          useCORS: true // 如果截图的内容里有图片,解决文件跨域问题
        }).then((canvas) => {
          let base64 = canvas.toDataURL('image/png')
          resolve(base64)
        })
      })
    },
    // http图片转成base64，防止解决不了的图片跨域问题
    getBase64Image (url) {
      return new Promise((resolve) => {
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        var img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = function () {
          canvas.height = img.height
          canvas.width = img.width
          ctx.drawImage(img, 0, 0)
          var dataURL = canvas.toDataURL('image/png')
          resolve(dataURL)
          canvas = null
        }
        img.src = url
      })
    },
    // 绘制点击
    drawClickFun (t) {
      if (this.$refs.canvas) {
        this.$refs.canvas.canvas.isDrawingMode = false
      }
      if (this.textbox) {
        this.textbox.exitEditing()
        this.textbox = null
      }
      if (t === 5) {
        this.isDraw = false
        this.drawType = 5
      }
      if (t === 1) {
        this.drawType = 1
      }
      if (t === 2) {
        this.drawType = 2
      }
      if (t === 3) {
        this.drawType = 3
      }
      if (t === 4) {
        this.drawType = 4
      }
    },
    // 文字
    textFun () {
      this.textbox = new fabric.Textbox("", {
        left: this.x,
        top: this.y,
        width: 150,
        fontSize: (this.pxNum + 8) * 2,
        borderColor: this.color,
        fill: this.color,
        hasControls: false
      })
      this.$refs.canvas.canvas.add(this.textbox)
      this.textbox.enterEditing()
      this.textbox.hiddenTextarea.focus()
    },
    // 绘制正圆
    drawIsRoundFun () {
      if (this.isLoad) {
        let radius = Math.sqrt((this.tox - this.x) * (this.tox - this.x) + (this.toy - this.y) * (this.toy - this.y)) / 2.4
        if (this.square) {
          this.$refs.canvas.canvas.remove(this.square)
        }
        this.square = new fabric.Circle({
          left: this.x,
          top: this.y,
          stroke: this.color,
          fill: "rgba(255, 255, 255, 0)",
          radius: radius,
          strokeWidth: this.pxNum
        })
        this.$refs.canvas.canvas.add(this.square)
        this.$refs.canvas.toLastLayer(this.square)
      }
    },
    // 绘制箭头
    drawArrowLineFun () {
      if (this.isLoad) {
        if (this.square) {
          this.$refs.canvas.canvas.remove(this.square)
        }
        this.square = new fabric.Path(this.drawArrow(this.x, this.y, this.tox, this.toy, 30, 30), {
          stroke: this.color,
          fill: "rgba(255,255,255,0)",
          strokeWidth: this.pxNum
        })
        this.$refs.canvas.canvas.add(this.square)
        this.$refs.canvas.toLastLayer(this.square)
      }
    },
    drawArrow (fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta !== "undefined" ? theta : 30
      headlen = typeof theta !== "undefined" ? headlen : 10
      // 计算各角度和对应的P2,P3坐标
      let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
      let angle1 = (angle + theta) * Math.PI / 180
      let angle2 = (angle - theta) * Math.PI / 180
      let topX = headlen * Math.cos(angle1)
      let topY = headlen * Math.sin(angle1)
      let botX = headlen * Math.cos(angle2)
      let botY = headlen * Math.sin(angle2)
      let arrowX = fromX - topX
      let arrowY = fromY - topY
      let path = " M " + fromX + " " + fromY
      path += " L " + toX + " " + toY
      arrowX = toX + topX
      arrowY = toY + topY
      path += " M " + arrowX + " " + arrowY
      path += " L " + toX + " " + toY
      arrowX = toX + botX
      arrowY = toY + botY
      path += " L " + arrowX + " " + arrowY
      return path
    },
    // 坐标转换
    transformMouse (mouseX, mouseY) {
      return { x: mouseX / window.zoom, y: mouseY / window.zoom }
    },
    // 所有元素禁止点击
    allElNotSel () {
      this.$refs.canvas.canvas.skipTargetFind = true
      this.$refs.canvas.canvas.selection = false
      this.$refs.canvas.canvas.hasRotatingPoint = false
    },
    // 所有元素点击
    allElCanSel () {
      this.$refs.canvas.canvas.skipTargetFind = false
      this.$refs.canvas.canvas.selection = true
      this.$refs.canvas.canvas.hasRotatingPoint = true
      this.$refs.canvas.canvas.isDrawingMode = false
      this.$refs.canvas.canvas.defaultCursor = 'default'
      this.drawType = 0
    },
    downFun (e) {
      if (this.drawType === 1) {
        this.allElNotSel()
        this.startRectangular(e)
      }
      if (this.drawType === 2 || this.drawType === 3) {
        this.allElNotSel()
        let yx = this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.x = yx.x
        this.y = yx.y
        this.isDraw = true
      }
      if (this.drawType === 4) {
        this.allElNotSel()
        let yx = this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.x = yx.x
        this.y = yx.y
        this.textFun()
      }
      if (this.drawType === 5) {
        this.createLine()
      }
    },
    upFun (e) {
      if (this.drawType === 1) {
        this.endRectangular(e)
      }
      if (this.drawType === 2 || this.drawType === 3) {
        this.square = null
        this.isDraw = false
        this.$refs.canvas.canvas.discardActiveObject()
      }
      if (this.drawType === 1 || this.drawType === 2 || this.drawType === 3 || this.drawType === 4) {
        this.$refs.canvas.canvas.isDrawingMode = false
      }
    },
    moveFun (e) {
      if (this.moveCount % 2 && !this.isDraw) {
        return
      }
      if (this.drawType === 1) {
        this.dragRectangular(e)
      }
      if (this.drawType === 2) {
        let yx = this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.tox = yx.x
        this.toy = yx.y
        if (this.isDraw) {
          this.drawArrowLineFun()
        }
      }
      if (this.drawType === 3) {
        let yx = this.transformMouse(e.e.offsetX, e.e.offsetY)
        this.tox = yx.x
        this.toy = yx.y
        if (this.isDraw) {
          this.drawIsRoundFun()
        }
      }
      this.moveCount++
    },
    // 开始绘制矩形
    startRectangular (e) {
      let mouse = this.$refs.canvas.canvas.getPointer(e.e)
      this.x = mouse.x
      this.y = mouse.y
      this.isDraw = true
      let square = new fabric.Rect({
        width: 0,
        height: 0,
        left: this.x,
        top: this.y,
        hasBorders: false,
        hasControls: false,
        strokeWidth: this.pxNum,
        fill: 'rgba(0,0,0,0)',
        stroke: this.color
      })
      this.$refs.canvas.canvas.add(square)
      this.$refs.canvas.canvas.renderAll()
      this.$refs.canvas.canvas.setActiveObject(square)
    },
    // 绘制矩形 - 拖动
    dragRectangular (e) {
      if (this.isDraw) {
        let mouse = this.$refs.canvas.canvas.getPointer(e.e)
        let w = Math.abs(mouse.x - this.x)
        let h = Math.abs(mouse.y - this.y)
        if (!w || !h) {
          return false
        }
        let square = this.$refs.canvas.canvas.getActiveObject()
        square.set('width', w).set('height', h)
        this.$refs.canvas.canvas.renderAll()
      }
    },
    // 结束绘制矩形
    endRectangular (e) {
      if (this.isDraw) {
        this.isDraw = false
      }
      let square = this.$refs.canvas.canvas.getActiveObject()
      this.$refs.canvas.canvas.add(square)
      this.$refs.canvas.canvas.renderAll()
      this.x = 0
      this.y = 0
    },
    // 缩小
    narrowFun () {
      if (this.scale < 0.2) return
      this.scale = this.scale - 0.1
      this.$refs.canvas.canvas.setZoom(this.scale)
    },
    // 放大
    amplificationFun () {
      if (this.scale > 2.5) return
      this.scale = this.scale + 0.1
      this.$refs.canvas.canvas.setZoom(this.scale)
    },
    // 导入本地图片
    async fileFun (imgObj, t) {
      let base64_url = ''
      if (t === 1) {
        // 显示原图
        base64_url = `${imgObj.url}&size=p`
      } else {
        base64_url = `${imgObj.url}&size=p&photoType=1`
      }
      console.log(base64_url)
      let base64 = await this.getBase64Image(base64_url)
      let file = await this.base64ToFile(base64, imgObj.name)
      let url = window.URL.createObjectURL(file)
      // let file_url = `${url}&size=p&photoType=1`;
      // console.log(file_url);
      const img = new Image()
      let div = this.$refs['canvas-content']
      let divH = div.clientHeight
      let divW = div.clientWidth
      this.isLoad = false
      img.src = url
      img.onload = () => {
        let wh = this.scalingImage(img.width, img.height, divW, divH)
        console.log(wh)
        this.createH = wh.height
        this.createW = wh.width
        this.minSize = Math.min(wh.height, wh.width)
        let c_box = this.$refs['canvas-box']
        c_box.style.height = `${wh.height}px`
        c_box.style.width = `${wh.width}px`
        this.createCanvasBox().then(() => {
          this.$refs.canvas.createImage(url, { id: 'img', width: wh.width, height: wh.height })
          this.$refs.canvas.setBackgroundColor('#E6E6FA')
        })
      }
      return false
    },
    // z转file
    base64ToFile (base64, filename) {
      return new Promise((resolve) => {
        let arr = base64.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        resolve(new File([u8arr], filename, { type: mime }))
      })
    },
    // 等比缩放图片宽高
    scalingImage (imgWidth, imgHeight, containerWidth, containerHeight) {
      var containerRatio = containerWidth / containerHeight
      var imgRatio = imgWidth / imgHeight

      if (imgRatio > containerRatio) {
        imgWidth = containerWidth
        imgHeight = containerWidth / imgRatio
      } else if (imgRatio < containerRatio) {
        imgHeight = containerHeight
        imgWidth = containerHeight * imgRatio
      } else {
        imgWidth = containerWidth
        imgHeight = containerHeight
      }

      return { width: imgWidth, height: imgHeight }
    },
    // 完成裁剪
    completeTailoringFun () {
      if (this.c_mask) {
        this.c_mask.selectable = false
        this.c_mask.hasControls = false
        this.$refs.canvas.discardActive(this.c_mask)
      }
      if (this.c_circle) {
        this.c_circle.selectable = false
        this.c_circle.hasControls = false
        this.$refs.canvas.discardActive(this.c_circle)
      }
      this.$refs.canvas.canvas.renderAll()
      this.tailoring = false
    },
    // 已有画布导入图片
    importImgFun (file) {
      if (this.isLoad) {
        let url = window.URL.createObjectURL(file)
        const img = new Image()
        img.src = url
        img.onload = () => {
          console.log(img.width)
          this.$refs.canvas.createImage(url, { width: img.width, height: img.height })
        }
      }
      return false
    },
    // 重置 重新绘制
    resetDrawFun () {
      if (this.$refs.canvas) {
        this.$refs.canvas.clear()
        this.isLoad = false
      }
      this.sizeVal = 0
      this.radVal = '0'
    },
    selCansFun (e) {
      if (e.target) {
        this.selCans = e.target
        this.selCans.hasControls = true
        this.selCans.hasBorders = true
      }
    },
    // 画笔 自由绘制线
    createLine () {
      if (this.$refs.canvas) {
        this.allElNotSel()
        this.$refs.canvas.canvas.freeDrawingBrush.color = this.color
        this.$refs.canvas.canvas.isDrawingMode = true
        this.$refs.canvas.canvas.freeDrawingBrush.width = this.pxNum
      }
    },
    // 橡皮擦
    eraserFun () {
      if (this.$refs.canvas) {
        this.$refs.canvas.canvas.freeDrawingBrush.color = '#fff'
        this.$refs.canvas.canvas.isDrawingMode = true
        this.$refs.canvas.canvas.freeDrawingBrush.width = this.pxNum
      }
    },
    // 创建主画布容器
    createCanvasBox () {
      this.resetDrawFun()
      return new Promise((resolve, reject) => {
        this.canvasH = this.createH
        this.canvasW = this.createW
        this.isLoad = true
        let div = this.$refs['canvas-box']
        let divH = div.clientHeight
        let divW = div.clientWidth
        let l = divW / 2 - this.createW / 2
        let t = divH / 2 - this.createH / 2
        this.$nextTick(() => {
          let cansEl = document.getElementById('canvas1')
          cansEl.style.top = t + 'px'
          cansEl.style.left = l + 'px'
          cansEl.style.height = this.createH + 'px'
          cansEl.style.width = this.createW + 'px'
          this.$refs.canvas.canvas.setBackgroundColor(this.cansColor)
          this.buindRightEv()
          this.$refs.canvas.canvas.on('mouse:down', (e) => {
            this.downFun(e)
          })
          this.$refs.canvas.canvas.on('mouse:up', (e) => {
            this.upFun(e)
          })
          this.$refs.canvas.canvas.on('mouse:move', (e) => {
            this.moveFun(e)
          })
          resolve()
        })
      })
    },
    // 绑定右键事件
    buindRightEv () {
      this.$nextTick(() => {
        // this.$refs['canvas'].setBackgroundColor('#E6E6FA');
        let el = document.getElementsByClassName('upper-canvas ')[0]
        el.addEventListener('contextmenu', (e) => {
          e.preventDefault()
          this.rightPopupFun(e)
        }, true)
      })
    },
    // 右键弹窗
    rightPopupFun (e) {
      this.$nextTick(() => {
        let div = this.$refs.rightEl
        let DH = div.clientHeight
        let DW = div.clientWidth
        let BH = document.body.clientHeight
        let BW = document.body.clientWidth
        let l = e.clientX
        let t = e.clientY - 80;
        (DW <= 0) && (DW = 180);
        (DH <= 0) && (DH = 100);
        (e.clientX + DW > BW - 50) && (l = e.clientX - DW);
        (e.clientY + DH > BH - 50) && (t = e.clientY - DH - 100)
        div.style.left = `${l}px`
        div.style.top = `${t}px`
      })
      this.popup2 = true
    },
    clickFun (e) {
      if (!this.getParentTag(e.target, 'ps-right-el')) {
        this.popup2 = false
      }
    },
    // 遍历所有父节点
    getParentTag (startTag, classname, parentTagList = []) {
      // console.log(startTag.className);
      if (startTag && startTag.nodeName === 'BODY') {
        return false
      } else if (startTag && startTag.className === classname) {
        return true
      } else if (startTag && startTag.parentElement) {
        return this.getParentTag(startTag.parentElement, classname, parentTagList)
      }
    },
    // 键盘事件
    keyboardFun (e) {
      if (!this.$refs.canvas) return
      if (e.code === 'Delete') {
        if (this.selCans) {
          this.$refs.canvas.canvas.remove(this.selCans)
        }
      } else if (e.ctrlKey == true && e.code == 'KeyZ') {
        let els = this.$refs.canvas.getObjects()
        if (els.length >= 1) {
          this.$refs.canvas.canvas.remove(els[els.length - 1])
        }
      }
    },
    // 创建正方形矩形
    createSquareRect () {
      this.c_mask = new fabric.Rect({
        left: (this.createW - this.minSize) / 2,
        top: (this.createH - this.minSize) / 2,
        width: this.minSize,
        height: this.minSize,
        stroke: 'red',
        strokeWidth: 1,
        selectable: true,
        fill: 'rgba(255, 255, 255, 0)',
        id: 'c_mack',
        preserveObjectStacking: true,
        strokeDashArray: [5, 5]
      })
      this.setObjControls(this.c_mask)
      this.$refs.canvas.canvas.add(this.c_mask)
      this.$refs.canvas.canvas.setActiveObject(this.c_mask)
    },
    // 创建圆角正方形矩形
    createSquareRaduisRect () {
      this.c_mask = new fabric.Rect({
        left: (this.createW - this.minSize) / 2,
        top: (this.createH - this.minSize) / 2,
        width: this.minSize,
        height: this.minSize,
        stroke: 'red',
        strokeWidth: 1,
        selectable: true,
        fill: 'rgba(255, 255, 255, 0)',
        id: 'c_mack',
        strokeDashArray: [5, 5],
        preserveObjectStacking: true,
        rx: this.roundedNum, // 圆角半径
        ry: this.roundedNum // 圆角半径
      })
      this.setObjControls(this.c_mask)
      this.$refs.canvas.canvas.add(this.c_mask)
      this.$refs.canvas.canvas.setActiveObject(this.c_mask)
    },
    // 创建圆形
    createRaduis () {
      this.c_circle = new fabric.Circle({
        top: (this.createH - this.minSize) / 2, // 距离画布上边的距离
        left: (this.createW - this.minSize) / 2, // 距离画布左侧的距离，单位是像素
        radius: this.minSize / 2, // 圆形半径
        fill: 'rgba(255, 255, 255, 0)', // 填充的颜色
        stroke: 'red', // 边框颜色
        preserveObjectStacking: true,
        strokeWidth: 1, // 边框大小
        strokeDashArray: [5, 5]
      })
      this.setObjControls(this.c_circle)
      this.$refs.canvas.canvas.add(this.c_circle)
      this.$refs.canvas.canvas.setActiveObject(this.c_circle)
    },
    // 设置画布中对象的控制点样式
    setObjControls (el) {
      el.set({
        padding: 0,
        transparentCorners: false,
        borderColor: 'rgba(66,163,248, .5)', // 边框顏色
        cornerColor: 'rgba(66,163,248, .5)', // 控制点填满色
        cornerSize: 10, // 控制点大小
        cornerStrokeColor: 'rgba(66,163,248, .5)', // 控制点边框色
        cornerStyle: 'rect',
        strokeDashArray: [5, 5]
      })
    },
    // 设置透明度
    setTransparencyFun () {

    },
    // 裁剪类型
    tailorType () {
      if (this.c_mask) {
        this.$refs.canvas.removeCurrentObj(this.c_mask)
      }
      if (this.c_circle) {
        this.$refs.canvas.removeCurrentObj(this.c_circle)
      }

      if (this.sizeVal > 0) {
        this.sizeChange()
        return
      }
      switch (this.radVal) {
        case '1':
          this.createSquareRect()
          break
        case '2':
          this.createRaduis()
          break
        case '3':
          this.createSquareRaduisRect()
          break
      }
    }
  },
  watch: {
    radVal: function (v) {
      this.tailorType()
    }
  },
  destroyed () {

  },
  mounted () {
    let body = document.body
    body.removeEventListener('keydown', this.keyboardFun, false)
  },
  created () {
    window.zoom = window.zoom ? window.zoom : 1
    this.$nextTick(() => {
      let body = document.body
      body.addEventListener('keydown', this.keyboardFun, false)
      // this.initMaskTailoringFun();
    })
  }
}
</script>

<style scoped lang="scss">
.ps-container{
  position: relative;
  height: 100%;
  width: 100%;
}
.icon-top-btn{
  height: 30px;
  background: #fff;
  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0px 0px 5px 1px rgba(188,217,247,1);
  line-height: 30px;
  padding: 0 5px;
  position: relative;
  span.icon-btn{
    display: inline-block;
    margin-right: 10px;
    cursor: pointer;
    transition: all .3s;
    >i{
      font-size: 18px;
      vertical-align: bottom;
      color: #999;
    }
  }
  span.icon-btn:hover i{
    color: #2baee9;
  }
  span.icon-btn.xian{
    width: 2px;
    height: 13px;
    background: #eaeaea;
  }
}
.canvas-box{
  position: absolute;
  //top: 0px;
  //left: 0px;
  //right: 0px;
  //bottom: 0;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #E6E6FA;
}
.ps-right-el{
  position: absolute;
  z-index: 9999;
  width: 150px;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.1);
  background: #fff;

  .right-list-box{
    position: relative;
    height: 30px;
    cursor: pointer;
    transition: all .3s;
    >div:nth-child(1){
      width: 30px;
      height: 30px;
      background: #f2f2f2;
      transition: all .3s;
      text-align: center;
      line-height: 30px;
    }
    >div:nth-child(2){
      position: absolute;
      top: 0;
      left: 32px;
      right: 0;
      transition: all .3s;
      bottom: 0;
      line-height: 30px;
    }
    >div.border{
      border-bottom: 1px #eaeaea solid;
    }
  }
  .right-list-box:hover{
    background: #2baee9;
    >div:nth-child(1){
      background: #2baee9;
    }
    >div{
      border-color: #2baee9;
      color: #fff;
    }
  }
}
.lihe{
  line-height: 34px;
  .icon-btn{
    line-height: 14px;
  }
}

.set-px{
  display: flex;
  align-items: center;
  >span{
    margin-right: 5px;
    cursor: pointer;
  }
  >span.px{
    display: inline-block;
    border-radius: 50%;
    background: #999;
  }
  >span.color{
    display: inline-block;
    height: 14px;
    width: 14px;
    border: 4px rgba(0,0,0,0) solid;
  }
  >span.pxfff{
    border: 2px #eaeaea solid;
    background: #fff;
  }
  >span:nth-child(1){height: 6px;width: 6px;}
  >span:nth-child(2){height: 8px;width: 8px;}
  >span:nth-child(3){height: 10px;width: 10px;}
  >span:nth-child(4){background: #ed4014;border-color:#ed4014}
  >span:nth-child(5){background: #ff9900;border-color:#ff9900}
  >span:nth-child(6){background: #19be6b;border-color:#19be6b}
  >span:nth-child(7){background: #2db7f5;border-color:#2db7f5}
  >span:nth-child(8){background: #515a6e;border-color:#515a6e}
  >span:nth-child(9){background: #fff;border:1px #eaeaea solid;}
  >span.colorfff{
    background: #fff;border:4px #eaeaea solid;
  }
  >span.color-active{
    background: #fff;
  }
}

.mask-box{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
  box-sizing: border-box;
  border: 1px rgba(0,0,0,.5) solid;
  .radius-box{
    height: 100%;
    width: 100%;
    border-radius: 0px;
    cursor: all-scroll;
    position: absolute;
  }
  .x-xian{
    display: inline-block;
    height: 33.333%;
    width: 100%;
    border-top:1px #fff dashed;
    border-bottom:1px #fff dashed;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    cursor: all-scroll;
  }
  .y-xian{
    cursor: all-scroll;
    display: inline-block;
    width: 33.333%;
    height: 100%;
    border-left:1px #fff dashed;
    border-right:1px #fff dashed;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
  }
  .l-xian,.t-xian,.r-xian,.b-xian{
    position: absolute;
    display: inline-block;
    background: rgba(62,139,209,.8);
    width: 2px;
    height: 2px;
  }
  .l-xian{
    height: 100%;
    left: -2px;
  }
  .t-xian{
    top: -2px;
    width: 100%;
  }
  .r-xian{
    height: 100%;
    right: -2px;
  }
  .b-xian{
    width: 100%;
    bottom: -2px;
  }
  .t-xian:hover, .b-xian:hover{
    cursor: s-resize;
  }
  .l-xian:hover, .r-xian:hover{
    cursor: w-resize;
  }
  .t-cell, .t-m-cell,.r-cell,.r-m-cell,.b-cell,.b-m-cell,.l-cell,.l-m-cell{
    display: inline-block;
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgba(62,139,209,.8);
  }
  .t-cell{
    left: -3px;
    top: -3px;
    cursor: se-resize;
  }
  .t-m-cell{
    left: 50%;
    margin-left: -3px;
    top: -3px;
    cursor: s-resize;
  }
  .r-cell{
    top: -3px;
    right: -3px;
    cursor: ne-resize;
  }
  .r-m-cell{
    top: 50%;
    margin-top: -3px;
    right: -3px;
    cursor: w-resize;
  }
  .b-cell{
    bottom: -3px;
    right: -3px;
    cursor: se-resize;
  }
  .b-m-cell{
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize;
  }
  .l-cell{
    bottom: -3px;
    left: -3px;
    cursor: ne-resize;
  }
  .l-m-cell{
    top: 50%;
    margin-top: -3px;
    left: -3px;
    cursor: w-resize;
  }
}

.tailoring-box{}
.ps{
  /deep/.ivu-modal-wrap{
    z-index: 3000 !important;
}
      /deep/.ivu-modal-mask{
    z-index: 3000 !important;
}
}
</style>
