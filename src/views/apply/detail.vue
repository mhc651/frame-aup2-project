<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'企业申报'">
      <small  slot="text" v-if="auditStatus == 1">
        您的申报资料当前状态为 “未提交”，请重新提交审核！
      </small>
      <small  slot="text" v-if="auditStatus == 2">
        您的企业资料当前状态为 “待审核”，请耐心等待！
      </small>
      <small  slot="text" v-if="auditStatus == 3">
        您的申报资料当前状态为 “审核中”，请耐心等待！
      </small>
      <small  slot="text" v-if="auditStatus == 4 || auditStatus == 5">您的申报资料，当前状态为
        <span style="color:#39f" v-if='auditStatus == 4 '>
            已通过
          </span>
        <span style="color:#f00" v-if='auditStatus == 5 '>
            未通过
          </span>
        <span v-if='auditStatus == 5 '>
            请点击编辑进行修改。
          </span>
      </small>
      <span slot="btn">
        <!--<Button type="primary" @click="$router.push({path:pathArray[0]+`/edit/${form.id}`})">编辑</Button>-->
         <Button type="primary"  v-if='auditStatus == 5 || auditStatus == 1||!auditStatus'  @click="$router.push({path:`/LCSB/LCSB001/edit/${form.id}`})">编辑</Button>

        <Button type="primary"  v-if='auditStatus == 5 || auditStatus == 1||!auditStatus' :disabled='disabledOrg' @click="subPreview = true">提交审核</Button>

        <Button type="primary"  v-if='auditStatus == 2'  @click="cancleCheck()">撤回</Button>
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

      <div v-if="form.auditStatus==4 || form.auditStatus==5">
        <h5 class="title">审核信息</h5>
        <table class="info-table">
          <tr>
            <th class="label">审核结果</th>
            <td colspan="3">
              <div v-for="item in checkresult">
                <p v-if="item.value==form.auditStatus">{{item.label}}</p>
              </div>
            </td>
          </tr>
          <tr>
            <th class="label">审核意见</th>
            <td colspan="3">
              <p class="text-pre">{{ form.auditOpinion?form.auditOpinion:'无' }}
              </p>
            </td>
          </tr>
        </table>
      </div>

      <h5 class="title"><span class="required">*</span>基本资料</h5>
      <div class="tip">
        <span class="note">温馨提示：</span>
        《授权委托书》、《授权人身份证》、授权人提交的信息（姓名）处要求填写的资料为同一人
      </div>
      <table class="info-table">
        <tr>
          <th class="label">企业名称</th>
          <td>
            <span v-text="form.orgInfoName"></span>
          </td>
          <th class="label">注册地址</th>
          <td>
            <span v-text="form.registerAddress"></span>
          </td>
        </tr>
        <tr>
          <th class="label">企业类型</th>
          <td>
            <RadioGroup :value="form.projectType">
              <Radio label="1">生产企业</Radio>
              <Radio label="2">代理企业</Radio>
            </RadioGroup>
          </td>
          <th class="label">生产地址</th>
          <td>
            <span v-text="form.productAddress"></span>
          </td>
        </tr>
        <tr>
          <th class="label">法人姓名</th>
          <td>
            <span v-text="form.legalName"></span>
          </td>
          <th class="label">法人身份证号</th>
          <td>
            <span v-text="form.legalCard"></span>
          </td>

        </tr>
        <tr>
          <th class="label">法人联系电话</th>
          <td>
            <span v-text="form.legalPhone"></span>
          </td>
          <th class="label">通讯地址</th>
          <td>
            <span v-text="form.mailingAddress"></span>
          </td>
        </tr>
        <tr>
          <th class="label">电子邮箱</th>
          <td>
            <span v-text="form.legalEmail"></span>
          </td>
          <th class="label">传真</th>
          <td>
            <span v-text="form.fax"></span>
          </td>
        </tr>
        <tr>
          <th class="label">2017年营业额(万元)</th>
          <td>
            <span v-text="form.turnover"></span>
          </td>
          <th class="label">网址</th>
          <td>
            <span v-text="form.url"></span>
          </td>
        </tr>
        <tr>
          <th class="label">被授权人姓名</th>
          <td>
            <span v-text="form.authorizedName"></span>
          </td>
          <th class="label">注册资金(万元)</th>
          <td>
            <span v-text="form.registeredCapital"></span>
          </td>
        </tr>
        <tr>
          <th class="label">被授权人联系电话</th>
          <td>
            <span v-text="form.authorizedPhone"></span>
          </td>
          <th class="label">邮政编码</th>
          <td>
            <span v-text="form.postalCode"></span>
          </td>
        </tr>
      </table>

      <h5 class="title">
        <span v-if="form.attributeConfigJson.length">
          {{form.attributeConfigJson[0].name}}
        </span>
      </h5>
      <div class="tip">
        <span class="note">温馨提示：</span>
      </div>
      <div v-if="form.attributeConfigJson.length">
        <ul style="list-style-type: none;" v-for="(item,index) in form.attributeConfigJson[0].tips">
          <li>
            <span>{{index+1}}. </span>
            <span class="strong">{{item}}</span>
          </li>

          <!--<li v-if="(index+1)!=(form.attributeConfigJson[0].tips.length)">-->
          <!--<span>{{index+1}}. </span>-->
          <!--<strong class="strong">{{item.split("：")[0]}}：</strong>-->
          <!--<span>{{item.split("：")[1]}}</span>-->
          <!--</li>-->
          <!--<li v-if="(index+1)==(form.attributeConfigJson[0].tips.length)">-->
          <!--<span>{{index+1}}. </span>-->
          <!--<strong class="note">-->
          <!--<span>{{item}}</span>-->
          <!--</strong>-->
          <!--</li>-->
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
                <!-- 审核用 -->
                <div v-if="items.type === 'file' && form.auditStatus==4 ||items.type === 'file'&& form.auditStatus==5 ">
                  <div v-if="vitem!=null">


                    <div v-if="form.auditData!=null">
                      <p v-if="items.code in form.auditData" >
                        <span>审核状态：</span>
                          <span style="color:#f00">
                            不通过
                          </span>

                      </p>
                      <p v-if="items.code in form.auditData">
                        <span>审核意见：</span>
                        <span  class="text-pre">{{form.auditData[items.code]}}</span>

                      </p>
                    </div>

                  </div>
                </div>
                <!-- 审核用 end -->
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
              <!--<td colspan="3" v-if="indexs==0">-->
              <!--<span v-text="form.distributorName"></span>-->
              <!--</td>-->
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
                <div  v-if="items.type === 'file' && form.auditStatus==4 ||items.type === 'file'&& form.auditStatus==5 ">

                  <div v-if="form.auditData!=null">
                    <p v-if="items.code in form.auditData">
                      <span>审核状态：</span>
                      <span  style="color:#f00">不通过</span>
                    </p>

                    <p v-if="items.code in form.auditData">
                      <span>审核意见：</span>
                      <span class="text-pre">{{form.auditData[items.code]}}</span>
                    </p>
                  </div>
                <!--<p><span>审核意见：</span>-->
                  <!--<span>-->
                    <!--{{ form.auditData[items.code]?form.auditData[items.code]:'无' }}-->
                  <!--</span>-->
                <!--</p>-->
              </div>
              <!-- 审核用 end -->
              </td>
              <td colspan="3"  v-else>
                <div>
                  <span  v-text="form.attributeJson[items.code]" ></span>
                </div>
              </td>
            </tr>

            <!--<tr>-->
            <!--<th class="label"><span class="required">*</span>《医疗器械经营企业许可证》/《医疗器械经营备案凭证》</th>-->
            <!--<td colspan="3">-->
            <!--<p v-for="item in form.distributorLicenceList">-->
            <!--<span-->
            <!--class="review"-->
            <!--v-text="item.name"-->
            <!--@click="handleReview(item.url)"-->
            <!--&gt;</span>-->
            <!--</p>-->
            <!--</td>-->
            <!--</tr>-->
            <!--<tr>-->
            <!--<th class="label"><span class="required">*</span>《营业执照》</th>-->
            <!--<td colspan="3">-->
            <!--<p v-for="item in form.distributorBusinessLicenseList">-->
            <!--<span-->
            <!--class="review"-->
            <!--v-text="item.name"-->
            <!--@click="handleReview(item.url)"-->
            <!--&gt;</span>-->
            <!--</p>-->
            <!--</td>-->
            <!--</tr>-->
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
    <!-- 提交申报 -->
    <Modal
      v-model="subPreview"
      title="请验证您的手机号"
      @on-ok='handleSubmit'
    >
      <div>
        <p style="margin-bottom:15px">
          手机号码：{{form.authorizedPhone}}
        </p>
        <Row  type="flex" :gutter='5'>
          <Col span="10">
            <Input type='text' placeholder="请输入手机验证码" v-model='form.smsCode'/>
          </Col >
          <Col span="4">
            <Button disabled v-show='disabledSms'>{{time}}s后可重新获取</Button>
            <Button @click='getNumCode' v-show='!disabledSms'>获取验证码</Button>
          </Col>
        </Row>
        <p style="margin-top:15px">请于2分钟内查收手机短信，并填写短信中的验证码</p>
      </div>
    </Modal>
    <!-- 提交申报 end-->
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
      checkresult: [
        { label: '未提交', value: '1' },
        { label: '待审核', value: '2' },
        { label: '审核中', value: '3' },
        { label: '通过', value: '4' },
        { label: '未通过', value: '5' }
      ],
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
    cancleCheck() {
      let params = {
        ids: this.form.id
      }
      this.$store.dispatch('cancleSubmitOrgInfoApply', params).then(
        payload => {
          if (payload.success) {
            this.$Message.success({ content: '撤回成功' })
            this.fetchData()
          }
        },
        err => {
          this.disabledOrg = false
          // this.$Modal.error({ content: err.errmsg })
        }
      )
    },
    getInitPathArray() {
      var patha = JSON.parse(sessionStorage.getItem('pathArray'))
      this.pathArray = patha
    },
    fetchData() {
      this.loading = true
      this.$store.dispatch('apply/detail', this.$route.params).then(payload => {
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
          // 当前状态
          this.auditStatus = payload.content.data.auditStatus || ''
          this.form.yytime = [
            payload.content.data.attributeJson.license_start,
            payload.content.data.attributeJson.license_end
          ]
          this.form.attryytime = [
            payload.content.data.attributeJson.distributor_license_start,
            payload.content.data.attributeJson.distributor_license_end
          ]
          this.form.attryytime2 = [
            payload.content.data.attributeJson.distributor_license_start2,
            payload.content.data.attributeJson.distributor_license_end2
          ]

          // console.log(this.form.yytime);
          // console.log("999999999999"+this.form.attryytime);
        }
      })
    },
    /**
     * 倒计时
     * */
    getNumCode() {
      this.disabledSms = !this.disabledSms
      this.time = 180
      clearInterval(this.timer)
      this.timer = null
      if (this.disabledSms) {
        this.timer = setInterval(
          function() {
            this.time--
            if (this.time === 0) {
              this.disabledSms = !this.disabledSms
              this.time = 180
              clearInterval(this.timer)
            }
          }.bind(this),
          1000
        )
      }
      // 获得验证码
      this.$store
        .dispatch('sendCode', { phone: this.form.authorizedPhone })
        .then(payload => {
          if (payload.success) {
            this.$Message.success({ content: '短信发送成功' })
            this.fetchData()
          }
        })
    },
    // 显示提交
    handleSubmit() {
      if (!this.form.smsCode) {
        this.$Message.error({ content: '短信不能为空！' })
        return
      }
      this.disabledOrg = true
      let params = {
        smsCode: this.form.smsCode,
        id: this.form.id
      }
      this.$store.dispatch('submitOrgInfoApply', params).then(
        payload => {
          this.disabledOrg = false

          if (payload.success) {
            this.$Message.success({ content: '企业申报成功' })
            this.fetchData()
          }
        },
        err => {
          this.disabledOrg = false
          // this.$Modal.error({ content: err.errmsg })
        }
      )
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
