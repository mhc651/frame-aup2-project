/**
 *  @file 全局工具函数 2018/06/21
 *  @author qiu(423822728@aa.com)
 */
module.exports = {
  /**
   * 当前时间验证
   * @param {string} dateTime 时间
   * @return {Boolean} 通过为ture 反之 false
   * */
  validateNowDate(dateTime) {
    let date = new Date(dateTime)
    let now = new Date()
    if (date > now) {
      return false
    } else {
      return true
    }
  },
  /**
   * 转换成天时..
   * @param {Number} num ms
   */
  toTimeDate(num) {
    // 毫秒
    let ms = 1000
    // 秒
    let s = 60
    // 分
    let f = 60
    // 时
    let h = 24
    // 几天
    let elemnt_d = h * f * s * ms
    let day = parseInt(num / elemnt_d)
    let num_day = num % elemnt_d
    // 几时
    let elemnt_h = f * s * ms
    let hour = parseInt(num_day / elemnt_h)
    let num_hour = num_day % elemnt_h
    // 几分
    let elemnt_m = s * ms
    let min = parseInt(num_hour / elemnt_m)
    let num_min = num_hour % elemnt_m
    // 几秒
    let elemnt_s = ms
    let second = parseInt(num_min / elemnt_s)
    let num_ms = num_min % elemnt_s
    if (num_ms) second += 1

    return `${day}天${hour}时${min}分${second}秒`
  },
  /*移除数组中和指定的值相等的元素*/
  remove(arr, item) {
    var ret=[];
    for(var i=0;i<arr.length;i++){
      if(arr[i]!=item){
        ret.push(arr[i]);
      }
    }
    return ret;
  },
}
