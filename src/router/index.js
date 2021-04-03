import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Form from '../views/Form.vue'
import TestForm from '../views/TestForm.vue'

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
    {
      path: '/tes/:fid',
      name: 'TestForm',
      component: TestForm
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
