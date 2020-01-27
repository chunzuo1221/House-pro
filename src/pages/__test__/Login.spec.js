import {
  shallowMount,
  createLocalVue
} from '@vue/test-utils';
import Vuex from 'vuex';
import Login from '@/pages/Login.vue';
import VueRouter from 'vue-router';

const localVue = createLocalVue();
localVue.use(Vuex);
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Login
  }
]

describe('Login component', () => {
  let store;
  const storeMock = Object.freeze({
    getters: {
      isAuthenticated: () => false
    },
    actions: {
      REQUEST_ACCESS_TOKEN: jest.fn()
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    store = new Vuex.Store(storeMock);
  });

  test('dispatches REQUEST_ACCESS_TOKEN if the isAuthenticated is false and query code is true', (done) => {
    const wrapper = shallowMount(Login, {
      localVue,
      store,
      router: new VueRouter({routes}),
      mocks: {
        $route: {
          query: {
            code: 'the-authorization-code'
          }
        },
        $router: {
          replace: (o) => null
        }
      }
    });
    wrapper.vm.$nextTick(() => {
      expect(storeMock.actions.REQUEST_ACCESS_TOKEN).toHaveBeenCalledTimes(1);
      done();
    });
  });
});
