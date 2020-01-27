import { shallowMount } from '@vue/test-utils'
import Profile from '@/pages/Profile'

describe('Profile', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(Profile, {
      data () {
        return {
          success: {
            profile: false,
            changePassword: false
          },
          errors: {
            profile: false,
            changePassword: false
          },
          passwordForm: {
            oldPassword: '',
            newPassword: ''
          },
          user: {
            email: '',
            givenName: '',
            familyName: '',
            gender: '',
            birthdate: new Date()
          }
        }
      },
      computed: {
        userInfo: () => ({
          email: 'test@mail.com',
          givenName: 'Web',
          familyName: 'Master',
          gender: 'male',
          birthdate: '2000-01-01'
        })
      },
      stubs: {
        'el-date-picker': '<div></div>'
      }
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
