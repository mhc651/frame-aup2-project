<template>
  <div class="layout">
    <Header :style="{padding: 0}" class="layout-header-bar">
      <Row type="flex" justify="start">
        <Col span="16">
        <router-link to="/" class="logo">
          <Icon @click.native.prevent="collapsedSider" :class="rotateIcon" :style="{margin: '20px 20px 0'}" type="navicon-round"
                size="24"></Icon>
          <span class="page-title"><span>{{ pageModel.title }}</span></span>
        </router-link>
        </Col>
        <Col span="8" style="text-align: right;padding-right: 25px">
          <Dropdown @on-click="handleLogout" style="text-align: left">
            <!-- 用户名 -->
            <a href="javascript:void(0)">
               <span v-if="pageModel.tools" v-for="tool of pageModel.tools" :key='tool.index'>
                  <span class="user-info" v-if="tool.type==='user'" v-text="tool.props.realName">
                  </span>
                </span>
            </a>
            <!-- 用户名 end-->
            <DropdownMenu slot="list">
              <DropdownItem v-if="pageModel.tools" v-for="tool of pageModel.tools" :key='tool.index'>
                  <span class="user-info" v-if="tool.type==='user'" v-text="tool.props.realName">
                  </span>
              </DropdownItem>
              <DropdownItem divided @click="handleLogout" name="logout">退出</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Avatar icon="person"/>
        </Col>
      </Row>
    </Header>
    <Layout>
      <Layout>
        <Sider class="sider" ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <!-- 公司名称 -->
          <div class="company text-overflow" v-show="!isCollapsed">{{ pageModel.orgName }}</div>
          <!-- 公司名称 end-->
          <!-- side nav -->
          <Menu :active-name="$route.path" theme="light" width="auto" :open-names="outMenuId" :class="menuitemClasses"
                v-show="!isCollapsed">
            <template v-for="item of pageModel.menus" v-if="pageModel&&pageModel.menus">
              <MenuItem :key="'/'+item.id+'/'+item.children[0].id" v-if="item.children&&item.children.length===0">
                <router-link :to="item.children[0].id" class="submenu-title">
                  <span>{{item.text}}</span>
                </router-link>
              </MenuItem>
              <Submenu :name="item.id" v-else class="submenu-title">
                <template slot="title">
                  <svg-icon iconClass="application"></svg-icon>
                  <span>{{item.text}}</span>
                </template>
                <MenuItem :name="'/'+item.id+'/'+child.id" v-for="child of item.children" :key='child.index'>
                  <template>
                    <router-link :to="'/'+item.id+'/'+child.id">
                      <span>{{child.text}}</span>
                    </router-link>
                  </template>
                </MenuItem>
              </Submenu>
            </template>
          </Menu>
          <!-- side nav end-->
          <sidebarMenuShrink
            v-show="isCollapsed"
            :menu-list="pageModel.menus"
            :icon="'application'"
          ></sidebarMenuShrink>
        </Sider>
        <Content :style="{padding:'10px',background: '#fff', minHeight: 'calc(100vh - 84px)'}">
          <router-view/>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import sidebarMenuShrink from './views/layout/Sidebar/sidebarMenuShrink.vue'
export default {
  data() {
    return {
      isCollapsed: false,
      // outMenuId: []
    }
  },
  components: { sidebarMenuShrink },
  computed: {
    // pageModel: this.$store.state.pageModel
    ...mapState(['pageModel']),
    rotateIcon() {
      return ['menu-icon', this.isCollapsed ? 'rotate-icon' : '']
    },
    menuitemClasses() {
      return ['menu-item', this.isCollapsed ? 'collapsed-menu' : '']
    },
    // 设置side展开
    outMenuId() {
      let frameData = this.$store.state.pageModel
      let arr = []
      for (let item of frameData.menus) {
        arr.push(item.id)
      }
      return arr
    }
  },
  created() {
    this.getPageModel()
    // this.getInitIntoData();
    // 打开菜单
    // this.getPageModelMenusId()
  },
  methods: {
    getPageModel() {
      this.$store.dispatch('getPageModel', {})
    },
    getInitIntoData() {
      this.$store.dispatch('getInitIntoData', {})
    },
    collapsedSider() {
      this.$refs.side1.toggleCollapse()
    },
    handleLogout(name) {
      if (name === 'logout') {
        this.$store.dispatch('logout', {})
      }
    },
    // getPageModelMenusId() {
    //   let frameData = this.$store.state.pageModel
    //   for (let item of frameData.menus) {
    //     this.outMenuId.push(item.id)
    //   }
    // }
  }
}
</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  height: 100vh;
}

.ivu-menu-light {
  background: #f5f5f5;
}

.sider {
  min-height: calc(100vh - 64px);
  background: #f5f5f5;
}

.sider a {
  color: #495060;
  display: block;
}

.sider .ivu-menu-item-selected > a {
  color: #2d8cf0;
  display: block;
}

.submenu-title {
  font-size: 16px;
}

.layout-header-bar {
  background: #fff;
  border-bottom: 1px solid #e6e5e5;
  /* overflow: hidden; 导致退出无法显示 */
}

.company {
  width: 200px;
  height: 60px;
  background: url('./assets/img/hx/bg.png');
  text-align: center;
  line-height: 60px;
  font-size: 16px;
}

.logo {
  background: url('./assets/images/logo.png') no-repeat left center;
  width: 100%;
  height: 60px;
  background-size: 142px 60px;
  display: inline-block;
  padding-left: 150px;
  color: #000;
}

.page-title {
  font-size: 20px;
}

.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.menu-icon {
  transition: all 0.3s;
}

.rotate-icon {
  transform: rotate(-90deg);
}

.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 110px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}

.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}

.collapsed-menu span {
  width: 0;
  transition: width 0.2s ease;
}

.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>

