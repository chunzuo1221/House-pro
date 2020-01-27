import { shallowMount, createLocalVue } from '@vue/test-utils'
import PropertyImages from '@/components/property/PropertyImages'

describe('PropertyImages', () => {
  let localVue
  beforeEach(() => {
    localVue = createLocalVue()
  })
  it('renders correctly', () => {
    const wrapper = shallowMount(PropertyImages, {
      localVue,
      propsData: {
        images: [{
          url: 'https://bucket-api.domain.com.au/v1/bucket/image/w1600-h1200-2012780783_1_pi_160504_061639',
          name: 'Front'
        }]
      },
      data () {
        return {
          carouselDialog: false,
          editImageDialog: false,
          confirmDialog: false,
          imageIndex: -1,
          validInput: true,
          imageUrl: '',
          imageComment: '',
          urlRules: [],
          targetImage: null
        }
      },
      stubs: {
        'v-layout': '<div><slot></slot></div>',
        'v-card': '<div><slot></slot></div>',
        'v-card-title': '<div><slot></slot></div>',
        'v-card-text': '<div><slot></slot></div>',
        'v-card-actions': '<div><slot></slot></div>',
        'v-img': '<div><slot></slot></div>',
        'v-btn': '<div><slot></slot></div>',
        'v-icon': '<div><slot></slot></div>',
        'v-form': '<form><slot></slot></form>',
        'v-text-field': '<input />',
        'v-dialog': '<div><slot></slot></div>',
        'v-spacer': '<div></div>',
        'v-carousel': '<div><slot></slot></div>',
        'v-carousel-item': '<div><slot></slot></div>',
        'v-progress-circular': '<div><slot></slot></div>'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
