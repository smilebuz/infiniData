import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login'

import Integration from '../views/Integration'
import Dashboard from '../views/Integration/Dashboard'
import OffImport from '../views/Integration/OffImport'
import OffImpDetail from '../views/Integration/OffImpDetail'
import CreateOffImp from '../views/Integration/CreateOffImp'
import IncImport from '../views/Integration/IncImport'
import OffExport from '../views/Integration/OffExport'
import Source from '../views/Integration/Source'

import Handle from '../views/Handle'
import Manage from '../views/Manage'
import Op from '../views/Op'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Integration
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
      children: [
        {
          path: 'Dashboard',
          component: Dashboard
        },
        {
          path: 'OffImport',
          component: OffImport
        },
        {
          path: 'OffImpDetail',
          component: OffImpDetail
        },
        {
          path: 'CreateOffImp',
          component: CreateOffImp
        },
        {
          path: 'IncImport',
          component: IncImport
        },
        {
          path: 'OffExport',
          component: OffExport
        },
        {
          path: 'Source',
          component: Source
        }
      ]
    },
    {
      path: '/Handle',
      name: 'Handle',
      component: Handle
    },
    {
      path: '/Manage',
      name: 'Manage',
      component: Manage
    },
    {
      path: '/Op',
      name: 'Op',
      component: Op
    }
  ]
})
