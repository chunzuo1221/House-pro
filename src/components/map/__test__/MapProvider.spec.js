import Vue from 'vue';
import MapProvider from '@/components/map/MapProvider.vue';

describe('MapProvider Component', () => {

  test('loads the initial state of the props', () => {
    expect(MapProvider.props.google).toBeNull();
    expect(MapProvider.props.map).toBeNull();
  });

  test('mounts the component', () => {
    const vm = new Vue(MapProvider).$mount();
    expect(vm._isMounted).toBeTruthy();
  });
});
