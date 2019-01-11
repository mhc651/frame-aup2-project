<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'产品申报'">
       <span slot="btn">
        <Button type="primary" @click="profile.show = true;qualifications.show = false">批量导入基本信息</Button>
        <Button type="primary" @click="profile.show = false;qualifications.show = true">批量导入资质文件</Button>
      </span>
      <span slot="content">
        <strong class="help">说明</strong>
        <p>
         产品申报包括注册证、组件、单一规格的申报，
          <br>
          条件筛选不同状态的申报产品如：
     <br>
          未提交、待提交或审
         核通过等~
        </p>
      </span>
    </top-tool-bar>
    <div class="page-container">
      <div class="filter-tools">
        <Form ref="filterForm" :model="filter" inline>
          <FormItem>
            <Input type="text" v-model="filter.registerCardNo" placeholder="注册证编号"/>
          </FormItem>
          <FormItem>
            <Input type="text" v-model="filter.productName" placeholder="产品名称"/>
          </FormItem>
          <FormItem>
            <Input type="text" v-model="filter.orgName" placeholder="生产企业"/>
          </FormItem>
          <FormItem>
            <Select placeholder = '请选择产品分类'  v-model="filter.productType" style="width:200px">
              <Option v-for="item in categories" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select placeholder = '请选择审核状态' v-model="filter.status" style="width:200px" :labelInValue="true">
              <Option value="">全部</Option>
              <Option value="1">未提交</Option>
              <Option value="2">待审核</Option>
              <Option value="3">审核中</Option>
              <Option value="5">未通过</Option>
              <Option value="4">审核通过</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Select placeholder = '请选择质量层次'  v-model="filter.qualityId" style="width:200px">
              <Option v-for="item in qualityLists" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="fetchData(1)">筛选</Button>
            <Button @click="handleReset()">重置</Button>
          </FormItem>
        </Form>
      </div>
      <Table
        border ref="selection"
        :columns="columns"
        :data="localDataSource"
        @on-selection-change="handleSelection"
        :size="'small'"
      ></Table>
      <div class="pager">
        <Page
          :current='filter.page'
          :total="total"
          :show-elevator="true"
          :show-sizer="true"
          :show-total="true"
          :page-size='filter.size'
          :page-size-opts="pageSizeArray"
          @on-change='handlePager'
          @on-page-size-change='handlePageSize'
        >
        </Page>
      </div>
      <div class="footer-tools">
        <Button @click="handleRemove" type="error">批量删除</Button>
        <Button :disabled='disabledApply' @click="handleApply()" type="primary">批量提交</Button>
      </div>
      <Modal
        width="600"
        v-model="profile.show"
        title="基本信息导入"
        @on-cancel="profile.show = false"
      >
        <table class="info-table">
          <tr>
            <th class="label">上传附件</th>
            <td>
              <Upload
                action="/portal/pub/comm/uploadimage"
                :headers="{accesstoken:token}"
                :on-success="handleComplete"
                :format="['xlsx','xls']"
                :on-remove='excelRemove'
                :before-upload='excelLength'
                :on-format-error="handleFormatErrorExcel"
                :on-exceeded-size="handleExceededSize"
                :max-size="5120"
                ref="profile"
              >
                <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
              </Upload>
            </td>
          </tr>
          <tr>
            <th class="label">模板文件下载</th>
            <td>
              <a :href="'/aup2org/pub/宁德耗材申报导入模板V1.xlsx'" target="_blank">模板下载</a>
            </td>
          </tr>
        </table>
        <div class="tip">
          <div>
            <span class="note">导入操作步骤：</span>
          </div>
          <ol>
            <li>
              点击下载模板文件
            </li>
            <li> 根据模板文件要求，填写相应信息并保存；</li>
            <li>
              将填写好的文件上传，系统将自动进行处理；
            </li>
          </ol>
        </div>
        <template slot="footer">
          <div class="model-footer text-center">
            <Button type="primary" @click="handleSaveProfile" :disabled="exeFileState||!profile.fileId">确定</Button>
          </div>
        </template>
      </Modal>
      <!-- 弹出窗 资质文件导入-->
      <Modal
        width="600"
        v-model="qualifications.show"
        title="资质文件导入"
        @on-cancel="qualifications.show = false"
      >
        <table class="info-table">
          <tr>
            <th class="label">上传附件</th>
            <td>
              <Upload
                action="/portal/pub/comm/uploadimage"
                :headers="{accesstoken:token}"
                :on-success="handleSuccess"
                :format="['zip']"
                :on-remove='zipRemove'
                :before-upload='zipLength'
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleExceededSize"
                :max-size="5120*20"
                ref="qualifications"
              >
                <Button type="ghost" icon="ios-cloud-upload-outline">浏览</Button>
              </Upload>
            </td>
          </tr>
          <tr>
            <th class="label">模板文件下载</th>
            <td>
              <a :href="`/aup2org/api/project/apply/downLoadExcel?accesstoken=${token}`" target="_blank">模板下载</a>
            </td>
          </tr>
        </table>
        <div class="tip">
          <div>
            <span class="note">说明及注意：</span>
          </div>
          <ol>
            <li>
              请上传文件格式为“zip”的压缩包文件，压缩包仅允许包含图片文件，不能含有文件夹，否则可能会导致导入失败。
            </li>
            <li>压缩包内的图片格式：JPG，图片大小：不超过5MB。</li>
            <li>
              图片命名规范，请下载模板进行参考。
            </li>
          </ol>
        </div>

        <template slot="footer">
          <div class="model-footer text-center">
            <Button :disabled='!qualifications.fileId||zipFileState' type="primary" @click="handleSaveQualifications" >确定</Button>
          </div>
        </template>
      </Modal>
       <!-- 弹出窗 资质文件导入 end -->
       <!-- zip 结果提示 -->
        <Modal v-model='modalZip.bool'
       width='700'
       title="资质文件导入结果"
       >
        <div v-if='modalZip.content.total'>
          <h5>导入{{ modalZip.content.total }}条，成功:<span class='blue'>{{
            modalZip.content.success
          }}</span>条，失败:<span class='red'>{{
            modalZip.content.fail.length
          }}</span>条。</h5>
          <p v-if='modalZip.content.fail.length'>结果如下：</p>
            <p v-for='(item,i) in modalZip.content.fail' v-if='i< modalZip.defule || modalZip.showAll' :key='i' >
              {{ item }}
            </p>
            <p v-if="modalZip.content.fail.length > modalZip.defule" class="text-center" style="margin-top:15px;">
             <Button type="info" @click="modalZip.showAll=!modalZip.showAll" >{{ !modalZip.showAll?'展开':'收起' }}</Button>
            </p>
          </div>
          <div slot="footer" class="model-footer" >
            <Button @click="modalZip.bool = false" >
              确定
            </Button>
          </div>
       </Modal>
       <!-- zip 结果提示 end-->

    </div>
  </div>

