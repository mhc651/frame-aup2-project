// 组件列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='报价管理'>
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
        <!-- table -->
        <Table
          ref="table"
          :columns='columns'
          :data = 'data'
          @on-select='checkTable'
        @on-select-all='checkTable'
        @on-select-cancel='checkTable' border
         />
        <!-- table end-->
        <div style="margin-top:15px">
          <Button type="primary" @click='gotopage({name:"报价设置"})' >进入报价管理</Button>
        <Button  type="primary"  @click='gotopage({name:"入选管理"})'>进入入选管理</Button>
        </div>
    </div>
    <!-- content  end-->
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      data: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '轮次',
          key: 'name',
          align: 'center'
        },
        {
          title: '报价开始时间',
          key: 'offerStart',
          align: 'center'
        },
        {
          title: '报价结束时间',
          key: 'offerEnd',
          align: 'center'
        },
        {
          title: '解密开始时间',
          key: 'decryptStart',
          align: 'center'
        },
        {
          title: '解密结束时间',
          key: 'decryptEnd',
          align: 'center'
        },
        {
          title: '待报价数量',
          key: 'waitofferSum',
          align: 'center'
        },
        {
          title: '待解密数量',
          key: 'waitdecryptSum',
          align: 'center'
        },
        {
          title: '已解密数量',
          key: 'alreadydecryptSum',
          align: 'center'
        },
        {
          title: '报价状态',
          key: 'offerConfigState',
          align: 'center'
        },
        {
          title: '解密状态',
          key: 'decryptConfigState',
          align: 'center'
        }
      ],
      selection: []
    }
  },
  methods: {
    ...mapActions(['offterAll']),

    /**
     * 跳转到对应页面
     * @param {Object} path $router路由参数
     */
    gotopage(path) {
      if (this.selection.length > 1) {
        return this.$Message.warning({
          content: `${path.name}的对象只能有一个`
        })
      } else if (!this.selection.length) {
        return this.$Message.warning({ content: `请选择要${path.name}的对象` })
      }
      /**
       * 报价时间配置
       * @namespace
       * */
      this.$store.commit({
        type: 'offterConfig',
        content: this.selection[0]
      })
      /**
       * 跳转
       */
      this.$router.push({
        name: path.name,
        params: { id: this.selection[0].id }
      })
    },
    // 预设详情返回列表
    clickLinkGoToBack() {
      window.go_to_back = this.$route.path
    },
    // /**
    //  * 设置选中
    //  * @param {Array} selection 已选项数据
    //  * */
    checkTable(selection) {
      this.selection = selection
    },
    /**
     * 初始化表格
     * @param {Object} param 筛选数据
     */
    initTable() {
      // 管理分类转换
      this.offterAll({}).then(res => {
        this.data = res.content
      })
    }
  },
  created() {
    this.initTable()
  },
  components: { TopToolBar }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>


