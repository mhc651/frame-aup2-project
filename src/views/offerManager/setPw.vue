// 组件列表
<template>
  <div>
    <!-- title -->
     <top-tool-bar class="title--bg" title='管理密码'>
          <span slot="content">
            <strong class="help">说明</strong>
            <p>
            无
            </p>
          </span>
      </top-tool-bar>
    <!-- title end-->
    <!-- content  -->
    <div class="page-container">
      <h1>
        初次使用请先设置管理秘钥
      </h1>
    <!-- content  end-->
    
     <ul class="text--red list--ol" style="margin-top:20px">
          <li>
           警告：请您务必记住设置的秘钥，如果丢失或遗忘，则无法将其恢复。 
          </li>
          <li>
            注意：设置的管理秘钥用于：报价加密和报价解密！将直接影响入围资格。
          </li>
        </ul>
        <Form ref="form" :model="form_offter" :rules="validate" :label-width="70" style="margin-top:20px">
          <FormItem class="form--padding" label="设置密码" prop="password">
            <Input type='password' v-model="form_offter.password" :style="{width:'200px'}" />
            <span  class="input-tip">
              6-20位英文（区分大小写）、数字、字符的组合
            </span>
          </FormItem>
          <FormItem class="form--padding" label="重复密码" prop="pw">
            <Input  type='password' v-model="form_offter.pw" :style="{width:'200px'}" />
            <span class="input-tip">
              请再次输入
            </span>
          </FormItem>
        </Form>
    </div>
    <!-- 密码设置 end-->
  </div>
</template>

<script>
import TopToolBar from '../../components/Common/TopToolBar.vue'
import TablePage from '../../components/tablePage.vue'
import FormGroup from '@/components/formGroup.vue'
import { mapState, mapActions } from 'vuex'
import { PAGE_SIZE_ARR } from '../../assets/js/const'
import { toTimeDate } from '../../assets/js/common'
import validatejs from '../../assets/js/validate'
import MyModal from '@/components/myModal.vue'
export default {
  data() {
    return {
      /**
       * 设置报价密码
       * @namespace
       * */
      modal_pw: true,
      form_offter: {
        password: '',
        pw: ''
      },
      validate: {
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(['offterConfig'])
  },
  methods: {
    ...mapActions([
      'groupList',
      'manageType',
      'subGroupId',
      'commitOffter',
      'offterList',
      'revokeOffter',
      'decryptOffter',
      'isOffterPw',
      'offterPw',
      'typegroupAndAttibuteListByGrouptypeId'
    ]),
    /**
     * 提交初始化密码
     */
    subPw() {
      this.$refs['form'].validate().then(bool => {
        if (!bool) return
        this.offterPw(this.form_offter).then(res => {
          this.$Message.success({ content: res.content })
          this.modal_pw = false
        })
      })
    }
  },
  components: { TopToolBar, TablePage, FormGroup, MyModal }
}
</script>
<style lang="scss" src='../../assets/css/page.scss'></style>



