import { shallowMount, createLocalVue } from '@vue/test-utils'
import PropertyHeader from '@/components/property/PropertyHeader'

describe('PropertyHeader', () => {
  let localVue
  beforeEach(() => {
    localVue = createLocalVue()
  })
  it('renders correctly', () => {
    const wrapper = shallowMount(PropertyHeader, {
      localVue,
      propsData: {
        property: {
          formatted_address: '10 Coila St, Turramurra NSW 2074, Australia',
          externalData: [{
            dataRecords: {
              lot: 'Lot 12 DP4981',
              stateElectDiv: 'KU-RING-GAI'
            }
          }],
          createdAt: '2018-07-24 17:26:16.459'
        }
      },
      stubs: {
        'v-icon': '<div><slot></slot></div>',
        'v-progress-circular': '<div><slot></slot></div>'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
