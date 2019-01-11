<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'增补材料'">
      <span slot="btn">
         <Button type="primary"    @click="$router.push({path:`/BJCLZB/BJCLZB001/edit/${form.id}`})">编辑</Button>
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
    <div class="page-container" id="companyd">

      <h5 class="title">
        <span v-if="form.attributeConfigJson.length">
          {{form.attributeConfigJson[0].name}}
        </span>
      </h5>
      <div v-if="form.attributeConfigJson.length">
        <ul style="list-style-type: none;" v-for="(item,index) in form.attributeConfigJson[0].tips">
          <li>
            <span>{{index+1}}. </span>
            <span class="strong">{{item}}</span>
          </li>

        </ul>
      </div>
      <!-- 权限 -->
      <table class="info-table" v-if="form.attributeConfigJson.length">
        <tr v-for="(items,indexs) in form.attributeConfigJson[0].attributes">

          <!--<th class="label"><div><span class="required">*</span>{{items.name}}</div></th>-->

          <th class="label"><div><span  v-if="!items.allowBlank" class="required">*</span>{{items.name}}</div><div>{{items.note}}</div></th>


          <td colspan="3">
            <div v-for="vitem,key in form.attributeJson">
              <div v-if="items.code+'_fileInfos'==key">
                <div v-if="vitem!=null">
                  <p v-for="val in vitem">
                    <span  class="review" v-text="val.name" @click="handleReview(val.url,val.name)"></span>
                  </p>
                </div>
                <!-- item cell  -->
                <div v-if="key=='business_license_fileInfos'">
                  <span span="12" style="color: #495060">
                    <DatePicker type="daterange"  readonly :value="form.yytime"   style="width: 200px"></DatePicker>
                  </span>
                </div>
                <!-- item cell  end-->

              </div>
            </div>
          </td>

          <td style="width: 120px;text-align: center" v-if="items.templates!=null&&items.templates.length!=0">
            <p>
              <a v-bind:href="items.templates[0].url"   target="_blank">模板下载</a>
            </p>
          </td>

        </tr>
      </table>
      <!-- 权限 end-->
      <!-- 配送 -->
      <div v-for="(acj,indexa) in form.attributeConfigJson">
        <div v-if="indexa!=0">
          <h5 class="title">
            {{acj.name}}
          </h5>
          <div class="tip" v-if="acj.tips.length">
            <span class="note">温馨提示：</span>
          </div>
          <ul style="list-style-type: none;" v-for="(item,indexi) in acj.tips">
            <li>
              <span>{{indexi+1}}. </span>
              <span class="strong">{{item.split("：")[0]}}</span>
            </li>
          </ul>
          <table class="info-table">
            <tr v-for="(items,indexs) in acj.attributes">
              <th class="label"><span v-if="!items.allowBlank" class="required">*</span>{{items.name}}</th>
              <td colspan="3" v-if="items.type === 'file'">
                  <div  v-for="vitem,key in form.attributeJson">
                    <!-- 图片组 -->
                    <div v-if="items.code+'_fileInfos'==key">
                      <div v-if="vitem!=null">
                        <p v-for="val in vitem">
                          <span  class="review" v-text="val.name" @click="handleReview(val.url,val.name)"></span>
                        </p>
                      </div>
                      <!-- 时间 -->
                      <div v-if="key=='distributor_business_license_fileInfos'">
                        <span span="12" style="color: #495060">
                          <DatePicker type="daterange"  :value="form.attryytime" readonly style="width: 200px"></DatePicker>
                        </span>
                      </div>
                      <div v-if="key=='distributor_business_license2_fileInfos'">
                        <span span="12" style="color: #495060">
                          <DatePicker type="daterange"  :value="form.attryytime2" readonly style="width: 200px"></DatePicker>
                        </span>
                      </div>
                      <!-- 时间 end-->
                    </div>
                    <!-- 图片组 end-->
                  </div>
                        <!-- 审核用 -->

              <!-- 审核用 end -->
              </td>
              <td colspan="3"  v-else>
                <div>
                  <span  v-text="form.attributeJson[items.code]" ></span>
                </div>
              </td>
            </tr>

          </table>
        </div>
      </div>
      <!-- 配送 end-->
    </div>
    <Modal
      width="800"
      v-model="preview"
      title="查看大图"
      @on-ok=""
      @on-cancel="preview = false">
      <div style="min-height: 300px;position: relative">
        <Spin size="large" fix v-if="spinShow">{{imageLoadingText}}</Spin>
        <img :src="previewUrl" alt="" style="width: 100%" id="previewUrl">
      </div>
    </Modal>

  </div>


