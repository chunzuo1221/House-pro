import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import AgentListing from '@/components/property/AgentListing'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(Vuetify)

describe('AgentListing', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(AgentListing, {
      localVue,
      store: new Vuex.Store({
        state: {
          portfolio: {
            currentProperty: {
              property: {}
            }
          }
        }
      })
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
