import Vue from 'vue'
import Vuex from 'vuex'
import authPlugin from './plugins/authPlugin'
import auth from './modules/common/auth'
import config from './modules/common/config'
import reference from './modules/common/reference'
import main from './modules/user/main'
import suburb from './modules/admin/suburb'
import question from './modules/admin/question'
import scoringRule from './modules/admin/scoring-rule'
import proximityRule from './modules/admin/proximity-rule'
import contentFragments from './modules/admin/content-fragments'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // common modules
    auth,
    config,
    reference,
    // user main features module
    main,
    // admin features modules
    suburb,
    question,
    scoringRule,
    proximityRule,
    contentFragments
  },
  plugins: [
    authPlugin
  ]
})
