import store from '@/store'

const requiresAuth = (to) => {
  return to.matched.some(record => typeof record.meta.requiresAuth === 'undefined' || record.meta.requiresAuth)
}

const authGuard = (to, from, next) => {
  setTimeout(() => {
    if (requiresAuth(to) && !store.getters.isAuthenticated) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  }, 1)
}

export default authGuard
