// 组件列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='入选公示'>
          <span slot="content">
            <strong class="help">说明</strong>
            <p>
            无
            </p>
          </span>

      </top-tool-bar>
    <!-- title end-->
    <!-- content  -->
    <div class="page-container">
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
          @on-row-click='gotoPro'
          :storage ="'aup2org' +  $route.path"
         />
        <!-- table end-->
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
      name: '未公示',
      data: [],
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1
      //aup2PublicityStatus: 1
      // 筛选
    })
    return {
      disabledRevoke: false,
      disabledSub: false,
      // 当前状态选择
      active: 0,
      // 分页数组
      PAGE_SIZE_ARR,
      tables,
      project_class: {},
      project_type: {},
      /**
       * 竞价分组
       * @namespace
       */
      project_type2: {},
      // table thead
      table_th: [
        {
          title: '最终入选价格',
          key: 'finalSelectedPrice'
        },
        {
          title: '最终入选备注',
          key: 'finalSelectedNote'
        },
        {
          title: '最终入选公示状态',
          key: 'finalSelectedStatusStr'
        },
        {
          title: '产品名称',
          key: 'name'
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
          key: 'model'
        },
        {
          title: '规格',
          key: 'standard'
        },
        {
          title: '竞价分组',
          key: 'aup2ProjectTypeGroupName'
        }
      ]
    }
  },
  computed: {
    // ...mapState(['into']),
    // 当前表格
    table_now() {
      return this.tables[0]
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
          data: 'manufactureName',
          name: '生产企业',
          type: 'string'
        },
        {
          data: 'orgInfoName',
          name: '申报企业',
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
              let arr = {}
              for (let item of res.content.subGroupList) {
                arr[item.id] = item.name
              }
              console.log(arr)
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
          data: 'finalSelectedStatus',
          name: '请选择最终入选状态',
          type: 'select',
          value: '2',
          options: { 2: '最终入选', 3: '最终未入选', 4: '已淘汰' }
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
      'finalSelPubList',
      'typegroupAndAttibuteListByGrouptypeId',
      'manageType'
    ]),
    /**
     * 跳转至公示产品
     * @param {Object} 当条数据
     */
    gotoPro(data) {
      this.$router.push({
        name: '产品公示',
        params: { id: data.id },
        
      })
    },

    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      let table = this.table_now
      table.size = param.size
      // 管理分类转换
      if (param.managementType == 0) param.managementType = ''
      this.finalSelPubList(param).then(res => {
        table.total = res.content.total
        table.data = res.content.records
        table.page = res.content.page
      })
    }
  },
  created() {
    // 分组类别
    this.$store.dispatch('apply/categories').then(res => {
      this.project_class = res.content.auctionGroup
    })
    // 管理类型
    this.manageType().then(res => {
      this.project_type = { 0: '全部' }
      for (let item of res.content) {
        this.project_type[item.code] = item.text
      }
    })
  },
  components: { TopToolBar, TablePage }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>


