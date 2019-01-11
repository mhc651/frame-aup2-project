<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'注册证详情'">
       <span slot="btn">
         <Button type="primary" @click="$router.push({path:`/ma1/registrationEdit/${regeid.split('/')[3]}`})"  v-if="registerCard.auditStatus==1 || registerCard.auditStatus==5">编辑</Button>
         <Button type="primary" @click="check()" v-if="registerCard.auditStatus==1 || registerCard.auditStatus==5">提交审核</Button>
         <Button type="primary" @click="cancleCheck()" v-if="registerCard.auditStatus==2">撤回审核</Button>
         <Button type="primary" @click="backs()">返回</Button>
         <!--<Button type="primary" @click="$router.push({path:pathArray[0]+`/edit/${form.id}`})">编辑 this.$route.params </Button>-->
      </span>

      <span slot="content">
        <strong class="help">说明</strong>
        <p>
          企业向某个项目报名前需提交企业资料申报，
          <br>
          需准备：基本资料、资质与授权文件。
          <br>
          支持：保存、编辑、提交审核，
          <br>
          提交后需管理端确认审核通过。
        </p>
      </span>
    </top-tool-bar>
    <div class="page-container">
      <div v-if="registerCard.auditStatus==4 || registerCard.auditStatus==5">
        <h5 class="title">审核信息</h5>
        <table class="info-table">
          <tr>
            <th class="label">审核结果</th>
            <td>
              <div v-for="item in checkresult">
                <p v-if="item.value==registerCard.auditStatus">{{item.label}}</p>
              </div>
            </td>
          </tr>
          <tr>
            <th class="label">审核意见</th>
            <td>
              <p class="text-pre">{{registerCard.auditOpinion}}</p>
              <!-- <Input v-model="registerCard.auditOpinion" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input> -->
            </td>
          </tr>
        </table>
      </div>
      <h5 class="title">基本信息</h5>
      <table class="info-table">
        <tr>
          <th class="label"><span class="required">*</span>注册证编号</th>
          <td>
            <span v-text="registerCard.registerCardNo"></span>
          </td>
          <th class="label">注册证有效期起</th>
          <td>
            <Col span="12" style="float:left">
              <DatePicker   disabled :value="registerCard.validityStart"   style="width: 200px"></DatePicker>
            </Col>
          </td>
        </tr>
        <tr>
          <th class="label"><span class="required">*</span>注册证名称</th>
          <td>
            <span v-text="registerCard.registerCardName"></span>
          </td>
          <th class="label">注册证有效期止</th>
          <td>
            <Col span="12" style="float:left">
              <DatePicker   disabled :value="registerCard.validityEnd"   style="width: 200px"></DatePicker>
            </Col>
          </td>
        </tr>
        <tr>
          <th class="label"><span class="required">*</span>产品名称(中文)</th>
          <td>
            <span v-text="registerCard.name"></span>
          </td>
          <th class="label">产品名称(英文)</th>
          <td>
            <span v-text="registerCard.nameEn"></span>
          </td>

        </tr>
        <tr>
          <th class="label"><span class="required">*</span>生产企业(中文)</th>
          <td>
            <span v-text="registerCard.manufactureName"></span>
          </td>
          <th class="label">生产企业(英文)</th>
          <td>
            <span v-text="registerCard.manufactureNameEn"></span>
          </td>
        </tr>
        <tr>
          <th class="label"><span class="required">*</span>产地</th>
          <td>
            <div>
              <Select disabled  v-model="registerCard.origin" style="width: 200px">
                <Option v-for="item in originList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </td>
          <!--<td>-->
          <!--<span v-text="registerCard.orgInfoName"></span>-->
          <!--</td>-->
          <th class="label">代理企业</th>
          <td>
            <span v-text="registerCard.proxyName"></span>
          </td>
        </tr>
        <tr>
          <th class="label"><span class="required">*</span>管理类别</th>
          <td>
            <div>
              <Select disabled  v-model="registerCard.managementType" style="width: 200px">
                <Option v-for="item in managementTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </div>
          </td>
          <th class="label"><span class="required">*</span>分类目录</th>
          <td>
            <Select placeholder = '请选择产品分类' disabled v-model="registerCard.aup2ProjectTypeId" style="width:200px">
              <Option v-for="item in categories" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </td>
        </tr>
        <tr>
          <th class="label">注册证型号</th>
          <td colspan="3">
            <span v-text="registerCard.model"></span>
          </td>
        </tr>
        <tr>
          <th class="label">注册证规格</th>
          <td colspan="3">
            <span v-text="registerCard.standard"></span>
          </td>
        </tr>
        <tr>
          <th class="label">结构及组成</th>
          <td colspan="3">
            <span v-text="registerCard.structure"></span>
          </td>
        </tr>
        <tr>
          <th class="label">使用范围</th>
          <td colspan="3">
            <span v-text="registerCard.scope"></span>
          </td>
        </tr>
      </table>
      <h5 class="title">
        <span v-if="registerCard.attributeConfigJson!=null">
          {{registerCard.attributeConfigJson[0].name}}
        </span>

      </h5>
      <table class="info-table" v-if="registerCard.attributeConfigJson!=null">
        <tr  v-for="item in registerCard.attributeConfigJson[0].attributes">
          <th class="label">{{item.name}}</th>
          <td colspan="2">
            资质图片:
            <div v-for="vitem,key in registerCard.attributeJson">
              <div v-if="item.code+'_fileInfos'==key">

                <p v-for="val in vitem">
                  <span v-if="val!=null">
                    <span  class="review" v-text="val.name" @click="handleReview(val.url,val.name)"></span>
                  </span>
                </p>
                <div v-if="registerCard.auditStatus==4 || registerCard.auditStatus==5">
                  <div v-if="registerCard.auditData!=null">
                    <p v-if="item.code in registerCard.auditData">
                      <span>审核状态：</span>
                      <span  style="color:#f00">
                        不通过
                      </span>
                    </p>
                    <p v-if="item.code in registerCard.auditData">
                      <span>审核意见：</span>
                      <span   class="text-pre">
                          {{registerCard.auditData[item.code]}}
                        </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>



          </td>
          <td colspan="1" v-if="item.templates!=null&&item.templates.length>0">
            <p>
              <a v-bind:href="item.templates[0].url"   target="_blank">模板下载</a>
            </p>
          </td>
          <td colspan="1" v-else>
          </td>
        </tr>
      </table>

      <Modal
        width="800"
        v-model="preview"
        title="查看大图"
        @on-ok=""
        @on-cancel="preview = false">
        <img :src="previewUrl" alt="" style="width: 100%">
      </Modal>
    </div>
  </div>
