import { createRouter, createWebHashHistory } from "vue-router";
import about from "./page/about.vue";
import contacts from "./page/contacts.vue";
import mainPage from "./components/mainPage.vue";
import Log from "./page/log.vue";
import home from "./page/home.vue";
import reg from "./page/reg.vue";

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: '/', component: mainPage},
        {path: '/about', component: about},
        {path: '/contacts', component: contacts},
        {path: '/log', component: Log},
        {path: '/reg', component: reg},
        {path: '/home', component: home}
    ]
})