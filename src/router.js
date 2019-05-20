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
          return '/corpes';
        }
        return to.fullPath;
      },
    },
    {
      path: '/:id',
      components: {
        default: App,
      },
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
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          components: {
            Content: Analysis,
          },
        },
      ],
    },
  ],
});
