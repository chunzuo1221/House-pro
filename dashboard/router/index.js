import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import authGuard from './guards/authGuard'

Vue.use(Router)

const router = new Router({
  routes,
  scrollBehavior (_to, _from) {
    return { x: 0, y: 0 }
  },
  mode: 'history',
  base: '/dashboard/'
})

router.beforeEach(authGuard)

export default router
