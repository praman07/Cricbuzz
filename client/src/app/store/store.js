import { configureStore} from "@reduxjs/toolkit"
import authReducer from '../../features/auth/state/auth/authSlice.js'
 let store=configureStore({
    reducer:{
       auth: authReducer
    }
})

export default store