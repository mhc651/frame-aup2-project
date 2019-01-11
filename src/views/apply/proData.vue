// 信息
<template>
<div>
      <top-tool-bar title="产品详情">
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
    <!-- content -->
    <div  class="page-container">
          <!-- top tab -->
        <div class="head-tab">
          <a class="head-tab_btn" v-for="(val,index) in datas" :key="index" :class='index === active?"active":""' @click="tabTable(index)" > {{ val.name }}
          </a>
        </div>
        <p style="margin:15px auto">
          申报企业：{{ org }}
        </p>
        <!-- top tab end-->
        <form-group  ref="form"
        :form='data_now.data'
        :config='data_now.config'
         />
    </div>
</div>

</template>

<script>
import TopToolBar from '@/components/Common/TopToolBar.vue'
import FormGroup from '@/components/formGroup.vue'
import { validateNowDate } from '../../assets/js/common.js'
import validatejs from '../../assets/js/validate.js'
import { mapState, mapActions } from 'vuex'
import MyModal from '@/components/myModal.vue'
export default {
  data() {
    let datas = [
      {
        id: '',
        name: '注册证',
        loading: false,
        data: {},
        config: []
      },
      {
        id: '',
        name: '组件',
        loading: false,
        data: {},
        config: []
      },
      {
        id: this.$route.params.id,
        name: '产品',
        loading: true,
        data: {},
        config: []
      }
    ]
    return {
      self: !!this.$route.query.self,
      org: '',
      active: 2,
      // 数据配置
      datas,
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
       * 产地
       */
      type_area: {}
    }
  },
  watch: {
    active(val) {
      if (!this.data_now.loading && val != 2) {
        this.getServer()
      }
    }
  },
  computed: {
    data_now() {
      let data = this.datas[this.active]
      return data
    }
  },
  methods: {
    ...mapActions([
      'pubData',
      'typegroupAndAttibuteListByGrouptypeId',
      'getAttibuteConfigByRegisterId',
      'manageType',
      'productAddr'
    ]),
    /**
     * tab datas
     * @param {Number} index
     */
    tabTable(index) {
      this.active = index
    },
    /**
     * 页面数据
     */
    initData() {
      let obj = this.datas[2]
      this.pubData([2, obj.id]).then(res => {
        let data = res.content.data
        obj.data = data
        this.datas[0].id = data.registerCardId
        this.datas[1].id = data.subGroupId
        this.org = data.orgInfoName
        // key
        let config = [
          {
            name: '所属注册证',
            type: 'string',
            data: 'registerCardNo',
            readonly: true
          },
          {
            name: '组件名称',
            type: 'string',
            data: 'subGroupName',
            readonly: true,
            span: 12
          },
          {
            name: '规格',
            type: 'string',
            data: 'standard',
            span: 12,
            readonly: true
          },
          {
            name: '型号',
            type: 'string',
            data: 'model',
            span: 12,
            readonly: true
          },
          {
            name: '竞价组名称',
            type: 'string',
            data: 'aup2ProjectTypeGroupName',
            span: 12,
            readonly: true
          },
          {
            name: '备注',
            type: 'text',
            data: 'note',
            readonly: true
          }
        ]
        for (let item of data.attributeConfigJson) {
          obj.data[item.code] = data.attributeJson[item.code]
          config.push({
            name: item.name,
            type: item.type,
            data: item.code,
            span: 12,
            readonly: true
          })
        }
        obj.config = config
      })
    },
    /**
     * 组件数据
     */
    getServer() {
      let obj = this.datas[this.active]
      let config = [
        // 注册证
        [
          {
            name: '基础信息',
            type: 'title',
            hide: !this.self
          },
          {
            name: '注册证编号',
            type: 'string',
            data: 'registerCardNo',
            readonly: true,
            span: 12
          },
          {
            name: '注册证有效期起',
            type: 'string',
            data: 'validityStart',
            readonly: true,
            span: 12
          },
          {
            name: '注册证名称',
            type: 'string',
            data: 'registerCardName',
            readonly: true,
            span: 12
          },
          {
            name: '注册证有效期止',
            type: 'string',
            data: 'validityEnd',
            readonly: true,
            span: 12
          },
          {
            name: '产品名称（中文）',
            type: 'string',
            data: 'name',
            readonly: true,
            span: 12
          },
          {
            name: '产品名称（英文）',
            type: 'string',
            data: 'nameEn',
            readonly: true,
            span: 12
          },
          {
            name: '生产企业（中文）',
            type: 'string',
            data: 'manufactureName',
            readonly: true,
            span: 12
          },
          {
            name: '生产企业（英文）',
            type: 'string',
            data: 'manufactureNameEn',
            readonly: true,
            span: 12
          },
          {
            name: '产地',
            type: 'select',
            data: 'origin',
            readonly: true,
            options: this.type_area,
            span: 12
          },
          {
            name: '代理企业',
            type: 'string',
            data: 'proxyName',
            readonly: true,
            span: 12
          },
          {
            name: '管理类别',
            type: 'select',
            data: 'managementType',
            readonly: true,
            options: this.project_type,
            span: 12
          },
          {
            name: '分类目录',
            type: 'string',
            data: 'aup2ProjectType',
            options: this.project_class,
            readonly: true,
            span: 12
          },
          {
            name: '注册证型号',
            type: 'string',
            data: 'model',
            readonly: true
          },
          {
            name: '注册证规格',
            type: 'string',
            data: 'standard',
            readonly: true
          },
          {
            name: '结构及组成',
            type: 'string',
            data: 'structure',
            readonly: true
          },
          {
            name: '使用范围',
            type: 'string',
            data: 'scope',
            readonly: true
          }
        ],
        // 组件
        [
          {
            name: '所属注册证',
            type: 'string',
            data: 'registerCardNo',
            readonly: true
          },
          {
            name: '组件名称',
            type: 'string',
            data: 'subGroupName',
            span: 12,
            readonly: true
          },
          {
            name: '产品转换比',
            type: 'string',
            data: 'conversionRatio',
            span: 12,
            readonly: true
          },
          {
            name: '产品材质',
            type: 'string',
            data: 'productMaterial',
            span: 12,
            readonly: true
          },
          {
            name: '最小使用单位',
            type: 'string',
            data: 'minUnit',
            span: 12,
            readonly: true
          },
          {
            name: '产品包装材质',
            type: 'string',
            data: 'productPackMaterial',
            placeholder: '请填写产品包装材质',
            span: 12,
            readonly: true
          },
          {
            name: '包装单位',
            type: 'string',
            data: 'packUnit',
            placeholder: '请填写包装单位',
            span: 12,
            readonly: true
          },
          {
            name: '适用范围',
            type: 'text',
            data: 'scope',
            placeholder: '请填写适用范围',
            readonly: true
          },
          {
            name: '说明书',
            type: 'file',
            data: 'jpgFileList',
            defuld: [],
            action: '/portal/pub/comm/uploadimage',
            readonly: true,
            hide: !this.self
          }
        ]
      ]
      // get server data
      this.pubData([this.active, obj.id]).then(res => {
        obj.loading = true
        obj.data = res.content.data
        obj.config = config[this.active]
        if (this.active == 0 && this.self) {
          // 注册证 动态字段
          obj.config.push({
            name: '注册证附件',
            type: 'title'
          })
          // files
          for (let item of res.content.data.attributeConfigJson[0].attributes) {
            // get value's key
            let key = `${item.code}_fileInfos`
            // get value
            let val = res.content.data.attributeJson[key]
            //set input
            obj.config.push({
              name: item.name,
              type: item.type,
              data: key,
              readonly: true
            })
            obj.data[key] = val
          }
        }
      })
    }
  },
  created() {
    // init data pro
    this.initData()
    // 分组类别
    this.$store.dispatch('apply/categories').then(res => {
      this.project_class = res.content.auctionGroup
    })
    // 管理类型
    this.manageType().then(res => {
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
  components: { TopToolBar, FormGroup }
}
</script>
<style lang="scss" src='@/assets/css/page.scss'></style>
