
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='企业入围公示'>
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
       <!-- top tab -->
        <!--<div class="head-tab">-->
          <!--<a class="head-tab_btn" v-for="(val,index) in tables" :key="index" :class='index === active?"active":""' @click="tabTable(index)" > {{ val.name }}-->
            <!--&lt;!&ndash; <Badge :count="val.allTotal" :overflow-count="reviewNum.max" /> &ndash;&gt;-->
          <!--</a>-->
        <!--</div>-->
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
    </div>
    <!-- content  end-->
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import TablePage from '../../components/tablePage.vue'
import { mapState, mapActions } from 'vuex'
import { PAGE_SIZE_ARR, ENTERPRISE_TYPE } from '../../assets/js/const'
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
    })
    return {
      // 分页数组
      PAGE_SIZE_ARR,
      tables,
      enterprise_type: ENTERPRISE_TYPE,
      // table thead
      table_th: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '企业名称',
          key: 'orgInfoName',
          align: 'center',
          render: (h, r) => {
            return h(
              'a',
              {
                on: {
                  click: () => {
                    this.clickLinkGoToBack()
                    this.$router.push({
                      name: '企业入围公示详情',
                      params: { id: r.row.id }
                    })
                  }
                }
              },
              r.row.orgInfoName
            )
          }
        },
        {
          title: '企业类型',
          key: 'projectType',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleFormatStatus(r.row.projectType))
          }
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
          data: 'orgName',
          name: '企业名称',
          type: 'string'
        },
        {
          data: 'projectType',
          name: '请选择企业类型',
          type: 'select',
          options: this.enterprise_type
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
      'enterpriseEntryList',
      'typegroupAndAttibuteListByGrouptypeId',
      'manageType',
      'subGroupId',
      'deleteGroupId',
      'revokeGroupId'
    ]),
    // 提交状态
    handleFormatStatus(status) {
      switch (parseInt(status, 10)) {
        case 1:
          return '生产企业'
        case 2:
          return '代理企业'
      }
    },
    /**
     * 新增页面
     */
    gotoAdd() {
      this.clickLinkGoToBack()
      this.$router.push('/LCSB/LCSB004/page/?edit=1')
    },
    // 预设详情返回列表
    clickLinkGoToBack() {
      window.go_to_back = this.$route.path
    },

    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      let table = this.table_now
      table.size = param.size
      // 管理分类转换
      if (param.projectType == 0) param.projectType = ''
      this.enterpriseEntryList(param).then(res => {
        table.total = res.content.total
        table.data = res.content.records
        table.page = res.content.page
      })
    }
  },
  created() {},
  components: { TopToolBar, TablePage }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>


