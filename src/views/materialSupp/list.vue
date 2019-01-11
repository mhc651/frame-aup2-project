// 产品列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='产品价格维护'>
          <span slot="content">
            <strong class="help">说明</strong>
            <p>
            无
            </p>
          </span>
           <!-- <Button slot="btn" type="primary" @click='$router.push("/LCSB/LCSB005/page/?edit=1")'>新增</Button> -->
      </top-tool-bar>
    <!-- title end-->
    <!-- content  -->
    <div class="page-container">
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
          <Button v-if='active == 0'  type="primary" @click='editTable'>价格维护</Button>
        </div>
    </div>
    <!-- content  end-->
       <!-- 组件选择 -->
    <my-modal  v-model="modal.bool"
      title="请选择"
      width='650'
      @on-close = "modal.bool = false"
      @on-ok = 'subServer'
    >
    <div style="margin-top:10px;">
       <Form ref="form" :model="modal" :label-width="170"  :rules='validate' >
         <Row type="flex"  align='middle'  :gutter='15' class="modal-form">
           <Col span="16 ">
            <FormItem label="2018宁德最低价（元）" prop="ndzdj_2018">
              <Input v-model="modal.ndzdj_2018" />
            </FormItem>
           </Col>
           <Col span="8">
              请填写最小使用单位的价格
            </Col>
             <Col span="16">
            <FormItem label="2018宁德最低价采购医院" prop="ndzdjcgyy_2018">
              <Input v-model="modal.ndzdjcgyy_2018" />
            </FormItem>
           </Col>
           <Col span="8">
              必须为宁德市县级以上医院
            </Col>
             <Col span="16  " >
            <FormItem label="2018福建省最低价" prop="fjszdj_2018">
              <Input v-model="modal.fjszdj_2018" />
            </FormItem>
           </Col>
           <Col span="8">
              请填写最小使用单位的价格
            </Col>
             <Col span="16  " >
            <FormItem label="2018福建省最低价采购医院" prop="fjszdjcgyy_2018">
              <Input v-model="modal.fjszdjcgyy_2018" />
            </FormItem>
           </Col>
           <Col span="8">
              必须为福建省其他地市县级以上医院
            </Col>
         </Row>
       </Form> 
       <!-- 说明 -->
        <ol style="padding-left:50px; color:#f00;margin-top:10px;">
          <li>宁德最低价和福建省最低价至少填写一项</li>
          <li>价格必须真实，管理单位会核实价格</li>
          <li>最低价（元）：保留小数点后2位（即：0.01），如果超出小数点后2位，则舍去。</li>
        </ol>
       <!-- 说明 end-->
    </div>
    </my-modal>
    <!-- 组件选择 end-->
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import TablePage from '../../components/tablePage.vue'
import MyModal from '@/components/myModal.vue'
import validatejs from '../../assets/js/validate.js'
import { mapState, mapActions } from 'vuex'
import { PAGE_SIZE_ARR } from '../../assets/js/const'
export default {
  data() {
    // 模块
    let tables = []
    tables.push({
      name: '待提交',
      data: [],
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1
      // 筛选
    })
    let table_th = [
      {
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '操作',
        render: (h, r) => {
          return h(
            'a',
            {
              on: {
                click: () => {
                  this.getTableData(r.row.id)
                }
              }
            },
            ' 价格维护'
          )
        }
      },
      {
        title: '2018宁德最低价',
        key: 'ndzdj_2018',
        className: 'td--red'
      },
      {
        title: '福建省最低价',
        className: 'td--red',
        key: 'fjszdj_2018'
      },
      {
        title: '产品名称',
        key: 'productName'
      },
      {
        title: '生产企业名称',
        key: 'orgInfoName'
      },
      {
        title: '注册证编号',
        key: 'registerCardNo'
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
        key: 'model',
        render: (h, r) => {
          return h(
            'a',
            {
              on: {
                click: () => {
                  this.clickLinkGoToBack()
                  this.$router.push({
                    name: '产品公示',
                    params: { id: r.row.id }
                  })
                }
              }
            },
            r.row.model
          )
        }
      },

      {
        title: '规格',
        key: 'standard',
        render: (h, r) => {
          return h(
            'a',
            {
              on: {
                click: () => {
                  this.clickLinkGoToBack()

                  this.$router.push({
                    name: '产品公示',
                    params: { id: r.row.id }
                  })
                }
              }
            },
            r.row.standard
          )
        }
      },
      {
        title: '竞价分组',
        key: 'aup2ProjectTypeGroupName'
      },
      {
        title: '质量层次',
        key: 'qualityName'
      }
    ]
    let that = this
    return {
      disabledRevoke: false,
      disabledSub: false,
      // 当前状态选择
      active: 0,
      // 分页数组
      PAGE_SIZE_ARR,
      qualityLists: {},
      tables,
      modal: {
        bool: false,
        id: '',
        ndzdj_2018: '', //2018宁德最低价,
        ndzdjcgyy_2018: '', //2018宁德最低价采购医院
        fjszdj_2018: '', //2018福建省最低价
        fjszdjcgyy_2018: '' //2018福建省最低价采购医院
      },
      // 验证
      validate: {
        ndzdj_2018: [
          {
            trigger: 'blur',
            validator(rule, value, callback) {
              // 格式验证
              if (that.modal.ndzdj_2018) {
                value = Number(value)
                if (String(value) == 'NaN' || value < 0) {
                  callback('最低价格式错误')
                } else {
                  // 成功
                  that.modal.ndzdj_2018 = value.toFixed(2)
                  callback()
                  // that.$refs.form.validateField('fjszdj_2018')
                }
              } else if (!that.modal.fjszdj_2018 && !that.modal.ndzdj_2018) {
                callback(new Error('宁德最低价和福建省最低价至少填写一项'))
              } else {
                // 成功
                callback()
              }
            }
          }
        ],
        ndzdjcgyy_2018: [
          {
            trigger: 'blur',
            validator(rule, value, callback) {
              //
              if (that.modal.ndzdj_2018 && !value) {
                callback(new Error('2018宁德最低价采购医院不能为空'))
              } else {
                callback()
              }
            }
          }
        ],
        fjszdj_2018: [
          {
            trigger: 'blur',
            validator(rule, value, callback) {
              // 格式验证
              if (that.modal.fjszdj_2018) {
                value = Number(value)
                if (String(value) == 'NaN'|| value < 0) {
                  callback('最低价格式错误')
                } else {
                  // 成功
                  that.modal.fjszdj_2018 = value.toFixed(2)
                  callback()
                  // that.$refs.form.validateField('ndzdj_2018')
                }
              } else if (!that.modal.fjszdj_2018 && !that.modal.ndzdj_2018) {
                callback(new Error('宁德最低价和福建省最低价至少填写一项'))
              } else {
                // 成功
                callback()
              }
            }
          }
        ],
        fjszdjcgyy_2018: [
          {
            trigger: 'blur',
            validator(rule, value, callback) {
              //
              if (that.modal.fjszdj_2018 && !value) {
                callback(new Error('2018福建省最低价采购医院不能为空'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      /**
       * 产品分类
       * @namespace
       */
      project_class: {},
      /**
       * 管理类型
       * @namespace
       */
      project_type: {},
      /**
       * 竞价分组
       * @namespace
       */
      project_type2: {},
      // table thead
      table_th,
      // 竞价分组
      typegroupAndAttibuteListByGrouptype: ''
    }
  },
  computed: {
    // ...mapState(['into']),
    // 当前表格
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
          data: 'packUnit',
          name: '包装单位',
          type: 'string'
        },
        {
          data: 'minUnit',
          name: '最小使用单位',
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
          data: 'qualityId',
          name: '请选择质量层次',
          type: 'select',
          options: this.qualityLists
        },
        {
          data: 'aup2ProjectTypeGroupId',
          name: '请选择竞价组',
          type: 'select',
          options: this.project_type2
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
      'proList',
      'qualityList',
      'addProDataUpdate',
      'addProData',
      'addProDataDetail',
      'manageType',
      'subProId',
      'deleteProId',
      'revokeProId',
      'typegroupAndAttibuteListByGrouptypeId'
    ]),
    // 预设返回列表地址
    clickLinkGoToBack() {
      window.go_to_back = this.$route.path
    },
    /**
     * 修改报价
     */
    editTable(data) {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length) {
        return this.$Message.warning({ content: '请选择要设置的对象！' })
      } else if (checkout.length > 1) {
        return this.$Message.warning({ content: '设置的对象只能有一个！' })
      }
      this.getTableData(checkout[0].id)
    },
    getTableData(id) {
      if (id) {
        this.addProDataDetail({ id }).then(serve => {
          this.modal.id = id
          for (let k in serve.content.attributeJson) {
            this.modal[k] = serve.content.attributeJson[k]
          }
          this.modal.bool = true
        })
      }
    },
    subServer() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let json = JSON.parse(JSON.stringify(this.modal))
          let param = {
            id: json.id
          }
          delete json.id
          delete json.bool
          param.attributeJson = json
          this.addProDataUpdate(param).then(serve => {
            this.$Message.success(serve.content)
            this.modal.bool = false
            this.$refs.table.getData()
          })
        }
      })
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      // 默认
      // if (!param.auditStatus) param.auditStatus = 1
      // for (let i = 0; i < this.tables.length; i++) {
      //   // 当前tab
      //   let item = this.tables[i]
      //   if (param.auditStatus == item.auditStatus) {
      //     if (this.active != i) this.active = i
      //     break
      //   }
      // }
      let table = this.table_now
      table.size = param.size
      // 管理分类转换
      if (param.managementType == 0) param.managementType = ''
      if (param.aup2ProjectTypeGroupId == 0) param.aup2ProjectTypeGroupId = ''
      if (param.aup2ProjectTypeId == 0) param.aup2ProjectTypeId = ''
      if (param.qualityId == 0) param.qualityId = ''
      this.addProData(param).then(res => {
        this.table_now.total = res.content.total
        this.table_now.data = res.content.records
        this.table_now.page = res.content.page
      })
    },
    //质量层次列表处理
    initQualityList(data) {
      if (data != null) {
        this.qualityLists = { '0': '全部' }
        for (let item of data) {
          this.qualityLists[item.code] = item.text
        }
      }
    },
    //获取质量层次列表
    getQualityList() {
      return this.qualityList().then(
        res => {
          this.initQualityList(res.content)
          this.loading = false
          return Promise.resolve(res)
        },
        err => {
          this.loading = false
          return Promise.reject(res)
        }
      )
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
      this.project_type = { '0': '全部' }
      for (let item of res.content) {
        this.project_type[item.code] = item.text
      }
    })
    // 质量层次列表
    this.getQualityList()
  },
  components: { TopToolBar, TablePage, MyModal }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>
<style>
.modal-form .ivu-col {
  padding-bottom: 20px;
}
</style>


