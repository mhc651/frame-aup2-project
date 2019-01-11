// 组件列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='历史报价查询'>
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
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '第一轮报价',
          key: 'p1DecryptPrice'
        },
        {
          title: '第二轮报价',
          key: 'p2DecryptPrice'
        },
        {
          title: '注册证编号',
          key: 'registerCardNo',
          align: 'center'
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
          title: '规格',
          key: 'standard'
        },
        {
          title: '型号',
          key: 'model'
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
      'historyOfferList',
      'typegroupAndAttibuteListByGrouptypeId',
      'manageType',
      'subGroupId',
      'deleteGroupId',
      'revokeGroupId'
    ]),
    /**
     * 跳转至公示产品
     * @param {Object} 当条数据
     */
    gotoPro(data) {
      this.$router.push({ name: '产品公示', params: { id: data.id } })
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
    // 切换
    tabTable(index) {
      this.active = index
      let table = this.tables[index]
      this.$refs['table'].getParamData({
        size: table.size,
        page: table.page,
        aup2PublicityStatus: table.aup2PublicityStatus
      })
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      // 默认
      // if (!param.aup2PublicityStatus) param.aup2PublicityStatus = 1
      // for (let i = 0; i < this.tables.length; i++) {
      //   let item = this.tables[i]
      //   // 当前tab
      //   if (param.aup2PublicityStatus == item.aup2PublicityStatus) {
      //     if (this.active != i) this.active = i
      //     break
      //   }
      // }
      let table = this.table_now
      table.size = param.size
      // 管理分类转换
      if (param.managementType == 0) param.managementType = ''
      this.historyOfferList(param).then(res => {
        table.total = res.content.total
        table.data = res.content.records
        table.page = res.content.page
      })
    },
    /**
     * 批量删除
     */
    deleteTable() {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length)
        return this.$Modal.warning({ content: '请选择要删除的对象！' })
      this.$Modal.confirm({
        content: '确定删除吗？此操作不可逆',
        onOk: () => {
          let checkoutId = checkout.map(val => val.id).join(',')
          this.deleteGroupId({ ids: checkoutId }).then(res => {
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
        return this.$Modal.warning({ content: '请选择要提交的对象！' })
      this.disabledSub = true
      let checkoutId = checkout.map(val => val.id).join(',')

      let param = { ids: checkoutId, isSubmitZcz: '' }
      this.subGroupId(param).then(
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
      this.subGroupId(param).then(
        res => {
          this.$Message.success({ content: `提交成功！` })
          // reloade table
          this.disabledSub = false
          this.$refs['table'].getData()
        },
        err => {
          this.disabledSub = false
        }
      )
    },
    /***
     * 撤回
     * */
    revokeTable() {
      let checkout = this.$refs['table'].checkout
      if (!checkout.length)
        return this.$Modal.warning({ content: '请选择要撤回的对象！' })
      this.disabledRevoke = true
      let checkoutId = checkout.map(val => val.id).join(',')
      this.revokeGroupId({ ids: checkoutId }).then(
        res => {
          this.$Message.success({ content: `提交成功！` })
          this.disabledRevoke = false
          this.$refs['table'].getData()
        },
        err => {
          this.disabledRevoke = false
        }
      )
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


