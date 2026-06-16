import { configureStore } from "@reduxjs/toolkit"
import authReducer from '../../features/auth/state/auth/authSlice.js'
import teamReducer from '../../features/dashboard/state/teamSlice.js'
import playerReducer from '../../features/dashboard/state/playerSlice.js'
import matchReducer from '../../features/dashboard/state/matchSlice.js'
import userReducer from '../../features/dashboard/state/userSlice.js'
import settingsReducer from '../../features/dashboard/state/settingsSlice.js'
import seriesReducer from '../../features/dashboard/state/seriesSlice.js'

let store = configureStore({
    reducer: {
       auth: authReducer,
       team: teamReducer,
       player: playerReducer,
       match: matchReducer,
       user: userReducer,
       settings: settingsReducer,
       series: seriesReducer
    }
})

export default store