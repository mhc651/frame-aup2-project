import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)
import { mapState } from 'vuex'

// store.dispatch('setToken').then(res =>{
// store.dispatch("getPageModel",{});
// });
var pageM = store.state.pageModel,
  pathArray = []
if (pageM.menus != null) {
  for (let mitem of pageM.menus) {
    let nowmid = mitem.id
    let mic = mitem.children
    for (let citem of mic) {
      let ncid = citem.id
      let npath = '/' + nowmid + '/' + ncid
      pathArray.push(npath)
    }
  }
  sessionStorage.setItem('pathArray', JSON.stringify(pathArray))
}

// 当从子级返回时读取历史
function tableStorage(to, form, next) {
  // 设置到导航
  let reg = new RegExp('^' + to.path + '/[a-z]+', 'gi')
  // 详情也记录
  if (!form.path.match(reg)) {
    sessionStorage.removeItem('aup2org' + to.path)
  }
  next()
}

// 当从子级返回时读取历史
function tableStorageo(to, form, next) {
  // 设置到导航
  let pathone = '/ma1/registration',
    pathtwo = '/LCSB/LCSB004/page/',
    pathth = '/LCSB/LCSB005/page/'
  // 详情也记录
  if (
    form.path.indexOf(pathone) == -1 &&
    form.path.indexOf(pathtwo) == -1 &&
    form.path.indexOf(pathth) == -1
  ) {
    sessionStorage.removeItem('aup2org' + to.path)
  }
  next()
}

Array.prototype.remove = function(dx) {
  if (isNaN(dx) || dx > this.length) {
    return false
  }
  for (var i = 0, n = 0; i < this.length; i++) {
    if (this[i] != this[dx]) {
      this[n++] = this[i]
    }
  }
  this.length -= 1
}

