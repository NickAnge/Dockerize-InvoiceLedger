// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import axios from 'axios'
import 'vuetify/dist/vuetify.min.css'
import store from './store/index' // paizei kai mono store xwris index
import Mapbox from 'mapbox-gl-vue';
/*
window.Bus=new Vue;
window.axios=axios

window.token= localStorage.getItem('token');
window.user= localStorage.getItem('user');

axios.defaults.baseURL = 'http://passport.test/api';
axios.defaults.headers.common['Authorization'] = "Bearer " + window.token;

axios.defaults.headers.post['Content-Type'] = 'application/json';
*/
Vue.use(Vuetify)

//Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters.loggedIn) {
      next({
        path: '/login'
      })
    }
    else {
      next()
    }
  }
  else if (to.matched.some(record => record.meta.requiresVisitor)) {
    // this route does not requires auth, check if it is free visitor
    // if not, redirect to login page.
    if (store.getters.loggedIn) {
      next({
        path: '/'
      })
    }
    else {
      next()
    }
  }
  else{
    next() // make sure to always call next()!
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App, 'mapbox': Mapbox },
  template: '<App/>'
})