</template>

<script>
import { mapState } from 'vuex'
import TopToolBar from '@/components/Common/TopToolBar.vue'
// loading 组件
import Loading from '@/components/Common/Loading.vue'
import { remove } from '../../assets/js/common.js'
export default {
  name: 'detail',
  computed: {
    ...mapState(['token'])
  },
  components: {
    TopToolBar,
    Loading
  },
  data() {
    return {
      value1: ['2016-01-01', '2016-02-15'],
      // review state
      auditStatus: '',
      spinShow: false,
      imageLoadingText: '',
      loading: false,
      preview: false,
      previewUrl: '',
      pathArray: '',
      // 企业申报拦截
      disabledOrg: false,
      // 倒计时器
      subPreview: false,
      disabledSms: false,
      time: 180,
      timer: null,
      form: {
        id: '',
        orgInfoName: '',
        projectType: '',
        legalName: '',
        legalCard: '',
        legalPhone: '',
        legalEmail: '',
        fax: '',
        url: '',
        registeredCapital: '',
        turnover: '',
        authorizedPhone: '',
        smsCode: '',
        registerAddress: '',
        productAddress: '',
        mailingAddress: '',
        postalCode: '',
        authorizedName: '',
        businessLicense: '',
        businessLicenseList: [],
        licenseStart: '',
        licenseEnd: '',
        companyLegailCard: '',
        companyLegailCardList: [],
        companyWarrant: '',
        companyWarrantList: [],
        hosCommitment: '',
        hosCommitmentList: [],
        noIllegalityStatement: '',
        noIllegalityStatementList: [],
        noIllegalityResult: '',
        noIllegalityResultList: [],
        distributorName: '',
        distributorLicence: '',
        distributorLicenceList: [],
        distributorBusinessLicense: '',
        distributorBusinessLicenseList: [],
        distributorOrgCodeCard: '',
        distributorOrgCodeCardList: [],
        distributorTaxRegistration: '',
        distributorTaxRegistrationList: [],
        logo: '',
        logoList: [],
        payTaxesApply: '',
        payTaxesApplyList: [],
        invoiceDetailed: '',
        invoiceDetailedList: [],
        productApplySummary: '',
        productApplySummaryList: [],
        attryytime: [],
        attryytime2: [],
        yytime: [],
        attributeConfigJson: []
      }
    }
  },
  mounted() {
    this.fetchData()
  },
  created() {
    this.getInitPathArray()
  },
  methods: {

    getInitPathArray() {
      var patha = JSON.parse(sessionStorage.getItem('pathArray'))
      this.pathArray = patha
    },
    fetchData() {
      this.loading = true
      this.$store.dispatch('apply/addDetail', this.$route.params).then(payload => {
        this.loading = false
        if (payload.success && payload.content) {
          // top form
          this.form = payload.content.data
          let atj = payload.content.data.attributeJson
          for(var  key  in atj){
            if(key.indexOf('fileInfos')!=-1 && atj[key]!=null && atj[key].length!=0){
              atj[key] = remove(atj[key],null)
            }
          }
        }
      })
    },

    handleReview(url, name) {
      if (name.indexOf('zip') != -1) {
        window.open(url)
        return
      }

      this.spinShow = true
      this.preview = true
      this.imageLoadingText = ''
      const image = document.querySelector('#previewUrl')
      image.src = url
      image.onload = e => {
        this.previewUrl = url
        this.spinShow = false
      }
      image.onerror = e => {
        this.imageLoadingText = '图片加载失败'
      }
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
    padding: 8px 12px;
    line-height: 25px;
    text-align: center;
  }
  td {
    margin: 0;
    border: 1px solid #ddd;
    padding: 8px 12px;
    width: 300px;
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