</template>
<script>
import TopToolBar from '@/components/Common/TopToolBar.vue'
// loading 组件
import Loading from '@/components/Common/Loading.vue'
import { validateNowDate } from '../../assets/js/common.js'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'product',
  created() {
    this.getFilterDate()
    this.fetchData()
    this.fetchCategory()
    this.getQualityList()
  },
  components: {
    TopToolBar,
    Loading
  },
  data() {
    let pageSizeArray = [10, 20, 30, 40]
    return {
      loading: false,
      //  zip上传完成提示
      modalZip: {
        bool: false,
        content: {},
        // 是否显示全部条数
        showAll: false,
        // 默认显示条数
        defule: '10'
      },
      // 提交审核
      disabledApply: false,
      exeFileState: false,
      zipFileState: false,
      pldelState: false,
      pladdState: false,
      // 上传文件列表
      filter: {
        registerCardNo: '',
        productName: '',
        orgName: '',
        productType: '',
        status: '',
        page: 1,
        size: pageSizeArray[0],
        qualityId: ''
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '产品名称',
          key: 'productName',
          align: 'center'
        },
        {
          title: '生产企业',
          key: 'orgInfoName',
          align: 'center'
        },
        {
          title: '注册证编号',
          key: 'registerCardNo',
          align: 'center',
          render: (h, r) => {
            return h(
              'router-link',
              {
                props: {
                  to: `/ma1/registration/${r.row.registerCardId}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '组件名称',
          key: 'subGroupName',
          align: 'center',
          render: (h, r) => {
            return h(
              'router-link',
              {
                props: {
                  to: `/LCSB/LCSB004/page/${r.row.subGroupId}`
                }
              },
              r.row.subGroupName
            )
          }
        },
        {
          title: '规格',
          key: 'standard',
          width: 80,
          align: 'center',
          render: (h, r) => {
            return h(
              'router-link',
              {
                props: {
                  to: `/LCSB/LCSB005/page/${r.row.id}`
                }
              },
              r.row.standard
            )
          }
        },
        {
          title: '型号',
          key: 'model',
          width: 80,
          align: 'center',
          render: (h, r) => {
            return h(
              'router-link',
              {
                props: {
                  to: `/LCSB/LCSB005/page/${r.row.id}`
                }
              },
              r.row.model
            )
          }
        },
        {
          title: '分组',
          key: 'aup2ProjectTypeGroupName',
          align: 'center'
        },
        {
          title: '质量层次',
          key: 'aup2ProjectTypeQualityName',
          align: 'center'
        },
        {
          title: '审核状态',
          key: 'auditStatus',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleFormatStatus(r.row.auditStatus))
          }
        }
      ],
      localDataSource: [],
      categories: [],
      qualityLists: [],
      selection: [],
      total: 0,
      pageSizeArray,
      profile: {
        show: false,
        status: '',
        fileId: ''
      },
      qualifications: {
        show: false,
        status: '',
        fileId: ''
      }
    }
  },
  computed: {
    ...mapState(['pageModel']),
    storage() {
      return this.pageModel.firstMenuId + '_page'
    },
    token() {
      let t = sessionStorage.getItem('_token')
      return JSON.parse(t).accessToken
    }
  },
  methods: {
    ...mapActions(['submitProductApply', 'qualityList']),
    getFilterDate() {
      let val = sessionStorage.getItem(this.storage)
      let status = sessionStorage.getItem('produceState')
      if (status == '1') {
        this.filter.registerCardNo = ''
        this.filter.productName = ''
        this.filter.orgName = ''
        this.filter.productType = ''
        this.status = ''
      } else {
        if (val != null) {
          this.filter = JSON.parse(val)
        }
      }
    },
    fetchData(page) {
      if (page) this.filter.page = 1
      this.loading = true
      this.$store.dispatch('apply/find', this.filter).then(payload => {
        this.loading = false
        if (payload.success) {
          this.localDataSource = payload.content.records
          this.total = payload.content.total
          // 保存浏览记录记录
          sessionStorage.setItem(this.storage, JSON.stringify(this.filter))
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
    //质量层次列表处理
    initQualityList(data) {
      if (data != null) {
        const { entries } = Object
        const qualityList = [{ label: '全部', value: '' }]
        for (const [key, value] of entries(data)) {
          qualityList.push({
            label: value.text,
            value: value.code
          })
        }
        this.qualityLists = qualityList
      }
    },
    //获取质量层次列表
    getQualityList() {
      return this.qualityList().then(
        res => {
          this.initQualityList(res.content)
          this.loading = false
          return Promise.resolve(res)
        },
        err => {
          this.loading = false
          return Promise.reject(res)
        }
      )
    },
    // 提交状态
    handleFormatStatus(status) {
      switch (parseInt(status, 10)) {
        case 1:
          return '未提交'
        case 2:
          return '待审核'
        case 3:
          return '审核中'
        case 5:
          return '未通过'
        case 4:
          return '审核通过'
      }
    },
    handleReset() {
      this.filter = {
        registerCardNo: '',
        productName: '',
        orgName: '',
        productType: '',
        status: '',
        page: 1,
        size: 10
      }
      this.fetchData()
    },
    // 选择
    handleSelection(selection) {
      this.selection = selection.map(item => item.id)
    },
    // 批量删除
    handleRemove() {
      const self = this
      if (this.selection.length > 0) {
        this.$Modal.confirm({
          title: '批量删除产品',
          content: '确定删除吗？此操作不可逆',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            self.$store
              .dispatch('apply/remove', {
                ids: self.selection.join(',')
              })
              .then(payload => {
                if (payload.success) {
                  // init checkout data
                  self.selection = []
                  self.fetchData()
                }
              })
          }
        })
      } else {
        this.$Message.warning('请选择要删除的申报信息')
      }
    },
    // 批量提交
    handleApply() {
      // let open_time = '2018/06/12 00:00:00'
      // if (!validateNowDate(open_time)) {
      //   return this.$Modal.warning({
      //     content: `审核提交开始时间为 ${open_time}`
      //   })
      // }
      if (!this.selection.length)
        return this.$Message.error('请选择要申报的产品')
      this.disabledApply = true
      let params = { ids: this.selection.join(','), isSubmitZcz: '' }
      this.submitProductApply(params).then(
        res => {
          this.disabledApply = false
          if (res.content.suc) {
            this.$Message.success('产品申报成功')
            // 刷新列表
            this.fetchData()
          } else {
            this.$Modal.confirm({
              title: '重要提示',
              content: res.content.msg,
              onOk: () => {
                this.subAllId(params)
              }
            })
          }
        },
        err => {
          this.disabledApply = false
        }
      )
    },
    /**
     * 强制提交
     */
    subAllId(param) {
      this.disabledApply = true
      param.isSubmitZcz = 1
      this.submitProductApply(param).then(
        res => {
          this.$Message.success('产品申报成功')
          // 刷新列表
          this.fetchData()
          // reloade table
          this.disabledApply = false
        },
        err => {
          this.disabledApply = false
        }
      )
    },
    // 翻页
    handlePager(page) {
      this.filter.page = page
      this.fetchData()
    },
    handlePageSize(pageSize) {
      this.filter.size = pageSize
      this.fetchData()
    },
    handleComplete(response) {
      if (response) {
        if (response.success) {
          this.profile.fileId = response.content.id
          this.$Message.success('上传成功')
        } else {
          this.$Message.error(response.errmsg)
        }
      }
    },
    handleSuccess(response) {
      if (response) {
        if (response.success) {
          this.qualifications.fileId = response.content.id
          this.$Message.success('上传成功')
        } else {
          this.$Message.error(response.errmsg)
        }
      }
    },
    handleSaveProfile() {
      if (this.profile.fileId) {
        this.exeFileState = true
        this.$store
          .dispatch('apply/uploadExcel', { fileId: this.profile.fileId })
          .then(payload => {
            if (payload.success) {
              // 清除上传列表
              this.$refs['profile'].clearFiles()
              // 清空上传
              this.profile.fileId = ''
              this.$Message.success('导入成功')
              this.profile.fileId = ''
              this.fetchData()
              this.profile.show = false
            }
            this.exeFileState = false
          })
      } else {
        this.$Message.warning('请上传文件')
      }
    },
    //  zip uploade
    handleSaveQualifications() {
      if (this.qualifications.fileId) {
        this.zipFileState = true
        this.$store
          .dispatch('apply/uploadZIP', { fileId: this.qualifications.fileId })
          .then(payload => {
            if (payload.success) {
              this.qualifications.show = false
              const data = payload.content
              // 清除上传列表
              this.$refs['qualifications'].clearFiles()
              // 清空上传
              this.qualifications.fileId = ''
              /**
               * @namespace 错误信息
               */
              this.modalZip.bool = true
              this.modalZip.showAll = false
              this.modalZip.content = data
              this.fetchData()
            }
            this.zipFileState = false
          })
      } else {
        this.$Message.warning('请上传文件')
      }
    },
    // zip 删除文件
    zipRemove(file, fileList) {
      this.qualifications.fileId = ''
    },
    // 基本信息excel 删除文件
    excelRemove(file, fileList) {
      this.profile.fileId = ''
    },
    // zip 上传限制
    zipLength() {
      if (this.qualifications.fileId) {
        this.$Message.warning('zip文件只允许上传一个')
        return false
      }
    },
    // excel 上传限制
    excelLength() {
      if (this.profile.fileId) {
        this.$Message.warning('excel文件只允许上传一个')
        return false
      }
    },
    handleFormatError(e) {
      this.$Message.warning('请上传zip格式附件')
    },
    handleFormatErrorExcel(e) {
      this.$Message.warning('请上传Excel格式附件')
    },
    handleExceededSize() {
      this.$Message.warning('附件不得大于5M')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.blue {
  color: #39f;
}
.red {
  color: #f00;
}
.ivu-form-item {
  margin-bottom: 0;
}

.ivu-page-total {
  float: right;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.filter-tools,
.footer-tools {
  padding: 15px 0;
}

.pager {
  padding-top: 10px;
  border-top: none;
}

.tip {
  line-height: 30px;
  padding: 10px;
  color: #ea5a46;
}

.note,
.required {
  color: #ea5a46;
}

.info-table {
  width: 100%;
  border: 1px solid #ddd;
  border-collapse: collapse;
  th {
    margin: 0;
    border: 1px solid #ddd;
    padding: 8px 12px;
    line-height: 30px;
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
</style>
