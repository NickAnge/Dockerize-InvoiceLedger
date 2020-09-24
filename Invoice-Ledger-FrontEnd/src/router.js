import Vue from 'vue'
import Router from 'vue-router'
import LoginComponent from "./views/login.vue"
import HomepageComponent from "./views/homepage.vue"
import RegisterComponent from "./views/register.vue"
import HomeComponent from "./views/home.vue"
import DeliveryNotes from "./views/deliveryNotes.vue"

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name:"home",
            component: HomeComponent
        },
        {
            path: "/login",
            name:"login",
            component: LoginComponent
        },
        {
            path: "/homepage",
            name:"homepage",
            component: HomepageComponent,
            meta: { requiresAuth: true }
        },
        {
            path: "/register",
            name:"register",
            component: RegisterComponent 
        },
        {
            path: "/deliveryNotes",
            name:"deliverynotes",
            component: DeliveryNotes,
            meta: { requiresAuth: true }
        }
    ]
})