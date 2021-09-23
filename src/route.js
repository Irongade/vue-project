import { createRouter, createWebHistory } from "vue-router";

import CoachesList from './pages/coaches/CoachesList.vue'
// import CoachDetails from './pages/coaches/CoachDetails.vue'
// import CoachRegisteration from './pages/coaches/CoachRegisteration.vue'

import ContactCoach from './pages/requests/ContactCoach.vue'
// import ReceivedRequests from './pages/requests/ReceivedRequests.vue'

// import UserAuth from './pages/auth/UserAuth.vue'
import NotFound from './pages/NotFound.vue'

import store from './store/index'

const CoachDetails = () => import('./pages/coaches/CoachDetails.vue')
const CoachRegisteration = () => import('./pages/coaches/CoachRegisteration.vue')
const ReceivedRequests = () => import('./pages/requests/ReceivedRequests.vue')
const UserAuth = () => import('./pages/auth/UserAuth.vue')

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', redirect: '/coaches'
        },
        {
            path: '/coaches', component: CoachesList
        },
        {
            path: '/coaches/:id', component: CoachDetails, props: true, children: [
                {path: 'contact', component: ContactCoach} //  /coaches/c1/contact
            ]
        },
        {
            path: '/register', component: CoachRegisteration, meta: {requiresAuth: true}
        }, 
        {
            path: '/requests', component: ReceivedRequests, meta: {requiresAuth: true}
        },
        {
            path: '/auth', component: UserAuth, meta: {requiresUnAuth: true}
        },
        {
            path: '/:notFound(.*)', component: NotFound
        }
    ],
})

router.beforeEach(function (to, from, next) {
    if(to.meta.requiresAuth &&  !store.getters.isAuthenticated) {
        next('/auth');
    } else if(to.meta.requiresUnAuth && store.getters.isAuthenticated) {
        next('/coaches')
    } else {
        next();
    }
})

export default router;