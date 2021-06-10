/**
 * Created by ludetao on 2018-08-25.
 */
/**
 * Created by ludetao on 2018/6/25.
 */
class com {
  constructor () {
    this.isNull = ['', null, 'null', undefined, 'undefined']
    this.date = null
    this.rg_phone = /^1[123456789]\d{9}$/// 手机号码
    this.rg_img = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/ // 图片
    this.rg_text = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/// 中文，数字，英文字母，包括下划线，但不包括别的特殊字符
    this.rg_nub_float = /^(\-|\+)?\d+(\.\d+)?$/// 正数、负数、和小数
    this.rg_int = /^[0-9]*$///  验证数字
    this.rg_email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/ // 验证邮箱
    this.rg_idCode = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/ //  验证身份证格式
    this.rg_letter = /^[A-Za-z]+$/
    this.rg_PhoneCode = /((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8})|((\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}))?/g // 匹配字符串所有的电话号码
    this.rg_Chinese = /[\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF]+/g // 匹配中文
  }

  /**
   * 判断图片
   * @param str 图片名称
   * @returns {boolean}
   * @constructor
   */
  RE_img (str) {
    if (this.rg_img.test(str)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 获取当前时间/返回相应的时间
   * @param null 参数为空时  返回当前的时间 字符串， 时分秒
   *
   *
   * 格式化日期
   * @param str 一个参数时，格式化时间，返回相对应的时间字符串，时分秒  例如：Thu Jul 05 2018 17:39:51 GMT+0800 (中国标准时间)
   *
   *
   * 计算前几天的日期并返回
   * 计算后几天的日期并返回
   * @param type  类型  previous 开始日期，提前多少天   tomorrow 结束日期
   * @param day 计算多少天数
   *
   *
   * 计算两个时间差
   * @param type interval
   * @param startTime 开始时间
   * @param endTime 结束时间  默认当前时间
   * @returns Object
   */
  getDate (...arr) {
    let obj = null
    if (arr.length === 0) {
      // 返回当前日期时间
      obj = this.getDateFun()
    } else if (arr.length === 1) {
      // 指定时间，并返回相对应的时间 字符串 2018-06-26
      obj = this.getDateFun(arr[0])
    } else if (arr.length === 2) {
      /*
       * 计算前几天的日期并返回
       * 计算后几天的日期并返回
       * type  类型  previous 开始日期，提前多少天   tomorrow 结束日期
       * day 计算多少天数
       * */
      let curDate = new Date()
      let type = arr[0]
      let daynub = arr[1]
      if (type === 'previous') {
        let preDate = new Date(curDate.getTime() - (24 * parseInt(daynub)) * 60 * 60 * 1000) // 过去n天
        let t = new Date(preDate).getTime()
        obj = this.getDateFun(t)
      } else if (type === 'tomorrow') {
        let nextDate = new Date(curDate.getTime() + (24 * parseInt(daynub)) * 60 * 60 * 1000) // 未来n天
        obj = this.getDateFun(nextDate.getTime())
      }
    } else if (arr.length === 3) {
      let type = arr[0]
      if (type === 'interval') {
        let s = new Date(arr[1]).getTime()
        let q = new Date(arr[2] || this.getDateFun().datetime).getTime()
        let usedTime = q - s
        // 计算出小时数
        let days = Math.floor(usedTime / (24 * 3600 * 1000))
        // 计算天数后剩余的毫秒数
        let leave1 = usedTime % (24 * 3600 * 1000)
        let hours = Math.floor(leave1 / (3600 * 1000))
        // 计算小时数后剩余的毫秒数
        let leave2 = leave1 % (3600 * 1000)
        let minutes = Math.floor(leave2 / (60 * 1000))
        let leave3 = leave2 % (60 * 1000)
        let seconds = Math.floor(leave3 / 1000)
        Object.assign(obj = {}, {
          day: days,
          h: hours,
          f: minutes,
          s: seconds,
          dateStr: `${days}天${hours}时${minutes}分${seconds}秒`
        })
      }
    }
    return obj
  }

  /**
   * 去除字符串空格
   */
  wipeBlank (str) {
    return str.replace(/\s+/g, "")
  }

  /**
   * 获取两个日时间间隔天数
   * @param sDate1 开始时间，
   * @param sDate2 结束时间，
   */
  getIntervalDay (sDate1, sDate2) {
    var dateSpan,
      iDays
    sDate1 = Date.parse(sDate1)
    sDate2 = Date.parse(sDate2)
    dateSpan = sDate2 - sDate1
    dateSpan = Math.abs(dateSpan)
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000))
    return iDays
  }

  /**
   * 获取闰月 天数
   * @param y 男
   * @param m 月
   */
  getLeapMonth (y, m) {
    this.date = new Date(y, m, '0')
    return {
      dayCount: this.date.getDate()
    }
  }

  isDate (value) {
    if (value === "") {
      return
    }
    var reg = /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/
    var regExp = new RegExp(reg)
    if (!regExp.test(value)) {
      return false
    } else {
      return true
    }
  }

  /**
   * 一个时间段， 在加天数  返回计算相加后的时间
   * @param dateStr 时间
   * @param day 小时数
   */
  getCombinedToCalculateDate (dateStr, hour) {
    // let date = this.getDateFun(date);
    let date = this.getDateFun(dateStr)
    let time = date.time + (3600 * parseInt(hour))
    return this.getDateFun(time * 1000)
  }

  formatDate (time) {
    var date = new Date(parseInt(time))
    var year = date.getFullYear()
    var mon = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + date.getMonth() + 1
    var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
    return year + '-' + mon + '-' + day
  }

  /**
   *
   * @param {*} strDate 时间字符串转number
   */
  changeTime (time) {
    var reg = new RegExp(" ", "g")
    var a = time.replace(reg, "")
    return a
  }

  /**
   * @param d
   * @return {*}
   */
  // 获取计算 的日期
  getDateFun (d) {
    let obj = null
    if (d) {
      let time = d
      if (!this.verification(time, 'Number')) {
        time = time.replace(/\-/g, "/")
      }
      this.date = new Date(time)
    } else {
      this.date = new Date()
    }
    let year = this.date.getFullYear().toString()
    let month = (this.date.getMonth() + 1).toString()
    let day = this.date.getDate().toString()
    let dayCount = this.date.getDate()
    let whatDay = this.date.getDay()
    let time = Math.ceil(this.date.getTime() / 1000)
    let h = this.date.getHours() < 10 ? '0' + this.date.getHours() : this.date.getHours().toString()
    let f = this.date.getMinutes() < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes().toString()
    let m = this.date.getSeconds() < 10 ? '0' + this.date.getSeconds() : this.date.getSeconds().toString()
    obj = {
      year: year,
      month: (month < 10 ? '0' + month : month),
      time: time,
      day: (day < 10 ? '0' + day : day),
      h: h,
      f: f,
      m: m,
      whatDay: whatDay,
      dayCount: dayCount,
      date: `${year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)}`,
      date1: `${year + '/' + (month < 10 ? '0' + month : month) + '/' + (day < 10 ? '0' + day : day)}`,
      datetime: `${year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + h + ':' + f + ':' + m}`
    }
    return obj
  }

  /**
   * 验证手机号码
   * @param nub
   * @returns {boolean}
   * @constructor
   */
  RE_phone (nub) {
    if (this.rg_phone.test(nub)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 验证字母 不分大小写
   */
  RE_letter (str) {
    if (this.rg_letter.test(str)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 匹配中文
   */
  RE_Chinese (str) {
    if (this.rg_Chinese.test(str)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 验证身份证格式
   * @param str 字符串
   * @returns {boolean}
   * @constructor
   */
  RE_idCode (str) {
    if (this.rg_idCode.test(str)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 验证邮箱
   * @param str 字符串邮箱
   * @returns {boolean}
   */
  RE_email (str) {
    if (this.rg_email.test(str)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 验证 中文，数字，英文字母，包括下划线，但不包括别的特殊字符
   * @param str
   * @returns {boolean}
   * @constructor
   */
  RE_text (str) {
    if (this.rg_text.test(str)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 验证数字 -- 浮点型
   * @param nub
   * @returns {boolean}
   * @constructor
   */
  RE_nub_float (nub) {
    if (this.rg_nub_float.test(nub)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 验证数字 整型
   * @param nub
   * @returns {boolean}
   * @constructor
   */
  RE_int (nub) {
    if (this.rg_int.test(nub)) {
      return true
    } else {
      return false
    }
  }

  /**
   * 匹配日期
   */
  RE_date (str) {
    let reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
    // let regExp = new RegExp(reg);
    if (this.verification(str, 'String')) {
      return str.match(reg)
    } else {
      return false
    }
  }

  /** 获取url  的参数
   *
   * @param name 需要在url中获取的参数名
   * @returns {null}
   */
  getUrlParam (name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    let rrr = decodeURIComponent(window.location.href.slice(window.location.href.lastIndexOf('?')))
    let r = rrr.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return null
  }

  getUrlParam2 (name) {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
    let rrr = decodeURIComponent(window.location.href.slice(window.location.href.lastIndexOf('?')))
    let r = rrr.substr(1).match(reg)
    if (r != null) return unescape(r[2])
    return unescape(r[2])
  }

  getQueryVariable (variable) {
    var query = window.location.search.substring(1)
    var vars = query.split("&")
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=")
      if (pair[0] == variable) { return pair[1] }
    }
    return (false)
  }

  /**
   *
   * @param data 要验证的数据
   * @param type 要验证的类型
   * @returns {boolean} 返回false true
   */
  verification (data, type) {
    let gettype = Object.prototype.toString
    // 字符串
    if (gettype.call(data) === '[object String]' && type === 'String') {
      return true
    }
    // 整数
    if (gettype.call(data) === '[object Number]' && type === 'Number') {
      return true
    }
    // 布尔值
    if (gettype.call(data) === '[object Boolean]' && type === 'Boolean') {
      return true
    }
    //  Undefined
    if (gettype.call(data) === '[object Undefined]' && type === 'Undefined') {
      return true
    }
    // 空
    if (gettype.call(data) === '[object Null]' && type === 'Null') {
      return true
    }
    // 对象
    if (gettype.call(data) === '[object Object]' && type === 'Object') {
      return true
    }
    // 数组
    if (gettype.call(data) === '[object Array]' && type === 'Array') {
      return true
    }
    // 函数
    if (gettype.call(data) === '[object Function]' && type === 'Function') {
      return true
    }
    return false
  }

  /**
   * 判断移动端系统类型
   * @param system_type 移动端系统类型
   * @returns String 'android/ios'
   */
  is_ios_android (system_type) {
    let u = navigator.userAgent; let app = navigator.appVersion
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // g
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) {
      // 这个是安卓操作系统
      return 'android'
    }
    if (isIOS) {
      // 这个是ios操作系统
      return 'ios'
    }
  }

  /**
   * 判断是否 PC端
   * @return true/false
   */
  is_PC () {
    let userAgentInfo = navigator.userAgent
    let Agents = ['Android', 'iPhone',
      'SymbianOS', 'Windows Phone',
      'iPad', 'iPod']
    let flag = true
    for (var v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  }

  /**
   * 数组对象去重 最多支持3个数组， 返回去重后的arr 数组
   * @param keyName 判断重复的字段
   * @param arr1 数组1
   * @param arr2 数组2
   * @param arr3 数组3
   * @returns {Array}
   */
  repetitionFun (keyName, arr1 = [], arr2 = [], arr3 = []) { // 数据去重
    let obj = {}
    let arr = []
    let dataArr = [...arr1, ...arr2, ...arr3]
    dataArr.forEach((k) => {
      if (!obj[k[keyName]]) {
        obj[k[keyName]] = 1
        arr.push(k)
      }
    })
    return arr
  }

  /**
   * 普通数组去重
   * @param arr
   * @return arr
   */
  arrRepeat (arr) {
    let obj = {}
    let arr1 = []
    arr.forEach((k) => {
      if (!obj[k]) {
        obj[k] = 1
        arr1.push(k)
      }
    })
    return arr1
  }

  /**
   * 获取字符串中所有的电话号码
   */
  getAllStrPhoneCode (str) {
    let s = this.wipeBlank(str)
    if (s) {
      return s.match(this.rg_PhoneCode)
    } else {
      return []
    }
  }

  /**
   * 隐藏电话号码中间4位
   * @param phone 电话号码
   * @return phone 电话号码
   */
  resetPhone (phone) {
    let str = String(phone)
    let len = str.length
    if (len >= 7) {
      let reg = str.slice(-7, -3)
      return str.replace(reg, "****")
    } else if (len < 7 && len >= 6) {
      // 1234567
      var reg = str.slice(-4, -2)
      return str.replace(reg, "**")
    }
  }

  /**
   * 获取一个元素的高度
   * @param el 元素
   * @return {} 返回属性集合
   */
  getMeasure (el) {
    let h = el.offsetHeight
    let w = el.offsetWidth
    return {
      height: h,
      width: w
    }
  }

  /**
   * 数据值是否为空
   */
  isEmpty (d) {
    let bool = false
    // console.log('isEmpty');
    // console.log(d);
    if (d === '') {
      bool = true
      return bool
    }
    if (d === null) {
      bool = true
      return bool
    }
    if (d === 'null') {
      bool = true
      return bool
    }
    if (d === undefined) {
      bool = true
      return bool
    }
    if (d === 'undefined') {
      bool = true
      return bool
    }
    if (d.length <= 0) {
      bool = true
      return bool
    }
    if (this.verification(d, 'Object')) {
      if (Object.keys(d).length <= 0) {
        bool = true
        return bool
      }
    }
    return bool
  }

  /**
   * 数组对象排序
   * @param prop 排序的字段
   */
  compare (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop]
      var val2 = obj2[prop]; if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    }
  }

  /**
   * 数组对象排序
   * @param arr
   * @param key
   */
  arrCompare (arr, key) {
    arr.sort((obj1, obj2) => {
      var val1 = obj1[key]
      var val2 = obj2[key]
      if (val1 < val2) {
        return -1
      } else if (val1 > val2) {
        return 1
      } else {
        return 0
      }
    })
    return arr
  }

  /**
   * 数组转对象
   * @param arr 数组
   * @param key 转换的字段
   * @return obj
   */
  arrConversionObj (data, key) {
    let dataJson = JSON.stringify(data)
    let arr = JSON.parse(dataJson)
    // console.log(arr);输出一个数组对象
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
      if (!this.isEmpty(arr[i][key])) {
        obj[arr[i][key]] = arr[i]
        // console.log(key);
        // console.log(arr[i][key]);
        // console.log(obj);
        // console.log(arr[i]);//分解输出数组对象
      }
    }
    return obj
  }

  /**
   * 异步对象转数组
   */
  objConversionArr (obj) {
    let len = Object.keys(obj).length
    let arr = []
    let i = 0
    return new Promise((resolve, reject) => {
      for (let k in obj) {
        i++
        arr.push(obj[k])
        if (i >= len) {
          resolve(arr)
        }
      }
      if (len <= 0) {
        reject('数据错误')
      }
    })
  }

  /**
   * 随机数
   * @param len随机数长度
   * @param max 随机数最大值
   */
  randomFun (len = 1, max = 10) {
    let num = ""
    for (let i = 0; i < parseInt(len); i++) {
      num += Math.floor(Math.random() * parseInt(max))
    }
    return num
  }

  /**
   * base64转图片
   * @param base64
   * @param filename文件名称
   * @return 文件对象 file
   */
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
  }

  /**
   * 图片转base64
   */
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
  }

  /**
   * 一维数组遍历递归树结构
   */
}
const common = new com()
export default common
