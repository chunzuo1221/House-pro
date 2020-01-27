import {
  FETCH_CONTENT_FRAGMENTS,
  DELETE_CONTENT_FRAGMENT,
  SAVE_CONTENT_FRAGMENTS
} from '../../action-types'
import { SET_CONTENT_FRAGMENTS, SET_CONTENT_FRAGMENTS_ERROR } from '../../mutation-types'
import FragmentApi from '@/api/content-fragments'

export default {
  state: {
    fragments: [],
    hasPendingChanges: false,
    error: null
  },
  actions: {
    [FETCH_CONTENT_FRAGMENTS]: async ({commit}) => {
      const fragments = await FragmentApi.get()
      commit(SET_CONTENT_FRAGMENTS, {fragments})
    },
    [DELETE_CONTENT_FRAGMENT]: async ({commit}, payload) => {
      await FragmentApi.deleteFragment(payload)
      const fragments = await FragmentApi.get()
      commit(SET_CONTENT_FRAGMENTS, {fragments})
    },
    [SAVE_CONTENT_FRAGMENTS]: async ({commit}, {fragment}) => {
      try {
        await FragmentApi.update(fragment)
        const fragments = await FragmentApi.get()
        commit(SET_CONTENT_FRAGMENTS, {fragments})
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          commit(SET_CONTENT_FRAGMENTS_ERROR, error.response.data.message)
        }
      }
    }
  },
  mutations: {
    [SET_CONTENT_FRAGMENTS]: (state, payload) => {
      state.fragments = payload.fragments
    },
    [SET_CONTENT_FRAGMENTS_ERROR]: (state, payload) => {
      state.error = payload
    }
  }
}
