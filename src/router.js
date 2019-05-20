import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import Info from './views/Info.vue';
import Analysis from './views/Analysis.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: (to) => {
        if (to.params.id !== 'corpes' || to.params.id !== 'amc') {
          return '/corpes/info';
        }
        return to.fullPath;
      },
    },
    {
      path: '/:id',
      component: App,
      // Children to the root path '/'
      children: [
        {
          path: 'info',
          name: 'info',
          components: {
            Content: Info,
          },
        },
        {
          path: 'analysis',
          name: 'analysis',
          components: {
            Content: Analysis,
          },
        },
      ],
    },
    {
      path: '',
      redirect: { name: 'info' },
    },
  ],
});
