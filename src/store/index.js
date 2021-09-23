import { createStore } from "vuex";

import coachesModule from './modules/coaches/index'
import requestModules from './modules/requests/index'
import authModules from './modules/auth/index'

const store = createStore({
    modules: {
        coaches: coachesModule,
        req: requestModules,
        auth: authModules
    },
    state() {
        return {
        }
    },
})

export default store;