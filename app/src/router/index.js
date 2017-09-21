import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login'

import Integration from '../views/Integration'
import Dashboard from '../views/Integration/Dashboard'
import OffImport from '../views/Integration/OffImport'
import OffImpDetail from '../views/Integration/OffImpDetail'
import CreateOffImp from '../views/Integration/CreateOffImp'
import IncImport from '../views/Integration/IncImport'
import IncImpDetail from '../views/Integration/IncImpDetail'
import CreateIncImp from '../views/Integration/CreateIncImp'
import OffExport from '../views/Integration/OffExport'
import OffExpDetail from '../views/Integration/OffExpDetail'
import CreateOffExp from '../views/Integration/CreateOffExp'
import Source from '../views/Integration/Source'
import CreateSource from '../views/Integration/CreateSource'

import Handle from '../views/Handle'
import Manage from '../views/Manage'

import Op from '../views/Op/Op'
import LogManage from '../views/Op/LogManage'
import UserManage from '../views/Op/UserManage'
import SystemResource from '../views/Op/SystemResource'

import SelectTest from '../views/SelectTest'

import store from '../store'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/Integration/Dashboard'
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Integration',
      name: 'Integration',
      component: Integration,
      meta: { requiresAuth: true },
      children: [
        {
          path: 'Dashboard',
          meta: { requiresAuth: true },
          component: Dashboard
        },
        {
          path: 'OffImport',
          meta: { requiresAuth: true },
          component: OffImport
        },
        {
          path: 'OffImpDetail/:taskId',
          meta: { requiresAuth: true },
          component: OffImpDetail
        },
        {
          path: 'CreateOffImp',
          meta: { requiresAuth: true },
          component: CreateOffImp
        },
        {
          path: 'IncImport',
          meta: { requiresAuth: true },
          component: IncImport
        },
        {
          path: 'IncImpDetail/:taskId',
          meta: { requiresAuth: true },
          component: IncImpDetail
        },
        {
          path: 'CreateIncImp',
          meta: { requiresAuth: true },
          component: CreateIncImp
        },
        {
          path: 'OffExport',
          meta: { requiresAuth: true },
          component: OffExport
        },
        {
          path: 'OffExpDetail/:taskId',
          meta: { requiresAuth: true },
          component: OffExpDetail
        },
        {
          path: 'CreateOffExp',
          meta: { requiresAuth: true },
          component: CreateOffExp
        },
        {
          path: 'Source',
          meta: { requiresAuth: true },
          component: Source
        },
        {
          path: 'CreateSource',
          meta: { requiresAuth: true },
          component: CreateSource
        }
      ]
    },
    {
      path: '/Handle',
      name: 'Handle',
      meta: { requiresAuth: true },
      component: Handle
    },
    {
      path: '/Manage',
      name: 'Manage',
      meta: { requiresAuth: true },
      component: Manage
    },
    {
      path: '/Op',
      name: 'Op',
      meta: { requiresAuth: true },
      component: Op,
      children: [
        {
          path: 'LogManage',
          name: 'LogManage',
          component: LogManage
        },
        {
          path: 'UserManage',
          name: 'UserManage',
          meta: { requiresAuth: true },
          component: UserManage
        },
        {
          path: 'SystemResource',
          name: 'SystemResource',
          meta: { requiresAuth: true },
          component: SystemResource
        }
      ]
    },
    {
      path: '/SelectTest',
      name: 'SelectTest',
      meta: { requiresAuth: true },
      component: SelectTest
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.user.name) {
      next({
        path: '/Login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
