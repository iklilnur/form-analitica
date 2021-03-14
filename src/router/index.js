import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Form from '../views/Form.vue'

Vue.use(VueRouter)

function configRoutes() {
  return[
    {
      path: '/',
      name: 'Form',
      component: Form
    },
    {
      path: '/:fid',
      name: 'Form',
      component: Form
    },
    { path: '*', redirect: '/' }
  ]
}

const routes = [
]

const router = new VueRouter({
  mode: "history",
  hash: false,
  routes: configRoutes()
})

export default router
