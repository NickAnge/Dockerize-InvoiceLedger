import Vue from 'vue';
import Vuex from 'vuex';

import account from './modules/account';
import createDeliveryNote from './modules/createDeliveryNote';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    account,
    createDeliveryNote
  }
});