</template>
<script>
  import TopToolBar from '@/components/Common/TopToolBar.vue'
  // loading 组件
  import Loading from '@/components/Common/Loading.vue'
  import { mapState, mapActions  } from 'vuex'
  import { validateNowDate, remove } from '../../assets/js/common.js'
  export default {
    name: 'registration',
    computed: {
      storage() {
        return `${this.$route.path}`
      }
    },
    components: {
      TopToolBar,
      Loading
    },
    data() {
      return {
        loading: false,
        regeid: `${this.$route.path}`,
        subGroup: [],
        originList: [],
        managementTypeList: [],
        checkTab:true,
        categories: [],
        checkresult:[{"label":"未提交","value":"1"},{"label":"待审核","value":"2"},{"label":"审核中","value":"3"},{"label":"通过","value":"4"},{"label":"未通过","value":"5"}],
        registerCard: {
          expirationStart: '',
          expirationEnd: '',
          medicalFileList: [],
          registFileList: [],
          fdaFileList: [],
          otherFileList: []
        },
        preview: false,
        previewUrl: '',
        columns: [
          {
            title: '组件名称',
            key: 'subGroupName',
            align: 'center'
          },
          {
            title: '产品转换比',
            key: 'conversionRatio',
            align: 'center'
          },
          {
            title: '最小使用单位',
            key: 'minUnit',
            align: 'center'
          },
          {
            title: '包装单位',
            key: 'packUnit',
            align: 'center'
          },
          {
            title: '产品材质',
            key: 'productMaterial',
            align: 'center'
          },
          {
            title: '产品包装材质',
            key: 'productPackMaterial',
            align: 'center'
          },
          {
            title: '使用范围',
            key: 'scope',
            align: 'center'
          },
          {
            title: '说明书',
            key: 'auditStatus',
            align: 'center',
            render: (h, r) => {
              // 查看图片
              if (r.row.jpgFileList.length) {
                let htm = []
                for (let item of r.row.jpgFileList) {
                  let dom = h(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px',
                        marginBottom:'5px'
                      },
                      on: {
                        click: () => {
                          this.handleReview(item.url)
                        }
                      }
                    },
                    '查看'
                  )
                  htm.push(dom)
                }
                return h('div', htm)
              } else {
                return h('span', {}, '无')
              }
            }
          }
        ],
        filter: {
          page: 1,
          size: 10,
          ...this.$route.params
        },
        total: 0
      }
    },
    created() {
      this.fetchData()
      this.getProductManaList()
      this.getProductAddr()
      this.fetchCategory()
    },
    methods: {
      ...mapActions(['productAddr', 'manageType']),
      backs() {
        sessionStorage.setItem('produceState', '2')
        let msedit = sessionStorage.getItem('mlistedit')
        if(msedit!=null){
          if(msedit=='1'){
            this.$router.push({
              path: `/LCSB/LCSB003`
            })
          }
        }else{
          this.$router.back(-1)
        }


      },
      /*提交审核*/
      check() {
        // return this.$Modal.warning({content:'提交审核时间还未开始，请先检查好提交的申报信息，确保一次性通过。'})
        // this.loading = true
        // let open_time = '2018/06/12 00:00:00'
        // if (!validateNowDate(open_time)) {
        //   return this.$Modal.warning({
        //     content: `审核提交开始时间为 ${open_time}`
        //   })
        // }
        let registrationId = this.$route.params.registerId
        let param = {ids:registrationId}
        this.$store
          .dispatch('registration/submitRegisterCheck', param)
          .then(payload => {
            this.loading = false
            if (payload.success && payload.content) {
              this.$Message.success({content:'提交审核成功'})
              this.fetchData()
            }
          })
      },
      /*撤销审核*/
      cancleCheck() {
        this.loading = true
        let registrationId = this.$route.params.registerId
        let param = {ids:registrationId}
        this.$store
          .dispatch('registration/cancleRegisterCheck', param)
          .then(payload => {
            this.loading = false
            if (payload.success && payload.content) {
              this.$Message.success({content:'撤回成功'})
              this.fetchData()
            }
          })
      },
      // 获取产品类别
      fetchCategory() {
        this.$store.dispatch('apply/categories').then(payload => {
          if (payload.success && payload.content) {
            const { entries } = Object
            const data = payload.content.auctionGroup
            const categories = [{ label: '全部', value: '' }]
            for (const [key, value] of entries(data)) {
              categories.push({
                label: value,
                value: key
              })
            }
            this.categories = categories
          }
        })
      },
      fetchData() {
        this.loading = true
        this.$store
          .dispatch('registration/detail', this.$route.params)
          .then(payload => {
            this.loading = false
            if (payload.success && payload.content) {
              this.registerCard = payload.content.data
            }
          })
      },
      initAddr(data) {
        if (data!=null) {
          const { entries } = Object
          const productAddrList = []
          for (const [key, value] of entries(data)) {
            productAddrList.push({
              label: value.text,
              value: value.code
            })
          }
          this.originList = productAddrList
          console.log(JSON.stringify(this.originList))
        }
      },
      initManageList(data) {
        if (data!=null) {
          const { entries } = Object
          const productAddrList = []
          for (const [key, value] of entries(data)) {
            productAddrList.push({
              label: value.text,
              value: value.code
            })
          }
          this.managementTypeList = productAddrList
          console.log("管理列表"+JSON.stringify(this.managementTypeList))
        }
      },
      // getProductAddr() {
      //   this.loading = true
      //   this.$store
      //     .dispatch('registration/getOrigin', this.$route.params)
      //     .then(payload => {
      //       this.loading = false
      //       if (payload.success && payload.content) {
      //         if (payload.content != null) {
      //           this.initAddr(payload.content)
      //         }
      //       }
      //     })
      // },
      getProductAddr() {
        return this.productAddr().then(
          res => {
            this.initAddr(res.content)
            this.loading = false
            return Promise.resolve(res)
          },
          err => {
            this.loading = false
            return Promise.reject(res)
          }
        )
      },
      getProductManaList() {
        return this.manageType().then(
          res => {
            this.initManageList(res.content)
            this.loading = false
            return Promise.resolve(res)
          },
          err => {
            this.loading = false
            return Promise.reject(res)
          }
        )
      },
      fetchGroup() {
        // this.loading = true
        // this.$store.dispatch('registration/group', this.filter).then(payload => {
        //   this.loading = false
        //   if (payload.success && payload.content) {
        //     this.subGroup = payload.content.records
        //     this.total = payload.content.total
        //   }
        // })
      },
      // 翻页
      handlePager(page) {
        this.filter.page = page
        //this.fetchGroup()
      },
      handleReview(url,name) {
        if (name.indexOf('zip') != -1) {
          window.open(url)
          return
        }
        this.preview = true
        this.previewUrl = url
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .page-container {
    height: calc(100vh - 125px);
    overflow-y: auto;
  }

  .title {
    background: #f1f1f1;
    padding: 8px;
    font-size: 16px;
    // margin: 15px 0;
    color: #333;
  }

  .tip {
    line-height: 30px;
  }

  .note,
  .required {
    color: #ea5a46;
  }

  .strong {
    color: #333;
  }

  .info-table {
    width: 100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
    th {
      margin: 0;
      border: 1px solid #ddd;
      padding: 5px 12px;
      line-height: 25px;
      text-align: center;
    }
    td {
      margin: 0;
      border: 1px solid #ddd;
      padding: 5px 12px;
    }
    .label {
      width: 150px;
      background: #f1f1f1;
    }
    .input-sm {
      height: 36px;
      padding: 0 0 0 12px;
    }
  }
  .review {
    cursor: pointer;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;
    color: #4285f4;
    margin: 10px;
  }
</style>
