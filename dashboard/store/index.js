import Vue from 'vue'
import Vuex from 'vuex'
import authPlugin from './plugins/authPlugin'
import auth from './modules/auth'
import reference from './modules/reference'
import portfolio from './modules/portfolio'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    reference,
    portfolio
  },
  plugins: [
    authPlugin
  ]
})
