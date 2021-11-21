import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
  return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: importComponent("DashboardLayout"),
      children: [
        //Dashboard
        {
          path: "/dashboard",
          name: "Dashboard",
          meta: { title: 'Dashboard' },
          component: importComponent("Dashboard"),
        },
        // Courses
        {
          path: "/course",
          name: "Course",
          meta: { title: 'Courses' },
          component: importComponent("DataMaster/Courses"),
        },
      ],
    },

    // login

    {
      path: '/login',
      name: 'Login',
      meta: { title: 'Login' },
      component: importComponent('Login'),
    },
    {
      path: '*',
      redirect: '/'

    },

  ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});


export default router;
