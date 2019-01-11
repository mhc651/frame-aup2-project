// 组件信息
<template>
<div>
      <top-tool-bar :title="title">
      <span slot="btn">
        <Button type="default" @click="backPage">{{ backPageBtn }}</Button>

        <Button type="primary"  v-if="detail.auditStatus == 2 && read"   @click="revokeData">撤回</Button>

        <Button type="primary"  v-if="detail.auditStatus ==1 && read||detail.auditStatus == 5 && read"   @click="gotoEditor(1)">编辑</Button>

        <Button type="primary" v-if="read && detail.auditStatus == 1" @click="onSubmit" :disabled="disabledSub">提交审核</Button>

        <Button type="primary" v-if="!read " @click="onCommit" :disabled="disabledCommit">保存</Button>
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
              <span v-if="detail.auditStatus == 1">
                未提交
              </span>
               <span v-else-if="detail.auditStatus == 2">
                待审核
              </span>
              <span v-else-if="detail.auditStatus == 3">
                审核中
              </span>
              <span v-else-if="detail.auditStatus == 4">
                通过
              </span>
              <span v-else-if="detail.auditStatus == 5">
                不通过
              </span>
            </td>
          </tr>
          <tr v-if="detail.auditOpinion">
            <th class="label">
              审核回复
            </th>
            <td colspan="3">
              <p class="text-pre">{{ detail.auditOpinion }}</p>
            </td>
          </tr>
        </table>
      </div>
       <h5 class="title">基本资料</h5>
        <form-group ref="form"
        :form='detail'
        :config='formConfig'
        :validate='formValidate'
        />
    </div>
    <!-- content end-->
    <!-- 组件选择 -->
    <my-modal v-model="open_modal_id"
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
      // read: !!!this.$route.params.editor,
      id: this.$route.params.id,
      disabledSub: false,
      disabledCommit: false,
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
            message: '组件名称不为空',
            trigger: 'blur'
          }
        ],
        conversionRatio: [
          {
            required: true,
            message: '产品转换比不能为空',
            trigger: 'blur'
          },
          {
            validate: validatejs.validateNum,
            trigger: 'blur'
          }
        ],
        minUnit: [
          {
            required: true,
            message: '最小单位不为空',
            trigger: 'blur'
          }
        ],
        /*
        productMaterial: [
          {
            required: true,
            message: '产品材质',
            trigger: 'blur'
          }
        ],
         productPackMaterial: [
           {
             required: true,
             message: '包装材质不为空',
             trigger: 'blur'
           }
         ],*/
        packUnit: [
          {
            required: true,
            message: '包装单位不能为空',
            trigger: 'blur'
          }
        ]
      },
      // 默认参数
      detail: {},
      // 审核信息
      review: {},
      // 父级选择
      open_modal_id: false,
      // 父级验证方法
      openValidate: ''
    }
  },
  computed: {
    read() {
      this.initData()
      return !!!this.$route.query.edit
    },
    // 标题
    title() {
      return this.read ? '组件详情' : this.id ? '组件编辑' : '组件新增'
    },
    // 返回按钮
    backPageBtn() {
      return this.read ? '返回' : '取消'
    },
    formConfig() {
      //审核信息
      let fileReview = []
      let value = this.review.jpgFile
      if (this.detail.auditStatus == 5 && value) {
        // 不通过
        fileReview = [
          {
            type: 'string',
            name: '审核状态:',
            default: '不通过',
            style: { color: '#f00' }
          },
          {
            type: 'string',
            name: '审核意见:',
            default: value || '无',
            class: 'text-pre'
          }
        ]
      }

      // 表单配置
      let config = [
        {
          name: '所属注册证',
          type: 'trigger',
          data: 'registerCardNo',
          required: true,
          placeholder: '请填写所属注册证',
          readonly: this.id || false,
          icon: 'navicon-round',
          /**
           * 设置参数的方法
           * @param {Function} setValue
           */
          fn: (val, validate) => {
            this.open_modal_id = true
            this.openValidate = validate
          }
        },
        {
          name: '组件名称',
          type: 'string',
          data: 'subGroupName',
          required: true,
          placeholder: '请填写组件名称',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '产品转换比',
          type: 'string',
          data: 'conversionRatio',
          required: true,
          placeholder: '请填写产品转换比',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '产品材质',
          type: 'string',
          data: 'productMaterial',
          required: false,
          placeholder: '请填写产品材质',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '最小使用单位',
          type: 'string',
          data: 'minUnit',
          required: true,
          placeholder: '请填写最小使用单位',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '产品包装材质',
          type: 'string',
          data: 'productPackMaterial',
          required: false,
          placeholder: '请填写产品包装材质',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '包装单位',
          type: 'string',
          data: 'packUnit',
          required: true,
          placeholder: '请填写包装单位',
          span: 12,
          readonly: this.read ? true : false
        },
        {
          name: '适用范围',
          type: 'text',
          data: 'scope',
          placeholder: '请填写适用范围',
          readonly: this.read ? true : false
        },
        {
          name: '说明书',
          required: true,
          type: 'file',
          data: 'jpgFileList',
          defuld: [],
          action: '/portal/pub/comm/uploadimage',
          readonly: this.read ? true : false,
          format: ['jpg', 'jpeg', 'png'],
          maxSize: 1024 * 5,
          maxLength: 7,
          cell: fileReview
        }
      ]
      return config
    }
  },
  methods: {
    ...mapActions([
      'groupDetail',
      'commitGroupDetail',
      'revokeGroupId',
      'subGroupId'
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
        this.detail.registerCardNo = data.registerCardNo
        this.detail.registerCardId = data.id
        // 验证回调
        this.openValidate('registerCardNo')
      }
    },
    // 保存
    onCommit() {
      this.$refs['form'].subForm().then(
        params => {
          this.disabledCommit = true
          params = JSON.parse(JSON.stringify(params))
          // file id
          params.jpgFile = ''
          if (params.jpgFileList.length) {
            params.jpgFile = params.jpgFileList.map(val => val.id).join(',')
          }
          params.id = this.detail.id
          delete params['auditStatus']
          this.commitGroupDetail(params).then(
            res => {
              this.disabledCommit = false
              this.$Message.success({ content: `保存成功！` })
              this.id = res.content.subGroupId
              this.gotoEditor()
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
      this.subGroupId(param).then(
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
      this.subGroupId(param).then(
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
     * 页面跳转 空 详情页
     */
    gotoEditor(val, id) {
      let path = {
        name: '组件详情',
        params: {
          id: this.id
        }
      }
      if (val == 1) {
        // 修改
        path.query = {}
        path.query.edit = 1
      } else if (val == 2) {
        // 列表
        path = { name: '组件管理' }
      }
      this.$router.push(path)
    },
    /**
     * 撤回
     */
    revokeData() {
      this.revokeGroupId({ ids: this.id }).then(res => {
        this.$Message.info('撤回回成功！')
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
          let path = window.go_to_back
          window.go_to_back = ''
          this.$router.push(path)
        } else {
          this.$router.push({ name: '产品申报' })
        }
      } else {
        // 编辑状态
        if (!this.id) return this.$router.go(-1)
        this.$Modal.confirm({
          content: '取消编辑将不保存修改，确定取消吗?',
          onOk: () => {
            this.$router.go(-1)
          }
        })
      }
    },
    /**
     * 页面数据
     */
    initData() {
      if (this.id) {
        this.groupDetail({ id: this.id }).then(res => {
          // this.id = id
          this.detail = res.content.data
          this.review = res.content.data.auditData || {}
        })
      }
    }
  },
  components: { TopToolBar, FormGroup, OptionTable, MyModal }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped src='../pro/pro.scss'></style>
