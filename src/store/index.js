import { createStore } from 'vuex';
import pokemon from './modules/index';

export default createStore({
  modules: {
    pokemon
  }
});
