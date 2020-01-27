import Login from '@/pages/Login'
import PropertyList from '@/pages/PropertyList'
import PropertyDetail from '@/pages/PropertyDetail'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  }, {
    path: '/properties',
    name: 'Properties',
    component: PropertyList,
    children: [
      {
        path: ':id',
        component: PropertyDetail,
        props: (route) => ({propertyId: route.params.id})
      }
    ]
  }, {
    path: '*',
    redirect: '/properties'
  }
]

export default routes
