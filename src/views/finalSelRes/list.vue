// 产品列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='入选结果'>
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
      name: '最终入选',
      size: PAGE_SIZE_ARR[0],
      data: [],
      total: 0,
      page: 1,
      finalSelectedStatus: 2
    })
    tables.push({
      name: '最终未入选',
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      data: [],
      finalSelectedStatus: 3
    })

    tables.push({
      name: '已淘汰',
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      data: [],
      finalSelectedStatus: 4
    })
    let table_th = [
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

    return {
      disabledRevoke: false,
      disabledSub: false,
      // 当前状态选择
      active: 0,
      // 分页数组
      PAGE_SIZE_ARR,
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
      'finalSelResList',
      'manageType',
      'subProId',
      'deleteProId',
      'revokeProId',
      'typegroupAndAttibuteListByGrouptypeId'
    ]),
    /**
     * 跳转至公示产品
     * @param {Object} 当条数据
     */
    gotoPro(data) {
      this.$router.push({
        name: '产品公示',
        params: { id: data.id },
        query: { self: 1 }
      })
    },
    // 切换
    tabTable(index) {
      this.active = index
      let table = this.tables[index]
      this.$refs['table'].getParamData({
        size: table.size,
        page: table.page,
        finalSelectedStatus: table.finalSelectedStatus
      })
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      // 默认
      if (!param.finalSelectedStatus) param.finalSelectedStatus = 2
      for (let i = 0; i < this.tables.length; i++) {
        // 当前tab
        let item = this.tables[i]
        if (param.finalSelectedStatus == item.finalSelectedStatus) {
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
      this.finalSelResList(param).then(res => {
        this.table_now.total = res.content.total
        this.table_now.data = res.content.records
        this.table_now.page = res.content.page
      })
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
  },
  components: { TopToolBar, TablePage }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>


