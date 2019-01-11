<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'企业申报'">
      <small  slot="text" v-if="auditStatus == 1">您还未提交过企业资料，请直接对以下信息进行填报！
      </small>
      <span slot="btn">
        <Button type="default" v-if="auditStatus != -1" @click="$router.push({path:`/LCSB/LCSB001/detail/${form.id}`})">取消</Button>
        <Button type="primary" @click="onSubmit" :disabled="subStates">保存</Button>
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
              <p class="text-pre">{{ form.auditOpinion?form.auditOpinion:'无' }}</p>
            </td>
          </tr>
        </table>
      </div>

      <h5 class="title">基本资料</h5>
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
                  readonly
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
                  readonly
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
          <!-- <tr v-if="form.authorizedPhone!==mobile">
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

          </tr> -->
        </table>
        <!-- 生成自动模块 -->
        <div v-for='obj in model' :key='obj.index'>
           <!-- head -->
           <h5 class="title">
            {{ obj.title }}
          </h5>
           <div v-if="obj.tips.length" class="tip">
            <span class="note">温馨提示：</span>
            </div>
            <ol style="list-style-position:inside">
              <li v-for='item of obj.tips' :key='item.index'>
                {{ item }}
              </li>
            </ol>
           <!-- head end-->
           <!-- option -->
            <table class="info-table">
              <tr v-for='item in obj.attributes' :key='item.index'>
                <th class="label"><div><span v-if="!item.allowBlank" class="required">*</span> {{ item.name }}</div><div v-if="item.note!=null">{{ item.note }}</div> </th>
                <td :colspan="item.templates?2:3">
                  <!-- 上传文件 -->
                  <Upload v-if="item.type === 'file'"
                    action="/portal/pub/comm/uploadimage"
                    :on-success="handleComplete.bind(this,item.datasName)"
                    :on-remove="handleRemove.bind(this,
                    item.datasName)"
                    :default-file-list="server[item.datasName]"
                    :before-upload="handleSelect.bind(this,item.datasName)"
                    :on-preview="handleReview"
                    :on-format-error="handleFormatErrorZip"
                    :format="['jpg','jpeg','png','gif','zip']"
                  >
                    <Button type="ghost">上传文件</Button>
                  </Upload>
                  <!-- 上传文件//accept="image/*" end-->
                  <!-- 字符串 -->
                  <FormItem v-else-if='item.type === "string"'>
                    <Input
                      v-model="server[item.code]"
                      placeholder="请输入"
                      style="width: 300px"
                    />

                  </FormItem>
                  <!-- 字符串 end-->
                  <!-- 子组件 -->
                  <Row  v-if='item.subFields' type='flex' :gutter='15' >
                    <Col v-for='cell of item.subFields' :key='cell.index'>
                      <span style="width: 120px" >{{ cell.name }}</span>
                      <Date-picker v-if='cell.type === "date"' format="yyyy/MM/dd" v-model="server[cell.code]" type="date" :placeholder="cell.name" style="width: calc(100%-120px)"  ></Date-picker>
                    </Col>
                  </Row>
                  <!-- 子组件 -->
                   <!-- 审核用 -->
                    <div v-if="item.type === 'file' && form.auditStatus==4 && server[item.datasName].length  ||item.type === 'file'&& form.auditStatus==5 && server[item.datasName].length ">

                      <div v-if="auditData!=null">
                          <p v-if="item.code in auditData">
                            <span>审核状态：</span>
                            <span  style="color:#f00">
                            不通过
                          </span>
                          </p>
                          <p v-if="item.code in auditData">
                            <span>审核意见：</span>
                            <span  class="text-pre" >{{auditData[item.code]}}
                            </span>
                          </p>
                      </div>
                      <!--<p><span>审核状态：</span>-->
                        <!--{{item.code}}-->
                        <!--<br>-->
                        <!--{{auditData}}-->
                        <!--<span v-if="!form[item.code]" style="color:#008000">-->
                          <!--通过-->
                        <!--</span>-->
                        <!--<span v-else style="color:#f00">-->
                          <!--不通过-->
                        <!--</span>-->
                      <!--</p>-->
                      <!--<p><span>审核意见：</span>-->
                        <!--<span>-->
                          <!--{{ form[item.code]?form[item.code]:'无' }}-->
                        <!--</span>-->
                      <!--</p>-->
                    </div>
                    <!-- 审核用 end -->
                </td>
                <td style="width: 120px;text-align: center" v-if=" item.templates">
              <p v-for='text of item.templates' :key='text.index'>
                <a
                  :href="text.url"
                  target="_blank">{{ text.name }}</a>
              </p>
            </td>
              </tr>
            </table>
           <!-- option end-->

        </div>
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
import { mapState } from 'vuex'
import TopToolBar from '@/components/Common/TopToolBar.vue'
// loading 组件
import Loading from '@/components/Common/Loading.vue'
import { validatePhone } from '@/utils/validate'
import validatejs from '../../assets/js/validate'
export default {
  name: 'apply',
  computed: {
    ...mapState(['token'])
  },
  components: {
    TopToolBar,
    Loading
  },
  data() {
    /**
     *  身份证位数验证
     */
    const cardNoCheck = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (value.length === 9) {
        callback()
      } else if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('身份证格式不正确'))
      }
    }
    /*
    * 手机号格式、是否重复验证
    * */
    const validatePhone = (rule, value, callback) => {
      let phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/
      if (phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式不正确'))
      }
    }
    /**
     * 邮箱验证
     */
    const validateMail = (rule, value, callback) => {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    /**
     * 数字验证
     */
    const validateNum = (rule, value, callback) => {
      let reg = /^(0.[1-9]*||[1-9][0-9]?||[1-9][0-9]*.[0-9]+)$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('营业额格式不正确'))
      }
    }
    return {
      checkresult: [
        { label: '未提交', value: '1' },
        { label: '待审核', value: '2' },
        { label: '审核中', value: '3' },
        { label: '通过', value: '4' },
        { label: '未通过', value: '5' }
      ],
      // 后端的动态参数
      server: '',
      // 文件模块,
      auditStatus: -1,
      model: [],
      subStates: false,
      attributeConfigJson: [],
      spinShow: false,
      imageLoadingText: '',
      preview: false,
      previewUrl: '',
      auditData: '', //审核信息
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
      form: { projectType: '' },
      formRule: {
        orgInfoName: [
          { required: true, message: '企业名称不能为空', trigger: 'blur' }
        ],
        projectType: [{ required: true, message: '企业类型不能为空' }],
        legalName: [
          { required: true, message: '法人姓名不能为空', trigger: 'blur' }
        ],
        legalCard: [
          { required: true, message: '法人身份证号不能为空', trigger: 'blur' },
          { validator: cardNoCheck, trigger: 'blur' }
        ],
        legalPhone: [
          { required: true, message: '法人联系电话不能为空', trigger: 'blur' },
          { validator: validatejs.validateAllPhone, trigger: 'blur' }
        ],
        legalEmail: [
          { required: true, message: '电子邮箱不能为空', trigger: 'blur' },
          { validator: validateMail, trigger: 'blur' }
        ],
        fax: [{ required: true, message: '传真不能为空', trigger: 'blur' }],
        authorizedName: [
          { required: true, message: '被授权人姓名不能为空', trigger: 'blur' }
        ],
        registeredCapital: [
          { required: true, message: '注册资金不能为空 ', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],
        postalCode: [
          { required: true, message: '邮政编码不能为空 ', trigger: 'blur' }
        ],
        authorizedPhone: [
          {
            required: true,
            message: '被授权人联系电话不能为空 ',
            trigger: 'blur'
          },
          { validator: validatePhone, trigger: 'blur' }
        ],
        smsCode: [
          { required: true, message: '手机验证码不能为空', trigger: 'blur' }
        ],
        registerAddress: [
          { required: true, message: '注册地址不能为空 ', trigger: 'blur' }
        ],
        productAddress: [
          { required: true, message: '生产地址不能为空 ', trigger: 'blur' }
        ],
        mailingAddress: [
          { required: true, message: '通讯地址不能为空 ', trigger: 'blur' }
        ],

        turnover: [
          { required: true, message: '营业额不能为空 ', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ],

        // distributorName: [
        //   { required: true, message: '企业名称不能为空', trigger: 'blur' }
        // ],
        url: [{ required: true, message: '网址不能为空 ', trigger: 'blur' }]
      },
      mobile: ''
    }
  },

  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('apply/into', this.$route.params).then(payload => {
        this.loading = false
        if (payload.success && payload.content) {
          // 回填数据 input.value type string
          for (let k in payload.content.data) {
            let val = payload.content.data[k]
            if (typeof val === 'number') {
              val = String(val)
            }
            // form
            if (typeof val !== 'object' && k !== 'createTime') {
              this.form[k] = val
            }
          }
          let object = payload.content.data
          this.auditData = payload.content.data.auditData
          if (object.auditStatus == null) {
            this.auditStatus = -1 // 初始进来时候设置为-1
          } else {
            this.auditStatus = object.auditStatus
          }

          // 编辑自己的模块
          // 服务器参数
          this.server = {}
          // init attributeJson
          if (!object.attributeJson) object.attributeJson = {}
          for (let k = 0; k < object.attributeConfigJson.length; k++) {
            // 提示内容
            let d = object.attributeConfigJson[k]
            this.model[k] = {}
            //  tip
            this.model[k].title = d.name
            this.model[k].tips = d.tips
            // form 结构
            this.model[k].attributes = d.attributes

            //  组件
            for (let item of this.model[k].attributes) {
              //
              let key = item.code
              // get服务器图组
              if (item.type === 'file') {
                item.datasName = key + '_fileInfos'
                /**
                 * 默认图片组
                 * @namespace
                 */
                let imgs = []
                // set files of the config
                let server_img = object.attributeJson[item.datasName]
                if (server_img && server_img.length) {
                  server_img.map(v => {
                    if (v) {
                      imgs.push(v)
                    }
                  })
                }
                this.server[item.datasName] = imgs
              }
              // 图片ids
              let val = object.attributeJson[item.code]
              this.server[item.code] = val ? val : ''
              // 子数据数据
              if (item.subFields) {
                for (let cell of item.subFields) {
                  let val = object.attributeJson[cell.code]
                  this.server[cell.code] = val ? val : ''
                }
              }
            }
          }
          // 内容循环
          // this.form.smsCode = ''
          // this.mobile = payload.content.data.authorizedPhone
        }
      })
    },
    sendCode() {
      if (
        this.form.authorizedPhone &&
        validatePhone(this.form.authorizedPhone)
      ) {
        this.$store
          .dispatch('sendCode', { phone: this.form.authorizedPhone })
          .then(payload => {
            if (payload.success) {
              this.$Message.success({ content: '短信发送成功' })
              // 60s 计时
              this.timer()
            }
          })
      } else {
        this.$Message.warning({ content: '请输入被授权人联系电话' })
      }
    },
    timer() {
      if (this.wait === 0) {
        this.btnText = '获取验证码'
        this.wait = 60
      } else {
        this.btnText = this.wait + 's后重新发送'
        this.wait = this.wait - 1
        setTimeout(() => {
          this.timer()
        }, 1000)
      }
    },
    /**
     * 上传图片 处理
     * @param {Array} items 上传的图片组
     * @param {Object} response 服务器返回
     */
    handleComplete(name, response, file, fileList) {
      // 保存到图片组中
      if (response && response.success) {
        //  console.log(fileList)
        // let id = item.id.split(',')||[item.id]
        // id.push(response.success.id)
        // item.id = id.map(i => i).join(',')
        this.server[name].push(response.content)
        //console.log('+',this.server[name])
      }
    },
    /**
     * 删除数据
     * @param {number} n 上传的图片组
     * @param {Object} file 被删除的对象
     * @param {Array} files 剩与的图片组
     */
    handleRemove(name, file, files) {
      // 当前数据
      let arr = []
      for (let v of files) {
        if (v.response) {
          arr.push(v.response.content)
        } else {
          arr.push(v)
        }
      }
      //console.log('-',arr)
      this.server[name] = arr
      // this.server[name] = JSON.parse(JSON.stringify(files))
    },
    /**
     * 提交数据
     */
    onSubmit(evt) {
      evt.preventDefault()
      this.$refs['form'].validate((valid, error) => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.form))
          // 动态数据组
          // param.attributeJson = this.server
          for (let imgObject of this.model) {
            for (let item of imgObject.attributes) {
              let name = item.code
              if (!this.validateModel(item)) {
                param = ''
                break
                return
              }
              // 子组件循环
              if (item.subFields) {
                for (let cell of item.subFields) {
                  if (!this.validateModel(cell)) {
                    param = ''
                    break
                    return
                  }
                }
              }
              // 子组件循环 end
            }
          }

          // 跳出

          if (!param) return
          let json = {}
          for (let k in this.server) {
            if (typeof this.server[k] !== 'object') {
              json[k] = this.server[k]
            }
          }
          param.attributeJson = String(JSON.stringify(json))
          this.subStates = true
          this.loading = true
          // 执行数据提交
          this.$store.dispatch('apply/save', param).then(
            payload => {
              // 取消loading状态
              this.loading = false
              this.subStates = false
              if (payload && payload.success) {
                // 刷新页面
                this.$router.push({
                  path: `/LCSB/LCSB001/detail/${payload.content.aup2OrgInfo.id}`
                })
              }
            },
            err => {
              this.loading = false
              this.subStates = false
            }
          )
        }
      })
    },
    // 数据验证
    validateModel(item, params) {
      if (item.type === 'file') {
        // 不为空验证
        if (!item.allowBlank && !this.server[item.datasName].length) {
          this.$Message.warning(item.name + '未上传图片')
          return false
        } else {
          this.server[item.code] = this.server[item.datasName]
            .map(i => i.id)
            .join(',')
        }
        // 图片组 id
      } else if (item.type === 'string') {
        // 文本
        if (!item.allowBlank && !this.server[item.code]) {
          this.$Message.warning(item.name + '未填写')
          return false
        }
      } else if (item.type === 'date') {
        // 日期格式
        if (!item.allowBlank && !this.server[item.code]) {
          this.$Message.warning(item.name + '未填写')
          return false
        }
        if (this.server[item.code]) {
          let date = new Date(this.server[item.code])
          let y = date.getFullYear()
          let m = date.getMonth() + 1
          let d = date.getDate()
          date = `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`
          this.server[item.code] = date
        }
      }
      return true
    },
    /**
     * 图片预览
     */
    handleReview(file) {
      if (file.response) file = file.response.content
      if (file.name.indexOf('zip') != -1) {
        window.open(file.url)
        return
      }
      this.spinShow = true
      this.preview = true
      this.imageLoadingText = ''
      const image = document.querySelector('#previewUrl')
      image.src = file.url
      image.onload = e => {
        this.previewUrl = file.url
        this.spinShow = false
      }
      image.onerror = e => {
        this.imageLoadingText = '图片加载失败'
      }
    },
    /**
     * 选择上传判断
     * @param {objerct} target 上传队列
     */

    handleSelect(name) {
      let target = this.server[name]
      //console.log(target)
      if (target.length > 6) {
        this.$Message.warning('最多只能上传7份文件!')
        return false
        // dis
        if (target === 'productApplySummaryList') {
        } else {
          this.$Message.warning('最多只能上传七张照片!')
        }
        return false
      } else {
        return true
      }
    },
    //
    handleFormatError(e) {
      this.$Message.warning('请上传图片')
    },
    handleFormatErrorZip(e) {
      this.$Message.warning('请上传图片或zip压缩包')
    },
    handleExceededSize() {
      this.$Message.warning('图片不得大于5M/张')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.ivu-form-item {
  margin-bottom: 0;
}
.title {
  background: #f1f1f1;
  padding: 8px;
  font-size: 16px;
  color: #333;
}

.tip {
  line-height: 30px;
}

p {
  line-height: 25px;
  margin: 10px 0;
}

.note,
.required {
  color: #ea5a46;
}

.remove {
  color: red;
  cursor: pointer;
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
}
</style>
