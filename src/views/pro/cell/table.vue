
// 组件选择列表
<template>
  <div>
    <table-page
      ref="table"
      :data='data'
      :pagerSizeArr='[5,10,15,20]'
      :total='total'
      :columns ='columns'
      :page='page'
      :pageSize='5'
      :filter='filter'
      :getDataFn='initTable'
     
    ></table-page>
  </div>
</template>
<script>
import { PAGE_SIZE_ARR } from '../../../assets/js/const'
import TablePage from '../../../components/tablePage.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      PAGE_SIZE_ARR,
      data: [],
      total: 0,
      page: 1,
      // table thead
      columns: [
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
          title: '产品数量',
          key: 'proSum'
        }
      ],
      project_class: {},
      project_type: {},
      type_area: {}
    }
  },
  computed: {
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
          data: 'manufactureName',
          name: '生产企业',
          type: 'string'
        },
        {
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          type: 'select',
          options: this.project_class
        },
        {
          data: 'managementType',
          name: '请选择管理类别',
          type: 'select',
          options: this.project_type
        },
        {
          data: 'auditStatus',
          name: '请选择审核状态',
          type: 'select',
          options: {
            0: '全部',
            1: '待提交',
            2: '待审核',
            3: '审核中',
            4: '审核通过',
            5: '审核未通过'
          }
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
      'manageType',
      'subGroupId',
      'deleteGroupId',
      'groupList',
      'productAddr'
    ]),
    initTable(params) {
      if (params.managementType == 0) params.managementType = ''
      if (params.aup2ProjectTypeGroupId == 0) params.aup2ProjectTypeGroupId = ''
      if (params.aup2ProjectTypeId == 0) params.aup2ProjectTypeId = ''
       if (params.auditStatus == 0) params.auditStatus = ''
      this.groupList(params).then(res => {
        this.data = res.content.records
        this.total = res.content.total
      })
    },
    getTable() {
      return this.$refs['table']
    },
    /**
     *  x
     *  @param {Array} checkout table checkout
     */
    errorTableChange(checkout) {
      if (validateChange.length > 2) {
        this.$Message.warning({ content: '只能选择一个对象' })
      }
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
      this.project_type= { 0: '全部' }
      for (let item of res.content) {
        this.project_type[item.code] = item.text
      }
    })
    // 地区类型
    this.productAddr().then(res => {
      for (let item of res.content) {
        this.type_area[item.code] = item.text
      }
    })
  },
  components: { TablePage }
}
</script>
