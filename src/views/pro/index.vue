// 信息
<template>
<div>
      <top-tool-bar :title="title">
      <span slot="btn">
        <Button type="default" @click="backPage">{{ backPageBtn }}</Button>
        
        <Button type="primary"  v-if="detail.auditStatus == 2 && read"   @click="revokeData">撤回</Button>

        <Button type="primary"  v-if="detail.auditStatus ==1 && read||detail.auditStatus == 5 && read"   @click="gotoEditor(1)">编辑</Button>
        
        <Button type="primary" v-if="read && detail.auditStatus == 1" @click="onSubmit" :disabled="disabledSub">提交审核</Button>
        
        <Button type="primary" v-if="!read" @click="onCommit" :disabled="disabledCommit">保存</Button>
      </span>
      <span slot="content">
        <strong class="help">说明</strong>
        <p>
         无
        </p>
      </span>
    </top-tool-bar>
    <!-- content -->
    <div  class="page-container">
      <div v-if="detail.auditStatus == 4||detail.auditStatus == 5">
       <h5 class="title">审核结果</h5>
        <table class="info-table">
          <tr>
            <th class="label">
              审核结果
            </th>
            <td colspan="3">
              <!-- <span v-if="detail.auditStatus == 1">
                未提交
              </span>
               <span v-else-if="detail.auditStatus == 2">
                待审核
              </span>
              <span v-else-if="detail.auditStatus == 3">
                审核中
              </span> -->
              <span v-if="detail.auditStatus == 4">
                通过
              </span>
              <span v-else-if="detail.auditStatus == 5">
                不通过
              </span>
            </td>
          </tr>
          <tr v-if="detail.auditOpinion">
            <th class="label">
              审核意见
            </th>
            <td colspan="3">
              <p class="text-pre">{{ detail.auditOpinion }}</p>
            </td>
          </tr>
        </table>
      </div>
       <h5 class="title">基本资料</h5>
        <form-group  ref="form" :form='detail'  :config='formConfig' :validate='formValidate' ></form-group>
    </div>
    <!-- content end-->
     <!-- 组件选择 -->
    <my-modal  v-model="open_modal_id"
      title="请选择"
      width='1200'
      @on-close = "open_modal_id = false"
      @on-ok = 'checkoutTable'
    >
      <option-table ref="table" ></option-table>
    </my-modal>
    <!-- 组件选择 end-->
</div>

</template>

