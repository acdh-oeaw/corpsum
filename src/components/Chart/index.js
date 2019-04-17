import Chart from '@/components/Chart/component/index.vue';

Chart.install = function (Vue) {
  Vue.component(Chart.name, Chart);
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Chart);
}

export default Chart;
