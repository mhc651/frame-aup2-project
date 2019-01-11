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
  <div v-if="registerCard.attributeConfigJson.length">
    <div v-for="acx in registerCard.attributeConfigJson">

      <table class="info-table">

        <tr v-for="items in acx.attributes">
          <!--{{items}}-->
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
          </td>
        </tr>

      </table>
    </div>
  </div>
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
    },
    methods: {
      ...mapActions(['productAddr', 'manageType']),
      backs() {
        sessionStorage.setItem('produceState', '2')
        let msedit = sessionStorage.getItem('mlistedit')
        if(msedit=='1'){
          this.$router.push({
            path: `/ma1/registration/${this.$route.params.projectApplyId}`
          })
        }else{
          this.$router.back(-1)
        }

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
          this.registerCard.attributeJson[target + '_fileInfos'].push(response.content)
          //console.log("添加添加"+this.registerCard.attributeJson[target])
        }
      },
      handleRemove(target, file, files) {
        if(files!=null){
          this.registerCard.attributeJson[target + '_fileInfos'] = files
        }
        this.registerCard.attributeJson[target] = files.map(i => i.id).join(',')
        //console.log("删除删除"+this.registerCard.attributeJson[target])
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
        let attributeJsons = {
          manufacture_overview:this.registerCard.attributeJson.manufacture_overview,
          detaining_needle:this.registerCard.attributeJson.detaining_needle,
          suture_line:this.registerCard.attributeJson.suture_line,
          narcotization_unit:this.registerCard.attributeJson.narcotization_unit,
          heparin_tube:this.registerCard.attributeJson.heparin_tube,
          pca:this.registerCard.attributeJson.pca,
          infusing_outfit:this.registerCard.attributeJson.infusing_outfit
        }
        let param = {
          //id:this.$route.params.projectApplyId,
          attributeJson:JSON.stringify(attributeJsons)
      }
        //console.log("666 :"+JSON.stringify(param))
        this.$store.dispatch('apply/saveOrUpdateAddDetail', param).then(payload => {
          // 取消loading状态
          this.loading = false
          if (payload && payload.success) {
            // 刷新页面
            this.$Message.success({content:'成功'})
            //this.$router.back(-1)
            if(this.$route.params.projectApplyId=='add'){
              // this.$router.push({
              //   path: `/BJCLZB/BJCLZB001/detail/${this.$route.params.projectApplyId}`
              // })
            }else{
              let msedit = sessionStorage.getItem('mlistedit')
              if(msedit=='1'){
                this.$router.push({
                  path: `/BJCLZB/BJCLZB001/detail/${this.$route.params.projectApplyId}`
                })
              }else{
                this.$router.back(-1)
              }
            }
          }
        })
      },
      fetchData() {
        this.loading = true
        console.log(this.$route.params)
        let rp = this.$route.params, url='apply/addDetail',updata = {projectApplyId:sessionStorage.getItem("projectApplyId")};
        if(this.$route.params.projectApplyId=="add"){
          this.show = false
          this.title = "材料新增"
        }else {
          this.show = true
          this.title = "材料编辑"
        }
        this.$store
          .dispatch(url, updata)
          .then(payload => {
            this.loading = false
            if (payload.success && payload.content) {
              if (payload.content.data != null) {
                let resData = payload.content.data.attributeConfigJson
                if(resData && this.$route.params.projectApplyId=="add"){/*新增注册证的情况*/
                  let attribute = [], attributeJson = {};
                  for (let ites of resData){
                    for(let item of ites.attributes){
                      attributeJson[item.code+'_fileInfos'] = []
                      attributeJson[item.code] = ""
                    }
                  }
                  this.registerCard.attributeJson = attributeJson
                  this.registerCard.attributeConfigJson = payload.content.data.attributeConfigJson
                }else {
                  this.registerCard = payload.content.data
                  let atj = payload.content.data.attributeJson

                  for(var  key  in atj){
                    if(key.indexOf('fileInfos')!=-1 && atj[key]!=null && atj[key].length!=0){
                      atj[key] = remove(atj[key],null)
                    }
                  }

                }

              }
            }
          })
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
