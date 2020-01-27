import store from '@/store'
import Cognito from '@/api/cognito'

const requiresAuth = (to) => {
  return to.matched.some(record => typeof record.meta.requiresAuth === 'undefined' || record.meta.requiresAuth)
}

const requiresAdmin = (to) => {
  return to.matched.some(record => record.meta.requiresAdmin)
}

const authGuard = (to, from, next) => {
  setTimeout(() => {
    if (requiresAuth(to)) {
      if (store.getters.isAuthenticated) {
        if (requiresAdmin(to) && !store.getters.isAdmin) {
          next(false)
        } else {
          next()
        }
      } else {
        Cognito.login()
      }
    } else {
      next()
    }
  }, 1)
}

export default authGuard
