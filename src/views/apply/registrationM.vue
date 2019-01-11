<template>
  <div>
    <Loading :loading="loading"></Loading>
    <top-tool-bar :title="'注册证管理'">
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
    <div class="page-container" id="pcont">

      <!-- head tab -->
      <div class="head-tab">
        <a class="head-tab_btn" v-for="(val,index) in model" :key="index" :class='index === reviewNum.active?"active":""' @click="tabState(index)" > {{ val.name }}
          <!-- <Badge :count="val.allTotal" :overflow-count="reviewNum.max" /> -->
        </a>
      </div>
      <!-- head tab end-->


      <!-- head tab end-->
      <!-- 过滤 企业-->
      <div class="head-filter">
        <Row type="flex" :gutter="16">
          <Col span="4" v-for='val of dataConfig.input' :key='val.index'>
            <Select v-if='val.type === "select"' :placeholder='val.name' v-model="dataConfig.form[val.data]" >
              <!--<Option v-for="(item,index) in val.options" :value="index" :key="item.index">{{ item }}</Option>-->
              <!--<Option v-for="(item,index) in val.options" :value="index" :key="item.index">{{ item }}</Option>-->
              <Option v-for="item in val.options" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
            <!-- 日期控件 -->
            <DatePicker v-model="dataConfig.form[val.data]"  v-else-if='val.type==="date"'  type="daterange" placement="bottom-end" :placeholder="val.name"  style="width: 100%" ></DatePicker>
            <!-- 日期控件 end -->
            <!-- 普通输入框 -->
            <Input v-else-if='val.type === "input"'  v-model="dataConfig.form[val.data]" :placeholder='val.name' />
            <!-- 普通输入框 end-->
            <!-- 按钮组 -->
            <div v-else-if='val.type === "btns"' class="list-inline">
              <!-- 设置 -->
              <span v-for="cell of val.cells" :key="cell.index">
                  <Button v-if="cell.type === 'set' "  type="primary">{{ cell.name }}</Button>
                <!-- 查询 -->
                  <Button v-else-if="cell.type === 'filter' "  type="primary" @click='filterOrg'>{{ cell.name }}</Button>
                <!-- 重置 -->
                  <Button  v-else-if="cell.type === 'reset' "  @click='resetFilter' type="primary">{{ cell.name }}</Button>
                </span>
            </div>
            <!-- 按钮组 end-->
          </Col>
        </Row>
        <!-- <div class="list-inline">
        <Button type="primary">分配</Button>
        <Button type="primary" @click='getOrgData'>匹配</Button>
        <Button @click='resetFilter' type="primary">重置</Button>
        </div> -->
      </div>
      <!-- 过滤 end-->
      <!-- content -->
      <!-- @on-row-click ='showTrTip' -->
      <Table class="table"
             @on-select='checkTable'
             @on-select-all='checkTable'
             @on-select-cancel='checkTable' border ref="selection" :columns="dataConfig.columns" :data="dataConfig.data"></Table>
      <!-- 分页 -->
      <Page
        :total="dataConfig.total"
        show-elevator
        show-total
        show-sizer
        :current='dataConfig.page'
        :page-size='dataConfig.size'
        :page-size-opts='dataConfig.pageSizeArray'
        @on-change='setPage'
        @on-page-size-change="setpageSize"
      >
      </Page>
      <!-- 分页 end-->


      <!--<div class="filter-tools">-->
        <!--<Form ref="filterForm" :model="filter" inline>-->
          <!--<FormItem>-->
            <!--<Input type="text" v-model="filter.registerCardNo" placeholder="注册证编号"/>-->
          <!--</FormItem>-->
          <!--<FormItem>-->
            <!--<Input type="text" v-model="filter.name" placeholder="产品名称"/>-->
          <!--</FormItem>-->
          <!--<FormItem>-->
            <!--<Input type="text" v-model="filter.manufactureName" placeholder="生产企业"/>-->
          <!--</FormItem>-->
          <!--<FormItem>-->
            <!--<Select placeholder = '请选择分类目录'  v-model="filter.aup2ProjectTypeId" style="width:200px">-->
              <!--<Option v-for="item in categories" :value="item.value" :key="item.value">{{item.label}}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <!--<FormItem>-->
            <!--<Select placeholder = '请选择管理类别' v-model="filter.managementType" style="width:200px" :labelInValue="true">-->
              <!--<Option v-for="item in managementTypeList" :value="item.value" :key="item.value">{{item.label}}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
          <!--<FormItem>-->
            <!--<Button type="primary" @click="fetchData(1)">筛选</Button>-->
            <!--<Button @click="handleReset()">重置</Button>-->
          <!--</FormItem>-->
        <!--</Form>-->
      <!--</div>-->
      <!--<Table-->
        <!--border ref="selection"-->
        <!--:columns="columns"-->
        <!--:data="localDataSource"-->
        <!--@on-selection-change="handleSelection"-->
        <!--:size="'small'"-->
      <!--&gt;</Table>-->
      <!--<div class="pager">-->
        <!--<Page-->
          <!--:current='filter.page'-->
          <!--:total="total"-->
          <!--:show-elevator="true"-->
          <!--:show-sizer="true"-->
          <!--:show-total="true"-->
          <!--:page-size='filter.size'-->
          <!--:page-size-opts="pageSizeArray"-->
          <!--@on-change='handlePager'-->
          <!--@on-page-size-change='handlePageSize'-->
        <!--&gt;-->
        <!--</Page>-->
      <!--</div>-->



      <div class="footer-tools" v-if="reviewNum.active=='0'">
        <Button type="primary" @click="$router.push({path:`/ma1/registrationEdit/add`})">添加注册证</Button>
        <Button type="default" @click="edit()" >编辑</Button>
        <Button @click="handleRemove" type="error">批量删除</Button>
        <Button :disabled='disabledApply' @click="handleApply()" type="primary">批量提交</Button>
      </div>
      <div class="footer-tools" v-if="reviewNum.active=='1'">
        <Button type="primary" @click="cancleCheck()">撤回审核</Button>
      </div>
      <div class="footer-tools" v-if="reviewNum.active=='3'">
        <Button type="default" @click="edit()" >编辑</Button>
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
       <!-- 弹出窗 资质文件导入 end-->
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
            <p v-for='(item,i) in modalZip.content.fail' v-if='i<= modalZip.defule || modalZip.showAll' :key='i' >
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
    //this.getOrgData()
    this.fetchCategory()
    this.getProductManaList()
    let ind = sessionStorage.getItem('index')
    if (ind != null) {
      this.reviewNum.active = parseInt(ind)
      this.getOrgData(1)
    } else {
      this.getOrgData()
    }
  },
  components: {
    TopToolBar,
    Loading
  },
  data() {
    let pageSizeArray = [10, 20, 30, 40]

    let org = {
      name: '待提交',
      allTotal: 0,
      // 总数据数
      total: 0,
      auditStatus: '1',
      size: pageSizeArray[0],
      page: 1,
      pageSizeArray,
      // 存放数据
      data: [],
      form: {},
      input: {
        registerCardNo: {
          type: 'input',
          data: 'registerCardNo',
          name: '注册证编号',
          value: ''
        },
        productName: {
          type: 'input',
          data: 'name',
          name: '产品名称',
          value: ''
        },
        orgName: {
          type: 'input',
          data: 'manufactureName',
          name: '生产企业',
          value: ''
        },
        typeCatalog: {
          type: 'select',
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          value: '1',
          default: '',
          options: []
        },
        mType: {
          type: 'select',
          data: 'managementType',
          name: '请选择管理类别',
          value: '1',
          default: '',
          options: []
        },
        btns: {
          name: '按钮组',
          type: 'btns',
          cells: [
            {
              name: '筛选',
              type: 'filter'
            },
            {
              name: '重置',
              type: 'reset'
            }
          ]
        }
      },
      // table columns config
      columns: [
        {
          type: 'selection',
          width: 60,
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
                  to: `/ma1/registration/${r.row.id}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '注册证名称',
          key: 'registerCardName',
          align: 'center'
        },
        {
          title: '产地',
          key: 'origin',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleOriginStatus(r.row.origin))
          }
        },
        {
          title: '管理类别',
          key: 'managementType',
          align: 'center',
          render: (h, r) => {
            return h(
              'span',
              {},
              this.handleManageTypeStatus(r.row.managementType)
            )
          }
        },
        {
          title: '产品名称（中文）',
          key: 'name',
          align: 'center'
        },
        {
          title: '组件数量',
          key: 'groupSum',
          align: 'center'
        },
        {
          title: '产品数量',
          key: 'proSum',
          align: 'center'
        }
      ]
    }
    let org2 = {
      name: '待审核',
      allTotal: 0,
      // 总数据数
      total: 0,
      auditStatus: '2',
      size: pageSizeArray[0],
      page: 1,
      pageSizeArray,
      // 存放数据
      data: [],
      form: {},
      input: {
        registerCardNo: {
          type: 'input',
          data: 'registerCardNo',
          name: '注册证编号',
          value: ''
        },
        productName: {
          type: 'input',
          data: 'name',
          name: '产品名称',
          value: ''
        },
        orgName: {
          type: 'input',
          data: 'manufactureName',
          name: '生产企业',
          value: ''
        },
        typeCatalog: {
          type: 'select',
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          value: '1',
          default: '',
          options: []
        },
        mType: {
          type: 'select',
          data: 'managementType',
          name: '请选择管理类别',
          value: '',
          default: '',
          options: []
        },
        btns: {
          name: '按钮组',
          type: 'btns',
          cells: [
            {
              name: '筛选',
              type: 'filter'
            },
            {
              name: '重置',
              type: 'reset'
            }
          ]
        }
      },
      // table columns config
      columns: [
        {
          type: 'selection',
          width: 60,
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
                  to: `/ma1/registration/${r.row.id}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '注册证名称',
          key: 'registerCardName',
          align: 'center'
        },
        {
          title: '产地',
          key: 'origin',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleOriginStatus(r.row.origin))
          }
        },
        {
          title: '管理类别',
          key: 'managementType',
          align: 'center',
          render: (h, r) => {
            return h(
              'span',
              {},
              this.handleManageTypeStatus(r.row.managementType)
            )
          }
        },
        {
          title: '产品名称（中文）',
          key: 'name',
          align: 'center'
        },
        {
          title: '组件数量',
          key: 'groupSum',
          align: 'center'
        },
        {
          title: '产品数量',
          key: 'proSum',
          align: 'center'
        }
      ]
    }
    let org3 = {
      name: '审核中',
      allTotal: 0,
      // 总数据数
      total: 0,
      auditStatus: '3',
      size: pageSizeArray[0],
      page: 1,
      pageSizeArray,
      // 存放数据
      data: [],
      form: {},
      input: {
        registerCardNo: {
          type: 'input',
          data: 'registerCardNo',
          name: '注册证编号',
          value: ''
        },
        productName: {
          type: 'input',
          data: 'name',
          name: '产品名称',
          value: ''
        },
        orgName: {
          type: 'input',
          data: 'manufactureName',
          name: '生产企业',
          value: ''
        },
        typeCatalog: {
          type: 'select',
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          value: '1',
          default: '',
          options: []
        },
        mType: {
          type: 'select',
          data: 'managementType',
          name: '请选择管理类别',
          value: '',
          default: '',
          options: []
        },
        btns: {
          name: '按钮组',
          type: 'btns',
          cells: [
            {
              name: '筛选',
              type: 'filter'
            },
            {
              name: '重置',
              type: 'reset'
            }
          ]
        }
      },
      // table columns config
      columns: [
        {
          type: 'selection',
          width: 60,
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
                  to: `/ma1/registration/${r.row.id}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '注册证名称',
          key: 'registerCardName',
          align: 'center'
        },
        {
          title: '产地',
          key: 'origin',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleOriginStatus(r.row.origin))
          }
        },
        {
          title: '管理类别',
          key: 'managementType',
          align: 'center',
          render: (h, r) => {
            return h(
              'span',
              {},
              this.handleManageTypeStatus(r.row.managementType)
            )
          }
        },
        {
          title: '产品名称（中文）',
          key: 'name',
          align: 'center'
        },
        {
          title: '组件数量',
          key: 'groupSum',
          align: 'center'
        },
        {
          title: '产品数量',
          key: 'proSum',
          align: 'center'
        }
      ]
    }
    let org4 = {
      name: '未通过',
      allTotal: 0,
      // 总数据数
      total: 0,
      auditStatus: '5',
      size: pageSizeArray[0],
      page: 1,
      pageSizeArray,
      // 存放数据
      data: [],
      form: {},
      input: {
        registerCardNo: {
          type: 'input',
          data: 'registerCardNo',
          name: '注册证编号',
          value: ''
        },
        productName: {
          type: 'input',
          data: 'name',
          name: '产品名称',
          value: ''
        },
        orgName: {
          type: 'input',
          data: 'manufactureName',
          name: '生产企业',
          value: ''
        },
        typeCatalog: {
          type: 'select',
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          value: '1',
          default: '',
          options: []
        },
        mType: {
          type: 'select',
          data: 'managementType',
          name: '请选择管理类别',
          value: '',
          default: '',
          options: []
        },
        btns: {
          name: '按钮组',
          type: 'btns',
          cells: [
            {
              name: '筛选',
              type: 'filter'
            },
            {
              name: '重置',
              type: 'reset'
            }
          ]
        }
      },
      // table columns config
      columns: [
        {
          type: 'selection',
          width: 60,
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
                  to: `/ma1/registration/${r.row.id}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '注册证名称',
          key: 'registerCardName',
          align: 'center'
        },
        {
          title: '产地',
          key: 'origin',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleOriginStatus(r.row.origin))
          }
        },
        {
          title: '管理类别',
          key: 'managementType',
          align: 'center',
          render: (h, r) => {
            return h(
              'span',
              {},
              this.handleManageTypeStatus(r.row.managementType)
            )
          }
        },
        {
          title: '产品名称（中文）',
          key: 'name',
          align: 'center'
        },
        {
          title: '组件数量',
          key: 'groupSum',
          align: 'center'
        },
        {
          title: '产品数量',
          key: 'proSum',
          align: 'center'
        }
      ]
    }
    let org5 = {
      name: '已通过',
      allTotal: 0,
      // 总数据数
      total: 0,
      auditStatus: '4',
      size: pageSizeArray[0],
      page: 1,
      pageSizeArray,
      // 存放数据
      data: [],
      form: {},
      input: {
        registerCardNo: {
          type: 'input',
          data: 'registerCardNo',
          name: '注册证编号',
          value: ''
        },
        productName: {
          type: 'input',
          data: 'name',
          name: '产品名称',
          value: ''
        },
        orgName: {
          type: 'input',
          data: 'manufactureName',
          name: '生产企业',
          value: ''
        },
        typeCatalog: {
          type: 'select',
          data: 'aup2ProjectTypeId',
          name: '请选择分类目录',
          value: '1',
          default: '',
          options: []
        },
        mType: {
          type: 'select',
          data: 'managementType',
          name: '请选择管理类别',
          value: '',
          default: '',
          options: []
        },
        btns: {
          name: '按钮组',
          type: 'btns',
          cells: [
            {
              name: '筛选',
              type: 'filter'
            },
            {
              name: '重置',
              type: 'reset'
            }
          ]
        }
      },
      // table columns config
      columns: [
        {
          type: 'selection',
          width: 60,
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
                  to: `/ma1/registration/${r.row.id}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '注册证名称',
          key: 'registerCardName',
          align: 'center'
        },
        {
          title: '产地',
          key: 'origin',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleOriginStatus(r.row.origin))
          }
        },
        {
          title: '管理类别',
          key: 'managementType',
          align: 'center',
          render: (h, r) => {
            return h(
              'span',
              {},
              this.handleManageTypeStatus(r.row.managementType)
            )
          }
        },
        {
          title: '产品名称（中文）',
          key: 'name',
          align: 'center'
        },
        {
          title: '组件数量',
          key: 'groupSum',
          align: 'center'
        },
        {
          title: '产品数量',
          key: 'proSum',
          align: 'center'
        }
      ]
    }
    let model = [org, org2, org3, org4, org5]
    // init form value
    for (let item of model) {
      for (let k in item.input) {
        let val = item.input[k]
        if (val.type !== 'btns') {
          if (val.data) item.form[val.data] = val.default || ''
        }
      }
    }

    return {
      loading: false,
      manatypeList: [],
      typecatalog: [],
      // 提交审核
      //  zip上传完成提示
      modalZip: {
        bool: false,
        content: {},
        // 是否显示全部条数
        showAll: false,
        // 默认显示条数
        defule: '10'
      },
      disabledApply: false,
      exeFileState: false,
      zipFileState: false,
      pldelState: false,
      pladdState: false,
      // 审核
      reviewNum: {
        // 当前焦点
        active: 0,
        // 最大显示
        max: 99
      },
      // 列表数据
      model,
      // 选中
      checkout: [],
      // 产品数量
      proNumArray: [],
      // 上传文件列表
      filter: {
        registerCardNo: '',
        name: '',
        manufactureName: '',
        aup2ProjectTypeId: '',
        managementType: '',
        page: 1,
        size: pageSizeArray[0]
      },
      columns: [
        {
          type: 'selection',
          width: 60,
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
                  to: `/ma1/registration/${r.row.id}`
                }
              },
              r.row.registerCardNo
            )
          }
        },
        {
          title: '注册证名称',
          key: 'registerCardName',
          align: 'center'
        },
        {
          title: '产地',
          key: 'origin',
          align: 'center',
          render: (h, r) => {
            return h('span', {}, this.handleOriginStatus(r.row.origin))
          }
        },
        {
          title: '管理类别',
          key: 'managementType',
          align: 'center',
          render: (h, r) => {
            return h(
              'span',
              {},
              this.handleManageTypeStatus(r.row.managementType)
            )
          }
        },
        {
          title: '产品名称（中文）',
          key: 'name',
          align: 'center'
        },
        {
          title: '组件数量',
          key: 'groupSum',
          width: 80,
          align: 'center'
        },
        {
          title: '产品数量',
          key: 'proSum',
          align: 'center'
        }
      ],
      localDataSource: [],
      categories: [],
      managementTypeList: [],
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
    token() {
      let t = sessionStorage.getItem('_token')
      return JSON.parse(t).accessToken
    },
    storage() {
      return `${this.$route.path}`
    },
    /// 获得当前列表配置
    dataConfig() {
      let name = this.reviewNum.active
      return this.model[name]
    }
  },
  methods: {
    ...mapActions(['submitRegisterCheck', 'manageType', 'registered']),
    /*编辑*/
    edit() {
      if (this.checkout.length > 1) {
        this.$Message.warning('只能选择一个进行编辑')
        return
      } else if (this.checkout.length == 0) {
        this.$Message.warning('请选择要编辑的对象！')
        return
      }
      sessionStorage.setItem('mlistedit', '1')
      let rid = this.checkout.join(',')
      this.$router.push({ path: `/ma1/registrationEdit/${rid}` })
    },
    /*撤销审核*/
    cancleCheck() {
      if (this.checkout.length > 0) {
        this.loading = true
        this.$store
          .dispatch('registration/cancleRegisterCheck', {
            ids: this.checkout.join(',')
          })
          .then(payload => {
            this.loading = false
            if (payload.success && payload.content) {
              this.$Message.success({ content: '撤回成功' })
              this.getOrgData()
              this.checkout = []
            }
          })
      } else {
        this.$Message.warning('请选择要撤回的申报信息')
      }
    },
    /**
     * 设置当前分页
     * @param {number} val 选中的页码
     * */
    setPage(n) {
      // 获得当前列表
      this.dataConfig.page = n
      this.getOrgData(1)
    },
    /**
     * 设置单页数目
     * @param {number} val 选中的条数
     * */
    setpageSize(val) {
      this.dataConfig.size = val
      this.getOrgData()
    },
    // 重置企业搜索
    resetFilter() {
      // 重置表单选择
      for (let index in this.dataConfig.input) {
        let cell = this.dataConfig.input[index]
        this.dataConfig.form[cell.data] = cell.default || ''
      }
      this.getOrgData(1).then(res => {
        // 获得总数
        this.dataConfig.allTotal = res.content.total
      })
    },
    // 筛选
    filterOrg() {
      this.dataConfig.page = 1
      this.getOrgData(1)
    },
    // 读取缓存记录
    readStorage() {
      let config = localStorage.getItem(this.storage + this.reviewNum.active)
      if (!config) return false
      config = JSON.parse(config)
      this.dataConfig.form = config.data.form
      this.dataConfig.page = config.data.page
    },
    /**
     * 切换审核列表
     * @param {number} num 0 为待审核1
     */
    tabState(num) {
      sessionStorage.setItem('index', num)
      this.reviewNum.active = num
      let config = localStorage.getItem(this.storage + this.reviewNum.active)
      this.dataConfig.input.typeCatalog.options = this.typecatalog
      this.dataConfig.input.mType.options = this.manatypeList
      this.getOrgData().then(res => {
        // 获得总数
        this.dataConfig.allTotal = res.content.total
      })
    },

    // 获取注册证列表数据
    getOrgData(data) {
      if (data == null) {
        this.readStorage()
      }

      this.loading = true
      // 获取当前的列表
      let config = this.dataConfig
      // 查询
      let param = {
        size: config.size,
        page: config.page,
        auditStatus: config.auditStatus
      }
      // 获得表单数据
      for (let k in config.form) {
        let val = config.form[k]
        param[k] = val
      }
      return this.registered(param).then(
        res => {
          this.loading = false
          // 更新数据
          this.initTable(res.content)
          // 设置缓存记录
          let storageDate = { data: this.dataConfig }
          localStorage.setItem(
            this.storage + this.reviewNum.active,
            JSON.stringify(storageDate)
          )
          return Promise.resolve(res)
        },
        err => {
          this.loading = false
          return Promise.reject(res)
        }
      )
    },
    /**
     * 初始化表格
     * @param {Object} data table config
     * */
    initTable(data) {
      this.dataConfig.size = data.size
      this.dataConfig.page = data.page
      // table data
      this.dataConfig.data = data.records
      // data all
      this.dataConfig.total = data.total
    },
    /**
     * 设置选中
     * @param {Array} selection 已选项数据
     * */
    checkTable(selection) {
      this.checkout = selection.map(item => item.id)
      this.proNumArray = selection.map(item => item.proSum)
    },

    // 获取分类目录
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
          this.typecatalog = categories
          this.dataConfig.input.typeCatalog.options = categories
        }
      })
    },

    initManageList(data) {
      if (data != null) {
        const { entries } = Object
        const productAddrList = [{ label: '全部', value: '' }]
        for (const [key, value] of entries(data)) {
          productAddrList.push({
            label: value.text,
            value: value.code
          })
        }
        this.manatypeList = productAddrList
        this.dataConfig.input.mType.options = productAddrList
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
    // 提交状态
    handleFormatStatus(status) {
      switch (parseInt(status, 10)) {
        case 1:
          return '未提交'
        case 2:
          return '待审核'
        case 3:
          return '审核中'
        case 4:
          return '审核通过'
        case 5:
          return '未通过'
      }
    },
    // 地区转换
    handleOriginStatus(status) {
      switch (parseInt(status, 10)) {
        case 1:
          return '境内'
        case 2:
          return '境外'
        case 3:
          return '港澳台'
      }
    },
    // 管理类别
    handleManageTypeStatus(status) {
      switch (parseInt(status, 10)) {
        case 1:
          return 'Ⅰ类'
        case 2:
          return 'Ⅱ类'
        case 3:
          return 'Ⅲ类'
      }
    },
    handleReset() {
      this.filter = {
        registerCardNo: '',
        name: '',
        manufactureName: '',
        aup2ProjectTypeId: '',
        managementType: '',
        page: 1,
        size: 10
      }
      this.getOrgData()
    },
    // 选择
    handleSelection(selection) {
      this.selection = selection.map(item => item.id)
    },
    // 批量删除
    handleRemove() {
      const self = this
      if (this.checkout.length > 0) {
        this.$Modal.confirm({
          title: '批量删除产品',
          content: '确定删除吗？此操作不可逆',
          okText: '确定',
          cancelText: '取消',
          onOk() {
            self.$store
              .dispatch('registration/delteRegisters', {
                ids: self.checkout.join(',')
              })
              .then(payload => {
                if (payload.success) {
                  self.getOrgData()
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
      if (this.proNumArray.length > 0) {
        for (var val of this.proNumArray) {
          if (val == 0)
            return this.$Message.error('产品数量为0的注册证不能提交审核')
          break
        }
      }
      if (!this.checkout.length)
        return this.$Message.error('请选择要申报的注册证')
      this.disabledApply = true
      let params = { ids: this.checkout.join(',') }
      this.submitRegisterCheck(params).then(
        res => {
          this.disabledApply = false

          this.$Message.success('注册证申报成功')
          // 刷新列表
          this.getOrgData()
        },
        err => {
          this.disabledApply = false
        }
      )
    },
    // 翻页
    handlePager(page) {
      this.filter.page = page
      this.getOrgData()
    },
    handlePageSize(pageSize) {
      this.filter.size = pageSize
      this.getOrgData()
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
          .then(
            payload => {
              if (payload.success) {
                // 清除上传列表
                this.$refs['profile'].clearFiles()
                // 清空上传
                this.profile.fileId = ''
                this.$Message.success('导入成功')
                this.profile.fileId = ''
                this.getOrgData()
              }
              this.profile.show = false
              this.exeFileState = false
            },
            err => {
              this.profile.show = false
            }
          )
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
#pcont {
  overflow-x: hidden;
}
.head-tab {
  background: #c3f3fc;
  // color: #fff;
  .head-tab_btn {
    position: relative;
    display: inline-block;
    color: inherit;
    font-size: 14px;
    padding: 15px 40px;
    transition: all 0.3s;
    &.active {
      background: #c3f3cc;
      // color: #fff;
    }
  }
}

// 过滤
.head-filter {
  .ivu-row-flex {
    margin: 15px 0;
  }
  .ivu-col {
    margin-bottom: 15px;
  }
}
.list-inline > * {
  display: inline-block;
  margin-right: 15px;
}
.table {
  //margin-top: 15px;
  th,
  td {
    text-align: center;
  }
}
.ivu-page {
  margin-top: 15px;
}

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
