import { createApp } from "vue";
import { createAuth0 } from '@auth0/auth0-vue';
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";


const app = createApp(App);

app.use(router);

app.use(
  createAuth0({
    domain: "dev-2b3l1vyfg2d4azrk.us.auth0.com",
    clientId: "Q8JIK37gPVZrHWaGCTz3Ozxtm7Ct6aRF",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'http://ubeers.com'
    },
    cacheLocation: 'localstorage',
  })
);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");
