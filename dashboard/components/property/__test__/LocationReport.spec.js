import { shallowMount, createLocalVue } from '@vue/test-utils'
import LocationReport from '@/components/property/LocationReport'

describe('LocationReport', () => {
  let localVue
  beforeEach(() => {
    localVue = createLocalVue()
  })
  it('renders correctly', () => {
    const wrapper = shallowMount(LocationReport, {
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
        'v-layout': '<div><slot></slot></div>',
        'v-flex': '<div><slot></slot></div>',
        'v-icon': '<div><slot></slot></div>',
        'v-divider': '<hr/>',
        'v-spacer': '<div></div>',
        'v-progress-linear': '<div><slot></slot></div>',
        'gauge-progress': '<div><slot></slot></div>',
      },
      mocks: {
        $store: {
          state: {
            portfolio: {
              currentProperty: {
                surveyAnswer: {},
                proximityAssessment: {},
                property: {},
                suburb: {
                  name: 'Willoughby, North Willoughby, East Willoughby, Castlecrag & Middle Cove',
                  postCode: '2068',
                  services: [],
                  overviewDescription: ''
                }
              }
            }
          }
        }
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
