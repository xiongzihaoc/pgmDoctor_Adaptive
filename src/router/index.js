import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
// 解决路由连续点击两次报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/home',
    component: () => import('@/components/Home.vue'),
    redirect: '/home/index',
    children: [{
        path: '/home/index',
        name: "首页",
        component: () => import('@/components/Index.vue'),
        meta: {
          title: '首页',
        }
      },
      {
        path: '/home/userCenter',
        name: "用户中心",
        component: () => import('@/components/userCenter/userCenter.vue'),
        meta: {
          title: '用户中心',
        },
      },
      {
        path: '/home/userCenter/addNewPer',
        name: "个人新增",
        component: () => import('@/components/UserList/AddNewPer.vue'),
        meta: {
          title: '个人新增',
        },
      },
      {
        path: '/home/userCenter/addNewTeam',
        name: "团队新增",
        component: () => import('@/components/UserList/AddNewTeam.vue'),
        meta: {
          title: '团队新增',
        },
      },
      {
        path: '/home/userCenter/userDetails',
        name: "用户详情",
        component: () => import('@/components/userCenter/userDetails.vue'),
        meta: {
          title: '用户详情',
        }
      },
      {
        path: '/home/HisScale',
        name: "他评量表",
        component: () => import('@/components/HisScale/HisScale.vue'),
        meta: {
          title: '他评量表',
        }
      },
      {
        path: '/home/examiningReport',
        name: "检测报告",
        component: () => import('@/components/examiningReport/examiningReport.vue'),
        meta: {
          title: '检测报告',
        }
      },
      {
        path: '/home/examiningReport/AnsDetail',
        name: "答题详情",
        component: () => import('@/components/examiningReport/AnswerDetail.vue'),
        meta: {
          title: '答题详情',
        }
      },
      {
        path: '/home/examiningReport/examiningDetail',
        name: "报告详情",
        component: () => import('@/components/examiningReport/examiningDetail.vue'),
        meta: {
          title: '报告详情',
        }
      },
      {
        path: '/home/warning',
        name: "预警提醒",
        component: () => import('@/components/warning/warning.vue'),
        meta: {
          title: '预警提醒',
        }
      },
      {
        path: '/home/consultation',
        name: "会诊操作",
        component: () => import('@/components/consultation/consultation.vue'),
        meta: {
          title: '会诊操作',
        }
      },
      {
        path: '/home/dataStatistics',
        name: "数据操作",
        component: () => import('@/components/dataStatistics/dataStatistics.vue'),
        meta: {
          title: '数据操作',
        }
      },

    ]

  }

]

const router = new VueRouter({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router