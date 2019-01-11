// 组件列表
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
          <!-- <big slot="btn">
            距报价截止还剩：
            <span class="text--red">{{ date_show||'截止' }}</span>
          </big> -->
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
          class="table--link"
          :filter='filter'
          ref="table"
          :columns='table_now.columns'
          :getDataFn='initTable'
          :pagerSizeArr= 'PAGE_SIZE_ARR'
          :pagerSize= 'table_now.size'
          :data = 'table_now.data'
          :total = 'table_now.total'
          :setPage = 'table_now.page'
           @on-row-click='gotoPro'
          storage ='aup2org/BJGL/BJGL001'
         />
        <!-- table end-->
    </div>
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import TablePage from '../../components/tablePage.vue'
import FormGroup from '@/components/formGroup.vue'
import { mapState, mapActions } from 'vuex'
import { PAGE_SIZE_ARR, SELECT_TYPE } from '../../assets/js/const'
import { toTimeDate } from '../../assets/js/common'
export default {
  data() {
    // 模块
    let tables = []
    tables.push({
      active: '0',
      name: '本企业',
      data: [],
      size: PAGE_SIZE_ARR[0],
      total: 0,
      page: 1,
      columns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '入选价格',
          key: 'price'
        },
        {
          title:'价格分',
          key:'priceScore'
        },
        {
          title: '综合分',
          key: 'compositeScore'
        },
        {
          title: '备注（理由）',
          key: 'selectedNote'
        },
        {
          title: '公示状态',
          key: 'selectedState',
          render: (h, r) => {
            return h('span', SELECT_TYPE[r.row.selectedState])
          }
        },
        {
          title: '产品名称',
          key: 'name'
        },
        {
          title: '生产企业',
          key: 'manufactureName'
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
          title: '型号',
          key: 'model'
        },
        {
          title: '规格',
          key: 'standard'
        },
        {
          title: '分组',
          key: 'aup2ProjectTypeGroupName'
        },
        {
          title: '质量层次',
          key: 'qualityName'
        }
      ]
    })
    tables.push({
      active: 1,
      name: '所有企业',
      size: PAGE_SIZE_ARR[0],
      data: [],
      total: 0,
      page: 1,
      columns: [
        // {
        //   type: 'selection',
        //   width: 60,
        //   align: 'center'
        // },
        {
          title: '价格分',
          key: 'priceScore'
        },
        {
          title: '综合分',
          key: 'compositeScore'
        },
        {
          title: '公示状态',
          key: 'selectedState',
          render: (h, r) => {
            return h('span', SELECT_TYPE[r.row.selectedState])
          }
        },
        {
          title: '产品名称',
          key: 'name'
        },
        {
          title: '生产企业',
          key: 'manufactureName'
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
          title: '型号',
          key: 'model'
        },
        {
          title: '规格',
          key: 'standard'
        },
        {
          title: '分组',
          key: 'aup2ProjectTypeGroupName'
        },
        {
          title: '质量层次',
          key: 'qualityName'
        }
      ]
    })

    return {
      id: this.$route.params.id,
      // 当前状态选择
      active: 0,
      // 分页数组
      PAGE_SIZE_ARR,
      // 表格配置
      tables,
      // 产品分类
      project_class: {},
      //
      project_type: {},
      // 竞价分组
      project_type2: {},
      // 质量层次
      project_type3: {},
      // 计时器
      timeOut: ''
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
          data: 'name',
          name: '产品名称',
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
          data: 'standard',
          name: '规格',
          type: 'string'
        },
        {
          data: 'modal',
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
          data: 'aup2ProjectTypeGroupId',
          name: '请选择竞价组',
          type: 'select',
          options: this.project_type2
        },
        {
          data: 'qualityId',
          name: '请选择质量层次',
          type: 'select',
          options: this.project_type3
        },
        {
          data: 'selectedState',
          name: '请选择入选状态',
          type: 'select',
          options: SELECT_TYPE,
          default: '2'
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
      'groupList',
      'manageType',
      'subGroupId',
      'commitOffter',
      'offterList',
      'qualityList',
      'recokeOffter',
      'decryptOffter',
      'offterShowList',
      'typegroupAndAttibuteListByGrouptypeId'
    ]),
    /**
     * 跳转至公示产品
     * @param {Object} 当条数据
     */
    gotoPro(data) {
      this.$router.push({ name: '入选公示', params: { id: data.productId } })
    },
    // 预设详情返回列表
    clickLinkGoToBack() {
      window.go_to_back = this.$route.path
    },
    // 切换
    tabTable(index) {
      this.active = index
      let table = this.table_now
      this.$refs['table'].getParamData({
        active: index,
        size: table.size,
        page: table.page
      })
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable(param) {
      // 获得当前焦点 storage 用
      if (!param.active) {
        param.active = 0
      } else if (this.active != param.active) {
        this.active = param.active
      }
      let table = this.table_now
      // 管理分类转换
      if (param.managementType == 0) param.managementType = ''
      if (param.aup2ProjectTypeGroupId == 0) param.aup2ProjectTypeGroupId = ''
      if (param.aup2ProjectTypeId == 0) param.aup2ProjectTypeId = ''
      param.configId = this.id
      if (param.qualityId == 0) param.qualityId = ''
      param.configId = this.id

      // 全部可见
      this.offterShowList(param).then(res => {
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
      this.project_class['0'] = '全部'
    })
    // 管理类型
    this.manageType().then(res => {
      this.project_type = { 0: '全部' }
      for (let item of res.content) {
        this.project_type[item.code] = item.text
      }
    })
      // 质量层次
    this.qualityList().then(res => {
      this.project_type3 = { 0: '全部' }
      for (let item of res.content) {
        this.project_type3[item.code] = item.text
      }
    })
  },
  components: { TopToolBar, TablePage }
}
</script>
<style lang="scss" src='../../assets/css/page.scss'></style>


