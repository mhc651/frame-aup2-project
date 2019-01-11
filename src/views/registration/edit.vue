<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="title">
       <span slot="btn">
         <!--<Button type="primary" @click="$router.push({path:pathArray[0]+`/edit/${form.id}`})">编辑</Button>-->
         <Button type="primary" @click="onSubmit">保存</Button>
         <Button type="primary" @click="backs()">取消</Button>

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
            </td>
          </tr>
        </table>
      </div>

      <h5 class="title">基本信息</h5>

      <Form @submit="onSubmit" ref="registerCard" :model="registerCard" :rules="formRule" id="forms">
        <table class="info-table">
          <tr>
            <th class="label"><span class="required">*</span>注册证编号</th>
            <td>
              <FormItem prop="registerCardNo">
                <Input
                  v-model="registerCard.registerCardNo"
                  placeholder="请输入"
                  :disabled="show"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>注册证有效期起</th>
            <td>
                <Row>
                  <Col span="12">
                    <FormItem prop="validityStart">
                      <!--<Date-picker   :value="registerCard.validityStart" type="date" format="yyyy-MM-dd"  style="width: 200px"></Date-picker>-->
                      <DatePicker type="date"  @on-change="getRegisters" :value="registerCard.validityStart"    style="width: 200px"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>注册证名称</th>
            <td>
              <FormItem prop="registerCardName">
                <Input
                  v-model="registerCard.registerCardName"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label"><span class="required">*</span>注册证有效期止</th>
            <td>
              <Row>
                <Col span="12">
                  <FormItem prop="validityEnd">
                    <!--<Date-picker   :value="registerCard.validityStart" type="date" format="yyyy-MM-dd"  style="width: 200px"></Date-picker>-->
                    <DatePicker type="date"  @on-change="getRegistere" :value="registerCard.validityEnd"    style="width: 200px"></DatePicker>
                  </FormItem>
                </Col>
              </Row>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>产品名称(中文)</th>
            <td>
              <FormItem prop="name">
                <Input
                  v-model="registerCard.name"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label">产品名称(英文)</th>
            <td>
              <FormItem prop="nameEn">
                <Input
                  v-model="registerCard.nameEn"
                  placeholder="请输入"
                />
              </FormItem>
            </td>

          </tr>
          <tr>
            <th class="label"><span class="required">*</span>生产企业(中文)</th>
            <td>
              <FormItem prop="manufactureName">
                <Input
                  v-model="registerCard.manufactureName"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
            <th class="label">生产企业(英文)</th>
            <td>
              <FormItem prop="manufactureNameEn">
                <Input
                  v-model="registerCard.manufactureNameEn"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>产地</th>
            <td>
              <div>
                <FormItem prop="origin">
                  <Select   v-model="registerCard.origin" style="width: 200px">
                    <Option v-for="item in originList" :value="item.value" :key="item.value">{{item.label}}</Option>
                  </Select>
                </FormItem>
              </div>
            </td>
            <th class="label">代理企业</th>
            <td>
              <FormItem prop="proxyName">
                <Input
                  v-model="registerCard.proxyName"
                  placeholder="请输入"
                />
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label"><span class="required">*</span>管理类别</th>
            <td>
              <div>
                <FormItem prop="managementType">
                  <Select   v-model="registerCard.managementType" style="width: 200px">
                    <Option v-for="item in managementTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>
                  </Select>
                </FormItem>
              </div>
            </td>
            <th class="label"><span class="required">*</span>分类目录</th>
            <td>
              <FormItem prop="aup2ProjectTypeId">
                <Select placeholder = '请选择产品分类' :disabled="show" v-model="registerCard.aup2ProjectTypeId" style="width:200px">
                  <Option v-for="item in categories" :value="item.value" :key="item.value">{{item.label}}</Option>
                </Select>
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label">注册证型号</th>
            <td colspan="3">
              <FormItem prop="model">
                <Input v-model="registerCard.model" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label">注册证规格</th>
            <td colspan="3">
              <FormItem prop="standard">
                <Input v-model="registerCard.standard" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label">结构及组成</th>
            <td colspan="3">
              <FormItem prop="structure">
                <Input v-model="registerCard.structure" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
              </FormItem>
            </td>
          </tr>
          <tr>
            <th class="label">使用范围</th>
            <td colspan="3">
              <FormItem prop="scope">
                <Input v-model="registerCard.scope" type="textarea" :autosize="{minRows: 2,maxRows: 5}" ></Input>
              </FormItem>
            </td>
          </tr>
        </table>
      </Form>


      <h5 class="title">
        <span v-if="registerCard.attributeConfigJson.length">
          {{registerCard.attributeConfigJson[0].name}}
        </span>
      </h5>

      <!--<table class="info-table" v-if="registerCard.attributeConfigJson!=null">-->
      <!--<tr  v-for="item in registerCard.attributeConfigJson[0].attributes">-->
      <!--<th class="label">{{item.name}}</th>-->
      <!--<td colspan="2">-->
      <!--资质图片:-->
      <!--<div v-for="vitem,key in registerCard.attributeJson">-->
      <!--<div v-if="item.code+'_fileInfos'==key">-->
      <!--<p v-for="val in vitem">-->
      <!--<span  class="review" v-text="val.name" @click="handleReview(val.url,val.name)"></span>-->
      <!--</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--</td>-->
      <!--<td colspan="1" v-if="item.templates!=null">-->
      <!--<p>-->
      <!--<a v-bind:href="item.templates[0].url"   target="_blank">模板下载</a>-->
      <!--</p>-->
      <!--</td>-->
      <!--<td colspan="1" v-else>-->
      <!--</td>-->
      <!--</tr>-->
      <!--</table>-->


      <table class="info-table" v-if="registerCard.attributeConfigJson.length">
        <tr v-for="(items,indexs) in registerCard.attributeConfigJson[0].attributes">
          <th class="label"><span v-if="!items.allowBlank" class="required">*</span> {{items.name}}</th>

          <td colspan="3">
            <Upload
              action="/portal/pub/comm/uploadimage"
              :on-success="handleComplete.bind(this,items.code)"
              :default-file-list='registerCard.attributeJson[items.code+"_fileInfos"]!=null? registerCard.attributeJson[items.code+"_fileInfos"]:[]'
              :before-upload="handleSelect.bind(this,items.code+'_fileInfos')"
              :on-remove="handleRemove.bind(this,items.code)"
              :on-preview="handleReview"
              :on-format-error="handleFormatError"
              :format="['jpg','jpeg','png','gif','zip']"
            >
              <Button type="ghost">上传文件</Button>
            </Upload>


            <div v-if="registerCard.auditStatus==4 || registerCard.auditStatus==5">
              <div v-if="registerCard.auditData!=null">
                <p v-if="items.code in registerCard.auditData"><span>审核状态：</span>
                  <span  style="color:#f00">
                        不通过
                      </span>
                </p>

                <p v-if="items.code in registerCard.auditData"><span>审核意见：</span>
                  <span   class="text-pre">
                          {{registerCard.auditData[items.code]}}
                        </span>
                </p>
              </div>
            </div>

          </td>
          <td style="width: 120px;text-align: center" v-if="items.templates!=null&&items.templates.length>0">
            <p>
              <a v-bind:href="items.templates[0].url"   target="_blank">模板下载</a>
            </p>
          </td>
          <td style="width: 120px;text-align: center" v-else>
          </td>
        </tr>

      </table>

      <!--<h5 class="title">-->
      <!--组件-->
      <!--</h5>-->
      <!--<Table-->
      <!--border-->
      <!--:columns="columns"-->
      <!--:data="subGroup"-->
      <!--:size="'small'"-->
      <!--&gt;</Table>-->
      <!--<div class="pager" style="margin-top: 15px">-->
      <!--<Page-->
      <!--:total="total"-->
      <!--show-elevator-->
      <!--show-total-->
      <!--@on-change="handlePager"-->
      <!--&gt;-->
      <!--</Page>-->
      <!--</div>-->
      <Modal
        width="800"
        v-model="preview"
        title="查看大图"
        @on-ok=""
        @on-cancel="preview = false">
        <img :src="previewUrl" alt="" style="width: 100%" id="previewUrl">
      </Modal>
    </div>
  </div>
