<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'企业申报'">
      <span slot="btn">
        <Button type="primary" @click="onSubmit">保存</Button>
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
      <h5 class="title"><span class="required">*</span>基本资料</h5>
      <div class="tip">
        <span class="note">温馨提示：</span>
        《授权委托书》、《授权人身份证》、授权人提交的信息（姓名）处要求填写的资料为同一人
      </div>
      <Form @submit="onSubmit" ref="form" :model="form" :rules="formRule">
        <table class="info-table">
          <tr>
            <th class="label"><span class="required">*</span>企业名称</th>
            <td>
              <FormItem prop="orgInfoName">
                <Input
                  v-model="form.orgInfoName"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>注册地址</th>
            <td>
              <FormItem prop="registerAddress">
                <Input
                  v-model="form.registerAddress"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>企业类型</th>
            <td>
              <FormItem prop="projectType">
                <RadioGroup v-model="form.projectType">
                  <Radio label="1">生产企业</Radio>
                  <Radio label="2">代理企业</Radio>
                </RadioGroup>
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>生产地址</th>
            <td>
              <FormItem prop="productAddress">
                <Input
                  v-model="form.productAddress"
                  placeholder="请输入"
                />
              </FormItem>

            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>法人姓名</th>
            <td>
              <FormItem prop="legalName">
                <Input
                  v-model="form.legalName"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>法人身份证号</th>
            <td>
              <FormItem prop="legalCard">
                <Input
                  v-model="form.legalCard"
                  placeholder="请输入"
                />
              </FormItem>
            </td>

          </tr>
          <tr>
            <th class="label"><span class="required">*</span>法人联系电话</th>
            <td>
              <FormItem prop="legalPhone">
                <Input
                  v-model="form.legalPhone"
                  placeholder="请输入"
                />
              </FormItem>

            </td>
            <th class="label"><span class="required">*</span>通讯地址</th>
            <td>
              <FormItem prop="mailingAddress">
                <Input
                  v-model="form.mailingAddress"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>电子邮箱</th>
            <td>
              <FormItem prop="legalEmail">
                <Input
                  v-model="form.legalEmail"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>传真</th>
            <td>
              <FormItem prop="fax">
                <Input
                  v-model="form.fax"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>2017年营业额(万元)</th>
            <td>
              <FormItem prop="turnover">
                <Input
                  v-model="form.turnover"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>网址</th>
            <td>
              <FormItem prop="url">
                <Input
                  v-model="form.url"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>被授权人姓名</th>
            <td>
              <FormItem prop="authorizedName">
                <Input
                  v-model="form.authorizedName"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>注册资金(万元)</th>
            <td>
              <FormItem prop="registeredCapital">
                <Input
                  v-model="form.registeredCapital"
                  placeholder="请输入"
                />
              </FormItem>

            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>被授权人联系电话</th>
            <td>
              <FormItem prop="authorizedPhone">
                <Input
                  v-model="form.authorizedPhone"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>邮政编码</th>
            <td>
              <FormItem prop="postalCode">
                <Input
                  v-model="form.postalCode"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label">
              <span><span class="required">*</span>手机验证码</span>
            </th>
            <td>
              <FormItem prop="smsCode">
                <Input
                  v-model="form.smsCode"
                  placeholder="请输入"
                >
                <Button slot="append" type="primary" @click="sendCode" :disabled="wait!==60" v-text="btnText">
                </Button>
                </Input>
              </FormItem>
            </td>
            <th class="label">
              &nbsp;
            </th>
            <td>
              &nbsp;
            </td>

          </tr>
        </table>
        <h5 class="title">
          <span>{{initIntoData.data.attributeConfigJson[0].name}}</span>
        </h5>
        <div class="tip">
          <span class="note">温馨提示：</span>
        </div>
        <ul style="list-style-type: none;" v-for="(item,index) in initIntoData.data.attributeConfigJson[0].tips">
          <li v-if="(index+1)!=(initIntoData.data.attributeConfigJson[0].tips.length)">
            <span>{{index+1}}. </span>
            <strong class="strong">{{item.split("：")[0]}}：</strong>
            <span>{{item.split("：")[1]}}</span>
          </li>
          <li v-if="(index+1)==(initIntoData.data.attributeConfigJson[0].tips.length)">
            <span>{{index+1}}. </span>
            <strong class="note">
              <span>{{item}}</span>
            </strong>
          </li>
        </ul>
        <table class="info-table">

          <tr v-for="(items,indexs) in initIntoData.data.attributeConfigJson[0].attributes">
            <th class="label"><div><span class="required">*</span>{{items.name}}</div><div>{{items.note}}</div></th>
            <td colspan="3">

              <Upload
                action="/portal/pub/comm/uploadimage"
                :on-success="handleComplete.bind(this,items.code)"
                :default-file-list='form[items.code+"List"]'
                :before-upload="handleSelect.bind(this,items.code+'List')"
                :on-remove="handleRemove.bind(this,items.code)"
                :on-preview="handleReview"
                :on-format-error="handleFormatError"
                accept="image/*"
              >
                <Button type="ghost">上传文件</Button>
              </Upload>
              <div v-if="items.subFields!=null">
                <Col span="12" style="float:left">
                  <DatePicker type="daterange" @on-change="getLicenseT" v-model="form.license_time"  placeholder="Select date" style="width: 200px"></DatePicker>
                </Col>
              </div>

            </td>
            <td style="width: 120px;text-align: center" v-if="items.templates!=null&&items.templates.length!=0">
              <p>
                <a v-bind:href="items.templates[0].url"   target="_blank">模板下载</a>
              </p>
            </td>
          </tr>

        </table>
        <h5 class="title">
          指定配送
        </h5>
        <div class="tip">
          <span class="note">温馨提示：</span>
        </div>

        <ul style="list-style-type: none;" v-for="(item,index) in initIntoData.data.attributeConfigJson[1].tips">
          <li>
            <span>{{index+1}}. </span>
            <span class="strong">{{item.split("：")[0]}}</span>
          </li>
        </ul>
        <!--<ol style="list-style-position:inside">-->
          <!--<li>-->
            <!--营业执照未变更为三证合一类型，请在此上传营业执照、组织机构代码证和税务登记证,需提供正副本复印件；-->
          <!--</li>-->
          <!--<li>-->
            <!--请上传扫描件或复印件，每个文件大小<5M ，需以图片形式上传。-->
          <!--</li>-->
        <!--</ol>-->
        <table class="info-table">
          <tr v-for="(items,indexs) in initIntoData.data.attributeConfigJson[1].attributes">
            <th class="label"><span class="required">*</span>{{items.name}}</th>
            <td v-if="indexs==0" colspan="3">
              <FormItem prop="distributorName">
                <Input
                  v-model="form.distributorName"
                  placeholder="请输入"
                  style="width: 300px"
                />
              </FormItem>
            </td>
            <td v-else colspan="3">

              <Upload
                action="/portal/pub/comm/uploadimage"
                :on-success="handleComplete.bind(this,items.code)"
                :default-file-list='form[items.code+"List"]'
                :before-upload="handleSelect.bind(this,items.code+'List')"
                :on-remove="handleRemove.bind(this,items.code)"
                :on-preview="handleReview"
                :on-format-error="handleFormatError"
                accept="image/*"
              >
                <Button type="ghost">上传文件</Button>
              </Upload>
              <div v-if="items.subFields!=null">
                <Col span="12" style="float:left">
                  <DatePicker type="daterange"  @on-change="getAttrLicenseT" v-model="form.attrlicense_time"    placeholder="Select date" style="width: 200px"></DatePicker>
                </Col>
              </div>

            </td>
          </tr>

        </table>
      </Form>
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
  </div>
