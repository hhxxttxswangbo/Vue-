import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Loading } from 'element-ui'

Vue.use(ElementUI);

Vue.config.productionTip = false
//在全局配置axios
//配置请求根路径（在vue.config.js中修改了）
// axios.defaults.baseURL = 'https://www.escook.cn'
//解决跨域
axios.defaults.baseURL = 'http://localhost:3000'

//将axios挂在为Vue原型对象上的一个自定义属性
Vue.prototype.$http = axios


let loadingInstance = null
axios.interceptors.request.use((config) => {
  //展示Loading效果
  loadingInstance = Loading.service({ fullscreen: true })
  return config
})

axios.interceptors.response.use((res) => {
  loadingInstance.close()
  return res
})

//全局过滤器
Vue.filter("dateFormat", (dtstr) => {
  const dt = new Date(dtstr)

  const y = dt.getFullYear()

  const m = padZero(dt.getMonth() + 1)

  const d = padZero(dt.getDate())

  const hh = padZero(dt.getHours())

  const mm = padZero(dt.getMinutes())

  const ss = padZero(dt.getSeconds())

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 补零函数
function padZero(n) {
  return n > 9 ? n : "0" + n
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
