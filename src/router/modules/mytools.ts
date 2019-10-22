export default [
    {
      path: '/mytools',
      name: 'mytools',
      component: () =>
        import(/* webpackChunkName: "mytools" */ '@/views/mytools/index.vue')
    },
    {
      path: '/mytools/latestPolicy',
      name: 'latestPolicy',
      component: () =>
        import(
          /* webpackChunkName: "latestPolicy" */ '@/views/mytools/views/latestPolicy.vue'
        )
    },
    {
      path: '/myServe/business',
      name: 'business',
      component: () =>
        import(
          /* webpackChunkName: "business" */ '@/views/myServe/business/index.vue'
        )
    },
    {
      path: '/myServe/business/detail',
      name: 'businessDetail',
      component: () =>
        import(
          /* webpackChunkName: "businessDetail" */ '@/views/myServe/business/detail/index.vue'
        )
    },
    {
      path: '/myServe/project',
      name: 'project',
      component: () =>
        import(
          /* webpackChunkName: "project" */ '@/views/myServe/project/index.vue'
        )
    }
  ]