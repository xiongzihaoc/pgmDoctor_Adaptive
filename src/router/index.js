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
        name: "index",
        component: () => import('@/components/Index.vue'),
        meta: {
          title: '首页',
        }
      },
      {
        path: '/home/userCenter',
        name: "userCenter",
        hidden:true,
        component: () => import('@/components/userCenter/userCenter.vue'),
        meta: {
          title: '用户中心',
        },
      },
      {
        path: '/home/teamCenter',
        name: "teamCenter",
        component: () => import('@/components/TeamCenter/TeamCenter.vue'),
        meta: {
          title: '团队中心',
        },
      },
      {
        path: '/home/userCenter/addNewPer',
        name: "addNewPer",
        component: () => import('@/components/UserList/AddNewPer.vue'),
        meta: {
          title: '个人新增',
        },
      },
      {
        path: '/home/userCenter/addNewTeam',
        name: "addNewTeam",
        component: () => import('@/components/UserList/AddNewTeam.vue'),
        meta: {
          title: '团队新增',
        },
      },
      {
        path: '/home/userCenter/userDetails',
        name: "userDetails",
        component: () => import('@/components/userCenter/userDetails.vue'),
        meta: {
          title: '用户详情',
        }
      },
      {
        path: '/home/HisScale',
        name: "HisScale",
        component: () => import('@/components/HisScale/HisScale.vue'),
        meta: {
          title: '他评量表',
        }
      },
      {
        path: '/home/examiningReport',
        name: "examiningReport",
        component: () => import('@/components/examiningReport/examiningReport.vue'),
        meta: {
          title: '检测报告',
        }
      },
      {
        path: '/home/examiningReport/AnsDetail',
        name: "AnsDetail",
        component: () => import('@/components/examiningReport/AnswerDetail.vue'),
        meta: {
          title: '答题详情',
        }
      },
      {
        path: '/home/examiningReport/examiningDetail',
        name: "examiningDetail",
        component: () => import('@/components/examiningReport/examiningDetail.vue'),
        meta: {
          title: '报告详情',
        }
      },
      {
        path: '/home/warning',
        name: "warning",
        component: () => import('@/components/warning/warning.vue'),
        meta: {
          title: '预警提醒',
        }
      },
      {
        path: '/home/consultation',
        name: "consultation",
        component: () => import('@/components/consultation/consultation.vue'),
        meta: {
          title: '会诊操作',
        }
      },
      {
        path: '/home/consultationList',
        name: "consultationList",
        component: () => import('@/components/consultation/consultationList.vue'),
        meta: {
          title: '会诊意见',
        }
      },
      {
        path: '/home/consultationMessage',
        name: "consultationMessage",
        component: () => import('@/components/consultation/consultationMessage.vue'),
        meta: {
          title: '会诊消息',
        }
      },
      {
        path: '/home/consultationExamine',
        name: "consultationExamine",
        component: () => import('@/components/consultation/consulationExamine.vue'),
        meta: {
          title: '患者信息',
        }
      },
      {
        path: '/home/addConsultationSugg',
        name: "addConsultationSugg",
        component: () => import('@/components/consultation/addConsultationSugg.vue'),
        meta: {
          title: '开始会诊',
        }
      },
      {
        path: '/home/dataStatistics',
        name: "dataStatistics",
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