</template>
<script>
  import TopToolBar from '@/components/Common/TopToolBar.vue'
  // loading 组件
  import Loading from '@/components/Common/Loading.vue'
  import { remove } from '../../assets/js/common.js'
  import { mapState, mapActions  } from 'vuex'
  export default {
    name: 'registration',
    computed: {},
    components: {
      TopToolBar,
      Loading
    },
    data() {
      return {
        loading: false,
        subGroup: [],
        originList: [],
        managementTypeList: [],
        show: false,
        title: "",
        checkresult:[{"label":"未提交","value":"1"},{"label":"待审核","value":"2"},{"label":"审核中","value":"3"},{"label":"通过","value":"4"},{"label":"未通过","value":"5"}],
        registerCard: {
          registerCardNo: '',
          registerCardName: '',
          validityStart: '',
          validityEnd: '',
          origin: '',
          managementType: '',
          name: '',
          nameEn: '',
          standard: '',
          model: '',
          manufactureName: '',
          manufactureNameEn: '',
          proxyName: '',
          expirationStart: '',
          expirationEnd: '',
          approvalDate: '',
          structure: '',
          scope: '',
          medicalFile: '',
          auditStatus: '',
          aup2ProjectTypeId: '',
          orgInfoId: '',
          orgInfoName: '',
          medicalFileList: [],
          registFileList: [],
          fdaFileList: [],
          otherFileList: [],
          attributeConfigJson: []
        },
        categories: [],
        formRule: {
          registerCardNo: [
            { required: true, message: '注册证编号不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '产品名称(中文)不能为空', trigger: 'blur' }
          ],
          manufactureName: [
            { required: true, message: '生产企业(中文)不能为空', trigger: 'blur' }
          ],
          registerCardName: [
            { required: true, message: '注册证名称不能为空', trigger: 'blur' }
          ],
          origin: [
            { required: true, message: '产地不能为空', trigger: 'change' }
          ],
          managementType: [
            { required: true, message: '管理类别不能为空', trigger: 'change' }
          ],
          aup2ProjectTypeId: [
            { required: true, message: '分类目录不能为空', trigger: 'change' }
          ],
          validityStart: [
            { required: true, message: '注册证有效期起不能为空', trigger: 'change' }
          ],
          validityEnd: [
            { required: true, message: '注册证有效期止不能为空', trigger: 'change' }
          ]
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
            align: 'center'
            // render: (h, r) => {
            //   // 查看图片
            //   if (r.row.jpgFileList.length) {
            //     let htm = []
            //     for (let item of r.row.jpgFileList) {
            //       let dom = h(
            //         'Button',
            //         {
            //           props: {
            //             type: 'primary',
            //             size: 'small'
            //           },
            //           style: {
            //             marginRight: '5px',
            //             marginBottom:'5px'
            //           },
            //           on: {
            //             click: () => {
            //               this.handleReview(item.url)
            //             }
            //           }
            //         },
            //         '查看'
            //       )
            //       htm.push(dom)
            //     }
            //     return h('div', htm)
            //   } else {
            //     return h('span', {}, '无')
            //   }
            // }
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
        if(msedit=='1'){
          this.$router.push({
            path: `/ma1/registration/${this.$route.params.registerId}`
          })
        }else{
          this.$router.back(-1)
        }

      },
      getRegisters(nData) {
        this.registerCard.validityStart = nData
      },
      getRegistere(nData) {
        this.registerCard.validityEnd = nData
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
      handleComplete(target, response, file ,files) {
        if (response && response.success) {
          let nPicidArray = [],oldpicid = this.registerCard.attributeJson[target],nPicidInfoList = [], oldpicInfo = this.registerCard.attributeJson[target + '_fileInfos']
          nPicidArray.push(response.content.id)
          nPicidInfoList.push(response.content)
          if(oldpicInfo==null){
            this.registerCard.attributeJson[target + '_fileInfos'] = []
          }
          if(oldpicid!=''){
            oldpicid = this.registerCard.attributeJson[target].split(",")
            this.registerCard.attributeJson[target] = oldpicid.concat(nPicidArray).join(",")
          }else{
            this.registerCard.attributeJson[target] = nPicidArray.join(",")
          }
          oldpicInfo.push(response.content)
          console.log("添加添加"+this.registerCard.attributeJson[target])
        }
      },
      handleRemove(target, file, files) {
        if(files!=null){
          this.registerCard.attributeJson[target + '_fileInfos'] = files
        }
        this.registerCard.attributeJson[target] = files.map(i => i.id).join(',')
        console.log("删除删除"+this.registerCard.attributeJson[target])
      },
      handleSelect(target, file) {
        if (this.registerCard.attributeJson[target]!=null && this.registerCard.attributeJson[target].length > 6) {
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
        this.$Message.warning('请上传图片或zip压缩包');
      },
      /**
       * 提交数据
       */
      onSubmit(evt) {
        evt.preventDefault()
        this.$refs['registerCard'].validate((valid, error) => {
          if (valid) {
            let attributeJsons = {
              medical_file:this.registerCard.attributeJson.medical_file,
              product_file:this.registerCard.attributeJson.product_file,
              fda_file:this.registerCard.attributeJson.fda_file,
              quality_file:this.registerCard.attributeJson.quality_file,
              check_file:this.registerCard.attributeJson.check_file,
              patent_file:this.registerCard.attributeJson.patent_file,
              invoices_file:this.registerCard.attributeJson.invoices_file,
              other_file:this.registerCard.attributeJson.other_file
            }
            let param = {
              //id:this.$route.params.registerId,
              registerCardNo:this.registerCard.registerCardNo,
              registerCardName:this.registerCard.registerCardName,
              name:this.registerCard.name,
              nameEn:this.registerCard.nameEn,
              manufactureName:this.registerCard.manufactureName,
              manufactureNameEn:this.registerCard.manufactureNameEn,
              proxyName:this.registerCard.proxyName,
              origin:this.registerCard.origin,
              managementType:this.registerCard.managementType,
              standard:this.registerCard.standard,
              model:this.registerCard.model,
              aup2ProjectTypeId:this.registerCard.aup2ProjectTypeId,
              validityStart:this.registerCard.validityStart,
              validityEnd:this.registerCard.validityEnd,
              structure:this.registerCard.structure,
              scope:this.registerCard.scope,
              attributeJson:JSON.stringify(attributeJsons)

          }

            if(this.$route.params.registerId!='add'){/*新增注册证*/
              param.id = this.$route.params.registerId
            }
            //console.log("666 :"+JSON.stringify(param))
            this.$store.dispatch('registration/saveRegistraction', param).then(payload => {
              // 取消loading状态
              this.loading = false
              if (payload && payload.success) {
                // 刷新页面
                this.$Message.success({content:'成功'})
                //this.$router.back(-1)
                if(this.$route.params.registerId=='add'){
                  this.$router.push({
                    path: `/LCSB/LCSB003`
                  })
                }else{
                  let msedit = sessionStorage.getItem('mlistedit')
                  if(msedit=='1'){
                    this.$router.push({
                      path: `/ma1/registration/${this.$route.params.registerId}`
                    })
                  }else{
                    this.$router.back(-1)
                  }

                  //this.$router.back(-1)
                  // this.$router.push({
                  //   path: `/ma1/registration/${this.$route.params.registerId}`
                  // })
                }


              }

            })

          }
        })
      },
      // 获取管理类别
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
        }
      },
      fetchData() {
        this.loading = true
        console.log(this.$route.params)
        let rp = this.$route.params, url='registration/detail';
        if(this.$route.params.registerId=="add"){
          url = 'registration/registerInto'
          this.show = false
          this.title = "注册证新增"
        }else {
          this.show = true
          this.title = "注册证编辑"
        }
        this.$store
          .dispatch(url, this.$route.params)
          .then(payload => {
            this.loading = false
            if (payload.success && payload.content) {
              if (payload.content.data != null) {
                let resData = payload.content.data.attributeConfigJson[0].attributes
                if(resData && this.$route.params.registerId=="add"){/*新增注册证的情况*/
                  let attribute = [], attributeJson = {};
                  for(let item of resData){
                    attributeJson[item.code+'_fileInfos'] = []
                    attributeJson[item.code] = ""
                  }
                  this.registerCard.attributeJson = attributeJson
                  this.registerCard.attributeConfigJson = payload.content.data.attributeConfigJson
                  //this.registerCard.attributeConfigJson =
                  console.log("now attributeJson is: "+JSON.stringify(this.registerCard))

                }else {
                  this.registerCard = payload.content.data
                  let atj = payload.content.data.attributeJson

                  for(var  key  in atj){
                    if(key.indexOf('fileInfos')!=-1 && atj[key]!=null && atj[key].length!=0){
                      atj[key] = remove(atj[key],null)
                    }
                  }
                  /*
                  for(var  key  in atj){
                    if(key.indexOf('fileInfos')!=-1 && atj[key].length!=0){
                      for(var m=0;m<atj[key].length;m++){
                        if(atj[key][m]==null){
                          atj[key].remove(m)
                        }
                      }
                    }
                  }
                  */
                  console.log("now resule is: "+JSON.stringify(this.registerCard))
                }

              }
            }
          })
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
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #forms .ivu-form-item{
    margin-bottom: 0;
  }
  #forms .info-table td{
    padding: 9px 12px;
  }

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
