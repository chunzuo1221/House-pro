import { shallowMount } from '@vue/test-utils'
import LineProgress from '@/components/core/LineProgress'

describe('LineProgress', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(LineProgress, {
      propsData: {
        id: 'line_progress',
        value: -1,
        maxValue: 10,
        image: null
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
