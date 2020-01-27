import { shallowMount } from '@vue/test-utils'
import ConfirmationModal from '@/components/core/ConfirmationModal'

describe('ConfirmationModal', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(ConfirmationModal)
    expect(wrapper.element).toMatchSnapshot()
  })
})
