// 组件列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar v-if='!modal_pw' class="title--bg" title='报价管理'>
          <span slot="content">
            <strong class="help">说明</strong>
            <p>
            无
            </p>
          </span>
          <big v-if='date_show' slot="btn">
            距{{ date_tip }}还剩：
            <span class="text--red">{{ date_show||'截止' }}</span>
          </big>
      </top-tool-bar>
    <!-- title end-->
    <!-- content  -->
    <div class="page-container" v-if='!modal_pw'>
       <!-- top tab -->
        <div class="head-tab">
          <a class="head-tab_btn" v-for="(val,index) in tables" :key="index" :class='index === active?"active":""' @click="tabTable(index)" > {{ val.name }}
            <!-- <Badge :count="val.allTotal" :overflow-count="reviewNum.max" /> -->
          </a>
        </div>
        <!-- top tab end-->
        <div class="head-top">
          <p class="text--red">温馨提示: </p>
          <ol>
            <li>
              企业报价通过网上统一解密，在规定时间内未报价或报价为0或未解密报价的，则视为自动放弃入围资格。
            </li>
            <li>
              生产企业本次报价的产品规格品种必须齐全，满足采购目录中的规格要求。
            </li>
            <li>
              原则上同一注册证下的所有型号、规格的耗材产品均应按照竟价组规则参与谈判报价,不报价的规格不予采购，选择性报价的将取消所有产品的入围和入选资格。
            </li>
            <li class="text--red">
              报价使用货币及单位：人民币（元），报价保留小数点后2位（即：0.01），如果超出小数点后2位，则舍去。
             </li>
             <li>
                请按最小使用单位（既：最小包装单位）报价。
              </li>  
              <li>
                每页报价完后必须点击“提交本页报价
              </li> 
          </ol>  
        </div>
        <!-- table -->
        <table-page
          :filter='filter'
          ref="table"
          :columns='table_th'
          :getDataFn='initTable'
          :pagerSizeArr= 'PAGE_SIZE_ARR'
          :pagerSize= 'table_now.size'
          :data = 'table_now.data'
          :total = 'table_now.total'
          :setPage = 'table_now.page'
          :storage ="'aup2org' +  $route.path"
         />
        <!-- table end-->
        <div style="margin-top:15px">
          <Button v-if='active == 0'  type="primary" @click="openOffterModal" >提交选中的报价</Button>
          <Button v-if='active == 1' :disabled='disabledRecoke'    @click="openRevoke" type="primary">撤回</Button>
          <Button v-if='active == 1' @click="openDecryptModal"  >解密</Button>
        </div>
    </div>
    <!-- content  end-->
    <!-- 密码设置 -->
    <my-modal v-model="modal_pw"
      :required = 'true'
      @on-close = "$router.go(-1)"
      title="初次使用请先设置管理秘钥"
      width='500'
      @on-ok = 'subPw'
    >
     <ul class="text--red list--ol" style="margin-top:20px">
          <li>
           警告：请您务必记住设置的秘钥，如果丢失或遗忘，则无法将其恢复。 
          </li>
          <li>
            注意：设置的管理秘钥用于：报价加密和报价解密！将直接影响入围资格。
          </li>
        </ul>
        <Form ref="form" :model="form_offter" :rules="validate_offter" :label-width="70" style="margin-top:20px">
          <FormItem class="form--padding" label="设置密码" prop="password">
            <Input type='password' v-model="form_offter.password" :style="{width:'200px'}" />
            <span  class="input-tip">
              6-20位英文（区分大小写）、数字、字符的组合
            </span>
          </FormItem>
          <FormItem class="form--padding" label="重复密码" prop="pw">
            <Input  type='password' v-model="form_offter.pw" :style="{width:'200px'}" />
            <span class="input-tip">
              请再次输入
            </span>
          </FormItem>
        </Form>
    </my-modal>
    <!-- 密码设置 end-->
    <!-- 报价提交 -->
    <my-modal v-model="modal_sub"
      @on-close = "modal_sub = false"
      title="加密密码请输入您设置的管理秘钥"
      width='500'
      @on-ok = 'subOffter'
    >
     <ol class="text--red list--ol" style="margin-top:15px">
          <li>
           请您务必记住设置的秘钥，如果丢失或遗忘，则无法将其恢复。 
          </li>
          <li>
            设置的管理秘钥用于：报价加密和报价解密！将直接影响入围资格。
          </li>
          <li>
            密码是区分大小写的
          </li>
        </ol>
        <Form ref="offter" :model="form_sub"  :label-width="70" style="margin-top:15px">
          <FormItem class="form--padding" label="加密密码" prop="password">
            <Input type='password' v-model="form_sub.password" :style="{width:'200px'}" />
            <span  class="input-tip">
             请输入密码
            </span>
          </FormItem>
        </Form>
    </my-modal>
    <!-- 报价提交 end-->
    <!-- 报价解密 -->
    <my-modal v-model="modal_decrypt"
          title="解密请使用设置好的管理秘钥"
          width='500'
          @on-close = "modal_decrypt = false"
          @on-ok = 'subDecrypt'
        >
        <ol class="text--red list--ol" style="margin-top:20px">
          <li>
          如果您设置的密码包含大写字母，请用同样的方式输入。
          </li>
          <li>
           如果密码被丢失或遗忘，则无法进行撤回。
          </li>
          <li>
          确认后请到待报价页面中重新提交报价，请谨慎操作。
          </li>
        </ol>
        <Form ref="decrypt" :model="form_decrypt"  :label-width="70" style="margin-top:15px">
          <FormItem class="form--padding" label="加密密码" prop="password">
            <Input type='password' v-model="form_decrypt.password" :style="{width:'200px'}" />
            <span>
              请输入密码
            </span>
          </FormItem>
        </Form>
    </my-modal>
    <!-- 报价解密 end-->
    <!-- 报价撤回 -->
    <my-modal v-model="modal_revoke"
      @on-close = "modal_revoke = false"
      title="加密密码请输入您设置的管理秘钥"
      width='500'
      @on-ok = 'subRevokeOffter'
    >
     <ol class="text--red list--ol" style="margin-top:20px">
          <li>
          如果您设置的密码包含大写字母，请用同样的方式输入。
 
          </li>
          <li>
           如果密码被丢失或遗忘，则无法进行撤回。
          </li>
          <li>
          确认后请到待报价页面中重新提交报价，请谨慎操作。
          </li>
        </ol>
        <Form ref="offter" :model="form_revoke"  :label-width="70" style="margin-top:15px">
          <FormItem class="form--padding" label="加密密码" prop="password">
            <Input type='password' v-model="form_revoke.password" :style="{width:'200px'}" />
            <span  class="input-tip">
             请输入密码
            </span>
          </FormItem>
        </Form>
    </my-modal>
    <!-- 报价撤回 end-->
    <!-- 报价 -->
     <my-modal v-model="modal_offter_set.bool"
          title="设置报价"
          width='500'
          @on-close = "modal_offter_set.bool = false"
          @on-ok = 'setRowOffter'
        >
        <Form ref="decrypt"  :label-width="70" style="margin-top:30px">
          <FormItem class="form--padding" label="设置报价" >
            <Input type='text' v-model="modal_offter_set.value" :style="{width:'200px'}" />
            <span>
              设置金额
            </span>
          </FormItem>
        </Form>
    </my-modal>
    <!-- 报价 end-->
    
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import TablePage from '../../components/tablePage.vue'
import FormGroup from '@/components/formGroup.vue'
import { mapState, mapActions } from 'vuex'
import { PAGE_SIZE_ARR } from '../../assets/js/const'
import { toTimeDate } from '../../assets/js/common'
import validatejs from '../../assets/js/validate'
import MyModal from '@/components/myModal.vue'
export default {
  data() {
    // 模块
    let tables = []
    tables.push({
      name: '待报价',
      data: [],
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      offerState: 2,
      dateStart: '',
      dateStartTip: '报价开始',
      dateEnd: '',
      dateEndTip: '报价结束'
      // 筛选
    })
    tables.push({
      name: '待解密',
      size: PAGE_SIZE_ARR[0],
      data: [],
      total: 0,
      page: 1,
      offerState: 3,
      dateStart: '',
      dateStartTip: '解密开始',
      dateEnd: '',
      dateEndTip: '解密结束'
    })
    tables.push({
      name: '已解密',
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      data: [],
      offerState: 4
    })
    //重复密码验证
    let that = this
    const validatePw = function(r, v, cb) {
      if (v !== that.form_offter.password) {
        cb(Error('密码和重复密码输入不一致'))
      } else {
        cb()
      }
    }

    return {
      id: this.$route.params.id,
      /**
       * 报价撤回
       * */
      disabledRecoke: false,
      modal_revoke: false,
      form_revoke: {
        password: ''
      },
      /**
       * 解密
       * */
      modal_decrypt: false,
      form_decrypt: {
        password: '',
        pw: ''
      },
      /**
       * 设置报价密码
       * @namespace
       * */
      modal_pw: false,
      form_offter: {
        password: '',
        pw: ''
      },
      // 报价验证
      validate_offter: {
        password: [
          {
            required: true,
            message: '设置密码不能为空',
            trigger: 'blur'
          },
          {
            type: 'string',
            min: 6,
            message: '6-20位英文（区分大小写）、数字、字符的组合',
            trigger: 'blur'
          }
        ],
        pw: [
          {
            required: true,
            message: '重复密码不能为空',
            trigger: 'blur'
          },
          {
            validator: validatePw,
            trigger: 'blur'
          }
        ]
      },
      /**
       * 报价提交
       * @namespace
       * */
      modal_sub: false,
      form_sub: {
        password: ''
      },
      /**
       * 报价设置
       * @namespace
       */
      modal_offter_set: {
        bool: false,
        item: {},
        value: ''
      },

      // 当前状态选择
      active: 0,
      // 分页数组
      PAGE_SIZE_ARR,
      // 表格配置
      tables,
      // 产品分类
      project_class: {},
      //
      project_type: {},
      // 竞价分组
      project_type2: {},
      // 质量层次
      project_type3: {},
      // 计时器
      timeOut: '',
      // 设置结束时间
      date_show: '',
      date_tip: '',
      table_th: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '价格',
          key: 'price',
          render: (h, r) => {
            let dom = h(
              'span',
              {
                class: 'text--red '
              },
              r.row.price
            )
            if (r.row.offerState == 2) {
              dom = h(
                'a',
                {
                  // class: 'td--edit',
                  style: {
                    display: 'block',
                    minWidth: '100%',
                    minHeight: '30px',
                    'text-align': 'center'
                  },
                  on: {
                    click: e => {
                      let that = this
                      let val = Number(r.row.price)
                      val = String(val) == 'NaN' ? '' : val
                      e.target.innerHTML = `<input type='text' style='width:100%' value ='${val}'>`
                      let input = e.target.querySelector('input')
                      setCaretPosition(input, val)
                      input.addEventListener('blur', function() {
                        let v = Number(this.value)
                        v = v.toFixed(2)
                        if (v < 0) {
                          that.$Message.warning({
                            content: '报价必须为数字且不能为小于0'
                          })
                          v = r.row.price
                        }
                        if (v != that.tables[0].data[r.index].price) {
                          // 但参数改变时这行的数据会被更新 手动重置 多选
                          that.tables[0].data[r.index].price = v
                          that.setCheckoutTr()
                        } else {
                          e.target.innerHTML = v
                        }
                      })
                      /**
                       * 设置光标位置
                       * @param {Dom} ctrl
                       * @param {Number} pos
                       */
                      function setCaretPosition(ctrl, v) {
                        let pos = String(v).length
                        if (ctrl.setSelectionRange) {
                          ctrl.focus()
                          ctrl.setSelectionRange(pos, pos) //设置一个选中的位置
                        } else if (ctrl.createTextRange) {
                          //ie
                          var range = ctrl.createTextRange()
                          range.collapse(true) //允许开始和结尾重合
                          range.moveEnd('character', pos)
                          range.moveStart('character', pos)
                          range.select()
                        }
                      }
                    }
                  }
                },
                r.row.price
              )
            }
            return dom
          }
        },
        {
          title: '注册证编号',
          key: 'registerCardNo',
          render: (h, r) => {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    this.clickLinkGoToBack()
                    this.$router.push({
                      name: '产品公示',
                      params: { id: r.row.productId }
                    })
                  }
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '组件名称',
          key: 'subGroupName'
        },
        {
          title: '产品转换比',
          key: 'conversionRatio'
        },
        {
          title: '最小使用单位',
          key: 'minUnit'
        },
        {
          title: '包装单位',
          key: 'packUnit'
        },
        {
          title: '型号',
          key: 'model'
        },
        {
          title: '规格',
          key: 'standard'
        },
        {
          title: '分组',
          key: 'aup2ProjectTypeGroupName'
        },
        {
          title: '质量层次',
          key: 'qualityName'
        }
      ]
    }
  },
  computed: {
    ...mapState(['offterConfig']),
    /**
     * 当前表格
     * */

    table_now() {
      return this.tables[this.active]
    },
    /**
     * 筛选
     */
    filter() {
      return [
        {
          data: 'registerCardNo',
          name: '注册证编号',
          type: 'string'
        },
        {
          data: 'subGroupName',
          name: '组件名称',
          type: 'string'
        },
        {
          data: 'manufactureName',
          name: '生产企业',
          type: 'string'
        },
        {
          data: 'conversionRatio',
          name: '产品转换比',
          type: 'string'
        },
        {
          data: 'minUnit',
          name: '最小使用单位',
          type: 'string'
        },
        {
          data: 'packUnit',
          name: '包装单位',
          type: 'string'
        },
        {
          data: 'standard',
          name: '规格',
          type: 'string'
        },
        {
          data: 'model',
          name: '型号',
          type: 'string'
        },
        {
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          type: 'select',
          options: this.project_class,
          onChange: value => {
            if (!value) return
            // 竞价分组
            this.typegroupAndAttibuteListByGrouptypeId({
              groupTypeId: value
            }).then(res => {
              let arr = { '0': '全部' }
              for (let item of res.content.subGroupList) {
                arr[item.id] = item.name
              }
              this.project_type2 = arr
            })
          }
        },
        {
          data: 'managementType',
          name: '请选择管理类别',
          type: 'select',
          options: this.project_type
        },
        {
          data: 'aup2ProjectTypeGroupId',
          name: '请选择竞价组',
          type: 'select',
          options: this.project_type2
        },
        {
          data: 'qualityId',
          name: '请选择质量层次',
          type: 'select',
          options: this.project_type3
        },
        {
          name: '按钮组',
          type: 'btns',
          cells: [
            {
              name: '筛选',
              type: 'filter'
            },
            {
              name: '重置',
              type: 'reset'
            }
          ]
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'groupList',
      'manageType',
      'subGroupId',
      'commitOffter',
      'offterList',
      'revokeOffter',
      'decryptOffter',
      'isOffterPw',
      'offterPw',
      'qualityList',
      'typegroupAndAttibuteListByGrouptypeId'
    ]),
    /**
     * 数据选中后设置选中
     */
    setCheckoutTr() {
      let checkouts = this.$refs['table'].checkout
      let datas = this.tables[0].data
      // init checked
      for (let item of datas) {
        item._checked = false
      }
      // set init checked
      for (let i = 0; i < checkouts.length; i++) {
        //选中的对象
        let item = checkouts[i]
        // 更新
        for (let tr of datas) {
          if (item.id == tr.id) {
            tr._checked = true
            //更新选中
            checkouts[i] = tr
          }
        }
      }
    },
    /**
     * 设置倒计时
     */
    initTimeOut() {
      let that = this
      this.timeOut = setInterval(function() {
        that.getDate()
      }, 1000)
    },
    /**
     * 设置倒计时显示
     * @param {Number} num 剩余时间
     * @param {String} tip 显示内容
     */
    setDate(num, tip) {
      if (num > 0) {
        let str = toTimeDate(num)
        this.date_show = str
      } else {
        // 结束计时
        if (this.timeOut) clearInterval(this.timeOut)
        // 截止
        this.date_show = ''
      }
      this.date_tip = tip
    },
    /**
     * 获得时间差
     * @param {Object} obj table config
     * @returns 返回开始结束和当前时间差
     */
    getDateNum(obj) {
      let now = new Date()
      let date_end = new Date(this.table_now.dateEnd)
      let date_start = new Date(this.table_now.dateStart)
      let end = date_end - now
      let start = date_start - now
      return [start, end]
    },
    /**
     *  获取倒计时
     */
    getDate() {
      let date = this.getDateNum(this.table_now)
      if (date[0] > 0) {
        // 显示开始
        this.setDate(date[0], this.table_now.dateStartTip)
      } else {
        this.setDate(date[1], this.table_now.dateEndTip)
      }
    },
    // 预设详情返回列表
    clickLinkGoToBack() {
      window.go_to_back = this.$route.path
    },
    // 设置报价
    setRowOffter() {
      let obj = this.modal_offter_set
      let r = obj.item
      let v = Number(obj.value).toFixed(2)
      this.tables[0].data[r.index].price = v
      obj.bool = false
    },
    // 切换
    tabTable(index) {
      this.active = index
      let table = this.tables[index]
      this.$refs['table'].getParamData({
        size: table.size,
        page: table.page,
        offerState: table.offerState
      })
    },
    /**
     * 显示成功提示
     */
    showModalContent(content) {
      let dom = ''
      for (let item of content.fail) {
        dom += item + '\n'
      }
      if (content.fail.length) {
        this.$Modal.warning({ content: content.fail })
      } else {
        this.$Message.success({ content: '操作成功!' })
      }
      this.$refs['table'].getData()
    },
    /**
     * 报价表单
     */
    openOffterModal() {
      let data = this.checkedTable('报价')
      if (!data) return
      // let date = this.getDateNum(this.tables[0])
      // if (date[0] > 0) {
      //   return this.$Message.warning({ content: '报价未开始' })
      // } else if (date[1] < 0) {
      //   return this.$Message.warning({ content: '报价已结束' })
      // }
      let isbeark = false
      for (let i = 0; i < data.length; i++) {
        let value = Number(data[i].price)
        if (String(value) == 'NaN' || value < 0) {
          isbeark = i + 1
          break
        }
      }
      if (isbeark)
        return this.$Message.warning({
          content: `第${isbeark}项没按要求填写报价！`
        })
      this.modal_sub = true
    },
    /**
     * 提交报价
     */
    subOffter() {
      let data = this.checkedTable()
      if (!this.form_sub.password)
        return this.$Message.warning({ content: '请输入管理密码！' })
      let params = { configId: this.id, password: this.form_sub.password }
      params.data = []
      for (let item of data) {
        params.data.push({
          id: item.id,
          price: item.price
        })
      }
      this.commitOffter(params).then(res => {
        this.form_sub.password = ''
        this.showModalContent(res.content)
        this.modal_sub = false
      })
    },
    /**
     * show decrypt modal
     */
    openDecryptModal() {
      let data = this.checkedTable('解密')
      if (!data) return
      this.modal_decrypt = true
    },
    /**
     * 提交解密
     */
    subDecrypt() {
      let data = this.checkedTable()
      if (!this.form_decrypt.password)
        return this.$Message.warning({ content: '请输入管理密码！' })
      let params = { configId: this.id, password: this.form_decrypt.password }
      params.ids = data.map(i => i.id).join(',')
      this.decryptOffter(params).then(res => {
        this.form_decrypt.password = ''
        this.showModalContent(res.content)
        this.modal_decrypt = false
      })
    },
    /**
     * modal revoke show
     */
    openRevoke() {
      let data = this.checkedTable('撤回')
      if (!data.length) return
      this.modal_revoke = true
    },
    /**
     * 提交撤回
     */
    subRevokeOffter() {
      let data = this.checkedTable()
      if (!this.form_revoke.password)
        return this.$Message.warning({ content: '请输入管理密码！' })
      let params = { configId: this.id, password: this.form_revoke.password }
      params.ids = data.map(i => i.id).join(',')
      this.revokeOffter(params).then(res => {
        this.form_revoke.password = ''
        this.showModalContent(res.content)
        this.modal_revoke = false
      })
    },
    /**
     * 提交初始化密码
     */
    subPw() {
      this.$refs['form'].validate().then(bool => {
        if (!bool) return
        this.offterPw(this.form_offter).then(res => {
          this.$Message.success({ content: res.content })
          this.modal_pw = false
        })
      })
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      // 默认状态
      if (!param.offerState) param.offerState = this.tables[0].offerState
      for (let i = 0; i < this.tables.length; i++) {
        let item = this.tables[i]
        // 当前tab
        if (param.offerState == item.offerState) {
          if (this.active != i) this.active = i
          break
        }
      }
      // 开始计时器
      if (this.timeOut) clearInterval(this.timeOut)
      this.initTimeOut()
      let table = this.table_now
      table.size = param.size
      // select转换
      if (param.managementType == 0) param.managementType = ''
      if (param.aup2ProjectTypeGroupId == 0) param.aup2ProjectTypeGroupId = ''
      if (param.aup2ProjectTypeId == 0) param.aup2ProjectTypeId = ''
      if (param.qualityId == 0) param.qualityId = ''
      param.configId = this.id
      this.offterList(param).then(res => {
        table.total = res.content.total
        table.data = res.content.records
        table.page = res.content.page
      })
    },
    /**
     * 当选选择
     */
    checkedTable(name = '设置', max = false) {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length) {
        this.$Message.warning({ content: `请选择要${name}的对象！` })
        return false
      } else if (max && checkout.length > max) {
        this.$Message.warning({ content: `只能选择一个对象进行${name}！` })
        return false
      }
      return checkout
    }
  },
  created() {
    // 分组类别
    this.$store.dispatch('apply/categories').then(res => {
      this.project_class = res.content.auctionGroup
      this.project_class['0'] = '全部'
    })
    // 管理类型
    this.manageType().then(res => {
      this.project_type = { 0: '全部' }
      for (let item of res.content) {
        this.project_type[item.code] = item.text
      }
    })
    // 质量层次
    this.qualityList().then(res => {
      this.project_type3 = { 0: '全部' }
      for (let item of res.content) {
        this.project_type3[item.code] = item.text
      }
    })
    // 是否有管理密码
    this.isOffterPw().then(res => {
      if (!res.content) this.modal_pw = true
    })
    // 时间设置
    if (this.offterConfig) {
      this.tables[0].dateStart = this.offterConfig.offerStart
      this.tables[0].dateEnd = this.offterConfig.offerEnd
      this.tables[1].dateStart = this.offterConfig.decryptStart
      this.tables[1].dateEnd = this.offterConfig.decryptEnd
    }
  },
  components: { TopToolBar, TablePage, FormGroup, MyModal }
}
</script>
<style lang="scss" src='../../assets/css/page.scss'></style>


