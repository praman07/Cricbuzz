
import { createSlice } from '@reduxjs/toolkit'
import { currentUser, loginUser } from './authAction';
let authSlice=createSlice({
name:'auth',
initialState:{
    employee:null,
    isLoading:false
    
},
reducers:{
    addUser:(state,action)=>{
        state.employee=action.payload;
        state.isLoading=false

    },
    removeUser:(state)=>{
        state.employee=null;
        state.isLoading=false
    }
    
},
extraReducers:(builder)=>{
builder.addCase(loginUser.pending,(state)=>{
    state.isLoading=true
}).addCase(loginUser.fulfilled,(state,action)=>{
    state.employee=action.payload
    state.isLoading=false
}).addCase(loginUser.rejected,(state)=>{
    state.isLoading=false
}).addCase(currentUser.pending,(state)=>{
    state.isLoading=true
}).addCase(currentUser.fulfilled,(state,action)=>{
    state.employee=action.payload
    state.isLoading=false
}).addCase(currentUser.rejected,(state)=>{
    state.isLoading=false
})
}

})


export const { addUser, removeUser } = authSlice.actions
export default authSlice.reducer