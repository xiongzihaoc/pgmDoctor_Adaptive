import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/Global.css'
import './assets/iconfont/iconfont.css'
// nprogress 请求进度条导入
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// v-charts导入
import VCharts from 'v-charts'
Vue.use(VCharts)
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);
// md5加密
import md5 from 'js-md5'
Vue.prototype.$md5 = md5;
// 导入axios
import axios from 'axios'
import animated from 'animate.css' // npm install animate.css --save安装，在引入
Vue.use(animated)
// // 配置axios
axios.defaults.baseURL = 'http://192.168.0.142:8086/zhuoya-sheet/'
// axios请求拦截器
axios.interceptors.request.use(function (config) {
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  console.log(error);
})
// axios响应拦截器
axios.interceptors.response.use(function (config) {
  if (config.status != 200) return this.$message.error('服务器异常')
  Nprogress.done()
  return config;
}, function (error) {
  console.log(error)
})
// 全局挂载axios this.$http调用即可
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 弹框拖拽功能
import './assets/js/directives.js'
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')