import { shallowMount } from '@vue/test-utils'
import GaugeProgress from '@/components/core/GaugeProgress'

describe('GaugeProgress', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(GaugeProgress, {
      propsData: {
        id: 'gauge_progress',
        value: -1,
        maxValue: 10,
        image: null
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
