<template>
  <div>
    <top-tool-bar title="企业入围公示">
      <span slot="btn">
        <Button type="default" @click="$router.go(-1)">返回</Button>
        </span>
      <span slot="content">
        <strong class="help">说明</strong>
        <p>
         无
        </p>
      </span>
    </top-tool-bar>
    <!-- content   -->
    <div  class="page-container">
      <form-group ref="form"
        :form='detail'
        :config='modal'
        />
    </div>
    <!-- content   end-->

  </div>
</template>
<script>
import TopToolBar from '@/components/Common/TopToolBar.vue'
import FormGroup from '@/components/formGroup.vue'
import { mapState, mapActions } from 'vuex'
import { ENTERPRISE_TYPE } from '@/assets/js/const'
export default {
  data() {
    return {
      // 默认参数
      detail: {},
      modal: [
        {
          name: '企业名称',
          type: 'string',
          data: 'orgInfoName',
          span: 12,
          readonly: true
        },
        {
          name: '注册地址',
          type: 'string',
          data: 'orgInfoName',
          span: 12,
          readonly: true
        },
        {
          name: '企业类型',
          type: 'select',
          data: 'projectType',
          span: 12,
          options:ENTERPRISE_TYPE,
          readonly: true
        },
        {
          name: '生产地址',
          type: 'string',
          data: 'productAddress',
          span: 12,
          readonly: true
        },
        {
          name: '法人姓名',
          type: 'string',
          data: 'legalName',
          span: 12,
          readonly: true
        },
        {
          name: '法人身份证号',
          type: 'string',
          data: 'legalCard',
          span: 12,
          readonly: true
        },
        {
          name: '法人联系电话',
          type: 'string',
          data: 'legalPhone',
          span: 12,
          readonly: true
        },
        {
          name: '通讯地址',
          type: 'string',
          data: 'mailingAddress',
          span: 12,
          readonly: true
        },
        {
          name: '电子信箱',
          type: 'string',
          data: 'legalEmail',
          span: 12,
          readonly: true
        },
        {
          name: '传真',
          type: 'string',
          data: 'fax',
          span: 12,
          readonly: true
        },
        {
          name: '2017年营业额（万元）',
          type: 'string',
          data: 'turnover',
          span: 12,
          readonly: true
        },
        {
          name: '网址',
          type: 'string',
          data: 'url',
          span: 12,
          readonly: true
        },
        {
          name: '被授权人姓名',
          type: 'string',
          data: 'authorizedName',
          span: 12,
          readonly: true
        },
        {
          name: '注册资金（万元）',
          type: 'string',
          data: 'registeredCapital',
          span: 12,
          readonly: true
        },
        {
          name: '被授权人联系电话',
          type: 'string',
          data: 'authorizedPhone',
          span: 12,
          readonly: true
        },
        {
          name: '邮政编码',
          type: 'string',
          data: 'postalCode',
          span: 12,
          readonly: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(['orgInfo'])
  },
  created() {
    let id = this.$route.params.id
    this.orgInfo({ projectApplyId: id }).then(res => {
      let details = res.content.data
      if(details.registeredCapital==null){
        details.registeredCapital = '保密'
      }
      if(details.turnover==null){
        details.turnover = '保密'
      }
      this.detail = res.content.data
    })
  },
  components: { TopToolBar, FormGroup }
}
</script>
