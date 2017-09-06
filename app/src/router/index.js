import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Integration from '@/views/Integration'
import OffImport from '@/views/OffImport'
import IncImport from '@/views/IncImport'
import Handle from '@/views/Handle'
import Manage from '@/views/Manage'
import Op from '@/views/Op'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/Integration',
      name: 'Integration',
      component: Integration,
      children: [
        {
          path: 'OffImport',
          component: OffImport
        },
        {
          path: 'IncImport',
          component: IncImport
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
