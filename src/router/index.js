import Vue from 'vue'
import VueRouter from 'vue-router'
import UserList from '@/components/UserList'
import UserDetail from '@/components/UserDetail'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/users"
  },
  {
    path: "/users",
    component: UserList
  },
  {
    path: "/users/:id",
    component: UserDetail,
    props: true
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
