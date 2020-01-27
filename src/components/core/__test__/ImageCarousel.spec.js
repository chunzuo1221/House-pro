import { shallowMount } from '@vue/test-utils'
import ImageCarousel from '@/components/core/ImageCarousel'

describe('ImageCarousel', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(ImageCarousel, {
      propsData: {
        images: [
          { url: 'https://images.pexels.com/photos/584399/living-room-couch-interior-room-584399.jpeg', name: 'Living room couch interior room' }
        ]
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
