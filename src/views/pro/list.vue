// 产品列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='产品管理'>
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
       <!-- top tab -->
        <div class="head-tab">
          <a class="head-tab_btn" v-for="(val,index) in tables" :key="index" :class='index === active?"active":""' @click="tabTable(index)" > {{ val.name }}
            <!-- <Badge :count="val.allTotal" :overflow-count="reviewNum.max" /> -->
          </a>
        </div>
        <!-- top tab end-->
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
          <Button v-if='active == 0'  type="primary" @click='gotoAdd'>添加产品</Button>
          <Button  v-if='active == 0 ||active == 4 '  @click='editTable'>编辑</Button>
          <Button v-if='active == 0'  @click="deleteTable" type="error">批量删除</Button>
          <Button :disabled='disabledSub' v-if='active == 0' @click="subTable" type="primary">批量提交</Button>
          <Button :disabled='disabledRevoke' v-if='active == 1' @click="revokeTable" type="primary">撤回审核</Button>
        </div>
    </div>
    <!-- content  end-->
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import TablePage from '../../components/tablePage.vue'
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
      page: 1,
      auditStatus: 1
      // 筛选
    })
    tables.push({
      name: '待审核',
      size: PAGE_SIZE_ARR[0],
      data: [],
      total: 0,
      page: 1,
      auditStatus: 2
    })
    tables.push({
      name: '审核中',
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      data: [],
      auditStatus: 3
    })

    tables.push({
      name: '已通过',
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      data: [],
      auditStatus: 4
    })
    tables.push({
      name: '未通过',
      size: PAGE_SIZE_ARR[0],
      total: 0,
      data: [],
      page: 1,
      auditStatus: 5
    })
    let table_th = [
      {
        type: 'selection',
        width: 60,
        align: 'center'
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
                    name: '单一规格详情',
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
                    name: '单一规格详情',
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

    return {
      disabledRevoke: false,
      disabledSub: false,
      // 当前状态选择
      active: 0,
      // 分页数组
      PAGE_SIZE_ARR,
      qualityLists: {},
      tables,
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
      'manageType',
      'subProId',
      'deleteProId',
      'revokeProId',
      'typegroupAndAttibuteListByGrouptypeId'
    ]),
    /**
     * 新增
     */
    gotoAdd() {
      this.clickLinkGoToBack()
      this.$router.push('/LCSB/LCSB005/page/?edit=1')
    },
    // 预设返回列表地址
    clickLinkGoToBack() {
      window.go_to_back = this.$route.path
    },
    // 切换
    tabTable(index) {
      this.active = index
      let table = this.tables[index]
      this.$refs['table'].getParamData({
        size: table.size,
        page: table.page,
        auditStatus: table.auditStatus
      })
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      // 默认
      if (!param.auditStatus) param.auditStatus = 1
      for (let i = 0; i < this.tables.length; i++) {
        // 当前tab
        let item = this.tables[i]
        if (param.auditStatus == item.auditStatus) {
          if (this.active != i) this.active = i
          break
        }
      }
      let table = this.table_now
      table.size = param.size
      // 管理分类转换
      if (param.managementType == 0) param.managementType = ''
      if (param.aup2ProjectTypeGroupId == 0) param.aup2ProjectTypeGroupId = ''
      if (param.aup2ProjectTypeId == 0) param.aup2ProjectTypeId = ''
      this.proList(param).then(res => {
        this.table_now.total = res.content.total
        this.table_now.data = res.content.records
        this.table_now.page = res.content.page
      })
    },
    /**
     * 编辑
     */
    editTable() {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length) {
        return this.$Message.warning({ content: '请选择要编辑的对象！' })
      } else if (checkout.length > 1) {
        return this.$Message.warning({ content: '只能选择一个对象进行编辑！' })
      }
      this.clickLinkGoToBack()
      this.$router.push({
        name: '单一规格详情',
        params: { id: checkout[0].id },
        query: {
          edit: 1
        }
      })
    },
    /**
     * 批量删除
     */
    deleteTable() {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length)
        return this.$Message.warning({ content: '请选择要删除的对象！' })
      this.$Modal.confirm({
        content: '确定删除吗？此操作不可逆',
        onOk: () => {
          let checkoutId = checkout.map(val => val.id).join(',')
          this.deleteProId({ ids: checkoutId }).then(res => {
            // reloade table
            this.$refs['table'].getData()
          })
        }
      })
    },
    /**
     * 批量提交
     */
    subTable() {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length)
        return this.$Message.warning({ content: '请选择要提交的对象！' })
      this.disabledSub = true
      let checkoutId = checkout.map(val => val.id).join(',')
      let param = { ids: checkoutId, isSubmitZcz: '' }
      this.subProId(param).then(
        res => {
          // reloade table
          if (res.content.suc) {
            this.$Message.success({ content: `提交成功！` })
            this.$refs['table'].getData()
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
      this.subProId(param).then(res => {
        this.$Message.success({ content: `提交成功！` })
        this.disabledSub = false
        // reloade table
        this.$refs['table'].getData()
      })
    },
    /***
     * 撤回
     * */
    revokeTable() {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length)
        return this.$Message.warning({ content: '请选择要撤回的对象！' })
      this.disabledRevoke = true
      let checkoutId = checkout.map(val => val.id).join(',')
      this.revokeProId({ ids: checkoutId }).then(
        res => {
          this.$Message.success({ content: `撤回成功！` })
          this.disabledRevoke = false
          this.$refs['table'].getData()
        },
        err => {
          this.disabledRevoke = false
        }
      )
    },
    //质量层次列表处理
    initQualityList(data) {
      if (data != null) {
        this.qualityLists = {'0':'全部'}
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
  components: { TopToolBar, TablePage }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>


