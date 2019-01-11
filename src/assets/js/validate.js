/**
 * @file 内容验证 基于iview表单验证 2018/06/21
 * @author qiu（423822728@qq.com）
 */

const Validatejs = {
  /**
   *  身份证位数验证
   */
  validateIdCard(rule, value, callback) {
    let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    let name = '身份证'
    // 执行判断
    if (reg.test(value)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error(`${name}格式不正确`))
      } else {
        return false
      }
    }
  },
  /**
   * 手机座机
   */
  validateAllPhone(rule, value, callback) {
    let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/
    let reg2 = /^(0[0-9]{2,3}[\-]?)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
    let name = '号码'
    // 执行判断
    if (reg.test(value) || reg2.test(value)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error(`${name}格式不正确`))
      } else {
        return false
      }
    }
  },
  // 手机号码验证
  validatePhone(rule, value, callback) {
    let reg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/
    let name = '手机号码'
    // 执行判断
    if (reg.test(value)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error(`${name}格式不正确`))
      } else {
        return false
      }
    }
  },
  // 邮箱验证
  validateMail(rule, value, callback) {
    let reg = /^\w{3,}@\w+(\.\w+)+$/
    let name = '邮箱'
    // 执行判断
    if (reg.test(value)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error(`${name}格式不正确`))
      } else {
        return false
      }
    }
  },
  // 数值验证
  validateNum(rule, value, callback) {
    if (arguments.length < 2) value = rule
    let reg = /^((0.[0-9]*)||([1-9][0-9]*(.[0-9]+)))$/
    let name = '数值'
    // 执行判断
    if (reg.test(value)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error(`${name}格式不正确`))
      } else {
        return false
      }
    }
  },
  /**
   * 金钱验证
   */
  validateMoney(rule, value, callback) {
    if (arguments.length == 1) value = rule
    let reg = /^((0.[0-9]*)||([1-9][0-9]?(.[0-9]+)))$/
    let name = '金额'
    // 执行判断
    if (reg.test(value)) {
      if (callback) {
        callback()
      } else {
        return true
      }
    } else {
      if (callback) {
        callback(new Error(`${name}格式不正确`))
      } else {
        return false
      }
    }
  },
  // 图片验证
  validateImg(value) {
    let reg = /\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$/gi
    // 执行判断
    if (reg.test(value)) {
      return true
    } else {
      return false
    }
  },

  // doc 验证
  validateDoc(value) {
    let reg = /\.(doc|docx)$/gi
    // 执行判断
    if (reg.test(value)) {
      return true
    } else {
      return false
    }
  }
}

export default Validatejs