const router = new Router({
  mode: 'history',
  base: 'aup2org',
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: '',
      redirect: '/LCSB/LCSB001'
    },
    {
      path: '/index.html',
      name: '',
      redirect: '/LCSB/LCSB001'
    },
    {
      path: '/LCSB/LCSB001',
      name: '企业申报',
      component: () => import('@/views/apply/edit')
    },
    {
      path: '/LCSB/LCSB001/detail/:id',
      name: '企业申报详情',
      component: () => import('@/views/apply/detail')
    },
    {
      path: '/LCSB/LCSB001/edit/:id',
      name: '企业申报编辑',
      component: () => import('@/views/apply/edit')
    },
    {
      path: '/LCSB/LCSB002',
      name: '产品申报',
      component: () => import('@/views/apply/product')
    },
    {
      path: '/LCSB/LCSB003',
      name: '注册证列表页',
      component: () => import('@/views/apply/registrationM')
    },
    {
      path: '/ma1/registration/:registerId',
      name: '注册证详情',
      component: () => import('@/views/registration/index')
    },
    {
      path: '/ma1/registrationEdit/:registerId',
      name: '注册证编辑',
      component: () => import('@/views/registration/edit')
    },
    {
      path: '/LCSB/LCSB004/',
      name: '组件管理',
      component: () => import('@/views/group/list'),
      beforeEnter: tableStorage
    },
    {
      path: '/LCSB/LCSB004/page/:id',
      name: '组件详情',
      component: () => import('@/views/group/index')
    },
    {
      path: '/LCSB/LCSB004/page/',
      name: '组件添加',
      component: () => import('@/views/group/index')
    },
    {
      path: '/LCSB/LCSB005/',
      name: '产品管理',
      component: () => import('@/views/pro/list'),
      beforeEnter: tableStorage
    },
    {
      path: '/LCSB/LCSB005/page/:id',
      name: '单一规格详情',
      component: () => import('@/views/pro/index')
    },
    {
      path: '/LCSB/LCSB005/page/',
      name: '单一规格添加',
      component: () => import('@/views/pro/index')
    },
    {
      path: '/LCSB/LCSB006/',
      name: '企业入围公示',
      component: () => import('@/views/enterpriseEntry/list'),
      beforeEnter: tableStorageo
    },
    {
      path: '/LCSB/LCSB006/page/:id',
      name: '企业入围公示详情',
      component: () => import('@/views/enterpriseEntry/index')
    },
    {
      path: '/LCSB/LCSB007/pro/:id',
      name: '产品公示',
      component: () => import('@/views/apply/proData')
    },

    {
      path: '/LCSB/LCSB007/',
      name: '产品入围公示',
      component: () => import('@/views/proEntry/list'),
      beforeEnter: tableStorage
    },
    {
      path: '/BJGL/BJGL001',
      name: '报价管理',
      component: () => import('@/views/offerManager/offerManagerList'),
      beforeEnter: tableStorageo
    },
    {
      path: '/BJGL/BJGL001/pw/:id',
      name: '报价设置',
      component: () => import('@/views/offerManager/pwlist'),
      beforeEnter: tableStorageo
    },
    {
      path: '/BJGL/BJGL001/pro/:id',
      name: '入选公示',
      component: () => import('@/views/apply/proData')
    },
    {
      path: '/BJGL/BJGL001/selected/:id',
      name: '入选管理',
      component: () => import('@/views/offerManager/selectedList'),
      beforeEnter: (t, f, n) => {
        if (f.name != '入选公示') {
          sessionStorage.removeItem('aup2org/BJGL/BJGL001')
        }
        n()
      }
    },
    {
      path: '/BJGL/BJGL002',
      name: '历史报价查询',
      component: () => import('@/views/historyOffer/list'),
      beforeEnter: tableStorageo
    },
    {
      path: '/BJCLZB/BJCLZB001/detail/:projectApplyId',
      name: '材料增补详情页',
      component: () => import('@/views/materialSupp/detail')
    },
    {
      path: '/BJCLZB/BJCLZB002',
      name: '产品价格维护',
      component: () => import('@/views/materialSupp/list')
    },
    {
      path: '/BJCLZB/BJCLZB001/edit/:projectApplyId',
      name: '材料增补编辑页',
      component: () => import('@/views/materialSupp/edit')
    },
    {
      path: '/ZZRX/ZZRX001',
      name: '最终入选管理',
      component: () => import('@/views/finalSelRes/list'),
      beforeEnter: tableStorage
    },
    {
      path: '/ZZRX/ZZRX002',
      name: '最终入选公示',
      component: () => import('@/views/finalSelPub/list'),
      beforeEnter: tableStorage
    }
  ]
})
router.beforeEach((to, from, next) => {
  const app = JSON.parse(sessionStorage.getItem('_token'))
  // 是否登录
  if (app) {
    // 修改title
    document.querySelector('title').innerText = to.name
    // store.dispatch('setToken', app.accessToken);
    // const baseUrl = process.env.NODE_ENV === 'production' ? '/aup2org' : '';
    if (to.path === '/LCSB/LCSB001') {
      // 查询是否初次进入
      store.dispatch('apply/into', {}).then(payload => {
        if (payload.success) {
          if (
            payload.content &&
            payload.content.data &&
            payload.content.data.id != null
          ) {
            sessionStorage.setItem('projectApplyId', payload.content.data.id)
            next({ path: `/LCSB/LCSB001/detail/${payload.content.data.id}` })
          } else {
            next()
          }
        }
      })
    } else {
      if (
        from.path.indexOf('/ma1/registration') == -1 &&
        to.path.indexOf('/LCSB/LCSB003') != -1
      ) {
        sessionStorage.setItem('index', 0)
      }
      if (from.path.indexOf('/ma1/registration') == -1) {
        sessionStorage.setItem('produceState', '1')
      }
      let msed = sessionStorage.getItem('mlistedit')
      if (msed != null) {
        if (
          (from.path.indexOf('/LCSB/LCSB003') != -1 &&
            to.path.indexOf('/ma1/registrationEdit') != -1) ||
          (to.path.indexOf('/ma1/registration/') != -1 &&
            from.path.indexOf('/ma1/registrationEdit') != -1)
        ) {
          /*从注册证列表页到注册证编辑页，或从注册证编辑页到注册证详情页*/
        } else {
          sessionStorage.removeItem('mlistedit')
        }
      }
      if (to.path === '/BJCLZB/BJCLZB001') {
        // 查询是否初次进入报名材料增补
        let projectApplyId = sessionStorage.getItem('projectApplyId'),
          param = {}
        if (projectApplyId != null) {
          param.projectApplyId = projectApplyId
          store
            .dispatch('apply/addDetail', { projectApplyId: projectApplyId })
            .then(payload => {
              if (payload.success) {
                if (
                  payload.content &&
                  payload.content.data &&
                  payload.content.data.id != null
                ) {
                  var existpic = false,
                    atbj = payload.content.data.attributeJson
                  for (let key in atbj) {
                    if (
                      atbj[key] != null &&
                      atbj[key] != '' &&
                      atbj[key].length > 0
                    ) {
                      existpic = true
                      break
                    }
                  }
                  if (existpic) {
                    next({
                      path: `/BJCLZB/BJCLZB001/detail/${
                        payload.content.data.id
                      }`
                    })
                  } else {
                    next({ path: `/BJCLZB/BJCLZB001/edit/add` })
                  }
                } else {
                  next({ path: `/BJCLZB/BJCLZB001/edit/add` })
                }
              }
            })
        } else {
          next({ path: `/BJCLZB/BJCLZB001/edit/add` })
        }
      }
      next()
    }
  } else {
    if (!window.location.host.match(/localhost/i)) {
      window.location.href = '/portal/login'
    }
  }
})
export default router
