import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

import PrimeVue from "primevue/config";
// import "primeflex/primeflex.css";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/aura-dark-cyan/theme.css";

app.use(PrimeVue, {
    theme: {
        // preset: Aura
    }
});


app.use(createPinia());
app.use(router);

import loadComp from "./loadComp";

loadComp(app);

app.mount("#app");