</template>
<script>
  import {mapState} from 'vuex';
  import TopToolBar from '@/components/Common/TopToolBar.vue';
  // loading 组件
  import Loading from '@/components/Common/Loading.vue';
  import {validatePhone} from '@/utils/validate';
  export default {
    name: 'apply',
    computed: {
      ...mapState(['token','initIntoData'])
    },
    components: {
      TopToolBar,
      Loading
    },
    data() {
      return {
        spinShow: false,
        imageLoadingText: '',
        preview: false,
        previewUrl: '',
        localization: {
          select: '上传',
          cancel: '取消',
          statusFailed: '失败',
          statusUploaded: '成功',
          statusUploading: '上传中',
          headerStatusFailed: '失败',
          headerStatusUploaded: '成功',
          headerStatusUploading: '上传中'
        },
        loading: false,
        wait: 60,
        btnText: '获取验证码',
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
          productApplySummaryList: []
        },
        formRule: {
          orgInfoName: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          projectType: [
            {required: true, message: ' '}
          ],
          legalName: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          legalCard: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          legalPhone: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          legalEmail: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          fax: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          registeredCapital: [
            {required: true, message: ' ', trigger: 'blur', pattern: '^[0-9]*$'}
          ],
          authorizedPhone: [
            {
              required: true,
              message: ' ',
              trigger: 'blur',
              pattern: '^[0-9]*$',
              length: 11
            }
          ],
          smsCode: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          registerAddress: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          productAddress: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          mailingAddress: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          postalCode: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          turnover: [
            {required: true, message: ' ', trigger: 'blur', pattern: '^[0-9]*$'}
          ],
          authorizedName: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          distributorName: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          url: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          license_time: [
            {required: true, message: ' ', trigger: 'blur'}
          ],
          attrlicense_time: [
            {required: true, message: ' ', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.getInitInputName(0);
      this.getInitInputName(1);
    },
    methods: {
      getAttrLicenseT(nData){
        this.form.distributor_license_start = nData[0];
        this.form.distributor_license_end = nData[1];
      },
      getLicenseT(newData){
        this.form.license_start = newData[0];
        this.form.license_end = newData[1];
      },
      getInitInputName(ind) {
        let tagName = this.initIntoData.data.attributeConfigJson[ind].attributes;
        for (let val of tagName) {
          let keys = val['code'],subField = val['subFields'];
          this.form[keys] = '';
          this.form[keys+"List"] = [];
          if(subField!=null){
            let timeStartTag = subField[0].code,timeEndTag = subField[1].code;
            this.form[timeStartTag] = '';
            this.form[timeEndTag] = ''
          }
        }
      },
      sendCode() {
        if (this.form.authorizedPhone && validatePhone(this.form.authorizedPhone)) {
          this.$store.dispatch('sendCode', {phone: this.form.authorizedPhone}).then(payload => {
            if (payload.success) {
              this.$Message.success('短信发送成功!');
              // 60s 计时
              this.timer();
            }
          });
        } else {
          this.$Message.warning('请输入被授权人联系电话!');
        }
      },
      timer() {
        if (this.wait === 0) {
          this.btnText = '获取验证码';
          this.wait = 60;
        } else {
          this.btnText = this.wait + 's后重新发送';
          this.wait = this.wait - 1;
          setTimeout(() => {
            this.timer();
          }, 1000);
        }
      },
      handleComplete(target, response) {
        if (response && response.success) {
          this.form[target + 'List'].push(response.content);
          this.form[target] = this.form[target + 'List'].map(i => i.id).join(',');
        }
      },
      handleRemove(target, file, files) {
        this.form[target + 'List'] = files;
        this.form[target] = files.map(i => i.id).join(',');
      },
      onSubmit(evt) {
        evt.preventDefault();
        this.$refs['form'].validate((valid, error) => {
          if (valid) {
            this.loading = true;
            var attrJson = {
              logo: this.form.logo,
              base_situation: this.form.base_situation,
              hos_commitment: this.form.hos_commitment,
              company_warrant: this.form.company_warrant,
              business_license: this.form.business_license,
              license_start: this.form.license_start,
              license_end: this.form.license_end,
              sales_volume: this.form.sales_volume,
              no_illegality_statement: this.form.no_illegality_statement,
              no_illegality_result: this.form.no_illegality_result,
              product_apply_summary: this.form.product_apply_summary,
              product_quality_statement: this.form.product_quality_statement,
              distributor_name: this.form.distributorName,
              distributor_business_license: this.form.distributor_business_license,
              distributor_license_start: this.form.distributor_license_start,
              distributor_license_end: this.form.distributor_license_end,
              distributor_warrant: this.form.distributor_warrant,
              distributor_licence: this.form.distributor_licence
            };
            var strAttrJson = JSON.stringify(attrJson);
            this.updata = {
              orgInfoName: this.form.orgInfoName,
              projectType: this.form.projectType,
              legalName: this.form.legalName,
              legalCard: this.form.legalCard,
              legalPhone: this.form.legalPhone,
              legalEmail: this.form.legalEmail,
              fax: this.form.fax,
              url: this.form.url,
              registeredCapital: this.form.registeredCapital,
              turnover: this.form.turnover,
              authorizedPhone: this.form.authorizedPhone,
              smsCode: this.form.smsCode,
              registerAddress: this.form.registerAddress,
              productAddress: this.form.productAddress,
              mailingAddress: this.form.mailingAddress,
              postalCode: this.form.postalCode,
              authorizedName: this.form.authorizedName,
              attributeJson: strAttrJson
            }

            this.$store.dispatch('apply/save', this.updata).then(payload => {
              // 取消loading状态
              this.loading = false;
              if (payload && payload.success) {
                this.$router.push({path: `/ma1/detail/${payload.content.aup2OrgInfo.id}`});
              }
            });
          } else {
            this.$Message.warning('输入不完整或输入格式有误!');
          }
        });
      },
      handleReview(file) {
        this.spinShow = true;
        this.preview = true;
        this.imageLoadingText = '';
        const image = document.querySelector('#previewUrl');
        if(file.response!=null){
          image.src = file.response.content.url//update
        }else{
          image.src = file.url;
        }
        image.onload = (e) => {
          this.previewUrl = image.src;//update
          this.spinShow = false;
        };
        image.onerror = (e) => {
          this.imageLoadingText = '图片加载失败';
        };
      },
      handleSelect(target, file) {
        if (this.form[target].length > 6) {
          if (target === 'productApplySummaryList') {
            this.$Message.warning('最多只能上传七张照片，如果超过7张，请从第七张开始打包成ZIP格式上传!');
          } else {
            this.$Message.warning('最多只能上传七张照片!');
          }
          return false;
        } else {
          return true;
        }
      },
      handleFormatError(e) {
        this.$Message.warning('请上传图片');
      },
      handleFormatErrorZip(e) {
        this.$Message.warning('请上传图片或zip压缩包');
      },
      handleExceededSize() {
        this.$Message.warning('图片不得大于5M/张');
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss">
  .ivu-form-item {
    margin-bottom: 0 !important;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>

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

  .note, .required {
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
      line-height: 37px;
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
    .remove {
      color: red;
      cursor: pointer;
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