<script>
import TopToolBar from '@/components/Common/TopToolBar.vue'
import FormGroup from '@/components/formGroup.vue'
import { validateNowDate } from '../../assets/js/common.js'
import validatejs from '../../assets/js/validate.js'
import { mapState, mapActions } from 'vuex'
import OptionTable from './cell/table.vue'
import MyModal from '@/components/myModal.vue'
export default {
  data() {
    return {
      id: this.$route.params ? this.$route.params.id : '',
      // 产品类别
      disabledSub: false,
      disabledCommit: false,
      // 父级选择
      open_modal_id: false,
      // 父级验证方法
      openValidate: '',
      // 数据配置
      model: [],
      // 竞价分组
      select_type: {},
      // 验证
      formValidate: {
        registerCardNo: [
          {
            required: true,
            message: '注册证不能为空',
            trigger: 'blur'
          }
        ],
        subGroupName: [
          {
            required: true,
            message: '组件不能为空',
            trigger: 'blur'
          }
        ],
        standard: [
          {
            required: true,
            message: '规格不能为空',
            trigger: 'blur'
          }
        ],
        model: [
          {
            required: true,
            message: '型号不能为空',
            trigger: 'blur'
          }
        ],
        aup2ProjectTypeGroupId: [
          {
            required: true,
            message: '竞价分组不能为空',
            trigger: 'change'
          }
        ]
      },
      // 默认参数
      detail: {}
    }
  },
  computed: {
    // 页面状态
    read() {
      this.initData()
      return !!!this.$route.query.edit
    },
    // 标题
    title() {
      return this.read ? '产品详情' : '产品编辑'
    },
    // 返回按钮
    backPageBtn() {
      return this.read ? '返回' : '取消'
    },
    formConfig() {
      // 表单配置
      let form = [
        {
          name: '所属注册证',
          type: 'trigger',
          data: 'registerCardNo',
          required: true,
          placeholder: '请填写所属注册证',
          readonly: this.read ? true : false,
          icon: 'navicon-round',
          /**
           * 设置参数的方法
           * @param {Function} setValue
           */
          fn: (v, cb) => {
            this.open_modal_id = true
            this.openValidate = cb
          }
        },
        {
          name: '组件名称',
          type: 'string',
          data: 'subGroupName',
          required: true,
          placeholder: '请填写组件名称',
          disabled: true,
          span: 12
        },
        {
          name: '规格',
          type: 'string',
          data: 'standard',
          required: true,
          placeholder: '请填写规格',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '型号',
          type: 'string',
          data: 'model',
          required: true,
          placeholder: '请填写型号',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '竞价组名称',
          type: 'select',
          data: 'aup2ProjectTypeGroupId',
          required: true,
          placeholder: '请填写竞价组名称',
          options: this.select_type,
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '备注',
          type: 'text',
          data: 'note',
          placeholder: '请填写备注',
          readonly: this.read ? true : false
        }
      ]
      for (let i = 0; i < this.model.length; i++) {
        let item = this.model[i]
        form.push({
          name: item.name,
          type: item.type,
          data: item.code,
          required: !item.allowBlank,
          placeholder: '请填写' + item.name,
          span: 12,
          readonly: this.read ? true : false
        })
      }
      return form
    }
  },
  methods: {
    ...mapActions([
      'typegroupAndAttibuteListByGrouptypeId',
      'proDetail',
      'commitProDetail',
      'revokeProId',
      'subProId',
      'proDetailInit',
      'getAttibuteConfigByRegisterId'
    ]),

    // 选择table
    checkoutTable() {
      let checkout = this.$refs['table'].getTable().$data.checkout

      if (checkout.length > 1) {
        this.$Message.warning({ content: '只能选择一种注册证' })
      } else if (!checkout.length) {
        this.$Message.warning({ content: '请选择注册证！' })
      } else {
        this.open_modal_id = false
        let data = checkout[0]
        // get 注册证 select options
        this.detail.registerCardNo = data.registerCardNo
        this.detail.registerCardId = data.registerCardId
        this.detail.aup2ProjectTypeId = data.aup2ProjectTypeId
        this.detail.subGroupName = data.subGroupName
        this.$set(this.detail, 'subGroupId', data.id)
        this.openValidate('registerCardNo')
        // 获得input配置
        this.getAttibuteConfigByRegisterId({
          id: data.registerCardId
        }).then(res => {
          this.model = res.content.attributes
        })
        // 获得竞价分组
        this.getTypeJINGJIA()
      }
    },
    // 保存
    onCommit() {
      this.$refs['form'].subForm().then(
        params => {
          this.disabledCommit = true
          params = JSON.parse(JSON.stringify(params))
          // 分类目录id
          params.id = this.id
          params.attributeJson = {}
          
          for (let item of this.model) {
            let key = item.code
            params.attributeJson[key] = params[key]
            // delete params[key]
          }
          // params.attributeJson = JSON.stringify(params.attributeJson)
          // delete params['aup2ProjectTypeGroupName']
          // delete params['attributeConfigJson']
          // delete params['registerCardNo']
          // delete params['subGroupName']
          // delete params['auditStatus']
          this.commitProDetail(params).then(
            res => {
              this.$Message.success({ content: `保存成功！` })
              this.disabledCommit = false
              this.id = res.content.productId
              this.gotoEditor(2)
            },
            err => {
              this.disabledCommit = false
            }
          )
        },
        err => {
          this.disabledCommit = false
        }
      )
    },
    /**
     * 提交审核
     */
    onSubmit() {
      // let open_time = '2018/06/12 00:00:00'
      // if(!validateNowDate(open_time)){
      //   return this.$Modal.warning({
      //     content:`审核提交开始时间为 ${ open_time }`
      //   })
      // }
      this.disabledSub = true
      let param = { ids: this.id, isSubmitZcz: '' }
      this.subProId(param).then(
        res => {
          if (res.content.suc) {
            this.$Message.success({ content: `提交成功！` })
            this.initData()
          } else {
            this.$Modal.confirm({
              title: '重要提示',
              content: res.content.msg,
              onOk: () => {
                this.subAllId(param)
              }
            })
          }
          this.disabledSub = false
        },
        err => {
          this.disabledSub = false
        }
      )
    },
    /**
     * 强制提交
     */
    subAllId(param) {
      this.disabledSub = true
      param.isSubmitZcz = 1
      this.subProId(param).then(
        res => {
          // reloade table
          this.$Message.success({ content: `提交成功！` })
          this.disabledSub = false
          this.initData()
        },
        err => {
          this.disabledSub = false
        }
      )
    },
    /**
     * 撤回
     */
    revokeData() {
      this.revokeProId({ ids: this.id }).then(res => {
        this.$Message.info('撤回成功！')
        this.gotoEditor(1)
        this.detail.auditStatus = 1
      })
    },
    /**
     * 取消编辑
     */
    backPage() {
      if (this.read) {
        // 回到列表页
        if (window.go_to_back) {
          // 返回存储页
          this.$router.push(go_to_back)
          window.go_to_back = ''
        } else {
          this.$router.push({ name: '产品申报' })
        }
      } else {
        if (!this.id) return this.$router.go(-1)
        this.$Modal.confirm({
          content: '取消编辑将不保存修改，确定取消吗?',
          onOk: () => {
            this.gotoEditor()
          }
        })
      }
    },
    /**
     * 跳转到页面
     * @param {number} val 空为详情页
     */
    gotoEditor(val) {
      let path = {
        name: '单一规格详情',
        params: {
          id: this.id
        }
      }
      if (val == 1) {
        // 修改
        path.query = {}
        path.query.edit = 1
        this.$router.push(path)
      } else if (val == 2) {
        // 列表
        this.$router.push(path)
      } else {
        this.$router.go(-1)
      }
    },
    /**
     * 页面数据
     */
    initData() {
      if (this.id) {
        this.proDetail({ id: this.id }).then(res => {
          let data = res.content.data
          this.model = data.attributeConfigJson
          this.detail = data
          // 整合字段
          for (let key in this.detail['attributeJson']) {
            this.detail[key] = this.detail['attributeJson'][key]
          }
          this.getTypeJINGJIA()
          console.log(this.detail)
          // 去除多余字段
          // delete this.detail['attributeJson']
          // delete this.detail['attributeConfigJson']
        })
      }
    },
    /**
     * 获取竞价组options
     */
    getTypeJINGJIA() {
      this.typegroupAndAttibuteListByGrouptypeId({
        groupTypeId: this.detail.aup2ProjectTypeId
      }).then(res => {
        this.select_type = {}
        for (let item of res.content.subGroupList) {
          this.select_type[item.id] = item.name
        }
      })
    }
  },
  // created() {
  //   this.initData()
  // },
  components: { TopToolBar, FormGroup, MyModal, OptionTable }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped src='./pro.scss'></style>
