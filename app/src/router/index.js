import Vue from 'vue'
import Router from 'vue-router'
import Integration from '@/views/Integration'
import Dashboard from '@/views/Dashboard'
import OffImport from '@/views/OffImport'
import CreateOffImp from '@/views/CreateOffImp'
import IncImport from '@/views/IncImport'
import OffExport from '@/views/OffExport'
import Source from '@/views/Source'
import Handle from '@/views/Handle'
import Manage from '@/views/Manage'
import Op from '@/views/Op'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '/',
      component: Integration
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
