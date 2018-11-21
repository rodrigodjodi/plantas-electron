import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import "./registerServiceWorker";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import config from "./assets/firebaseConfig";
firebase.initializeApp(config);
Vue.config.productionTip = false;
firebase.auth().signInAnonymously();
let app;
if (!app) {
  app = new Vue({
    render: function(h) {
      return h(App);
    }
  }).$mount("#app");
}
export const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
