import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../../config/axiosInstance";
import { useDispatch } from "react-redux";

export  const loginUser=createAsyncThunk("api/auth/login",async(credentials,thunkApi)=>{
    try {
        let res=await axiosInstance.post("/api/auth/login",credentials)
       // backend returns { message, user }
       return res.data.user
        
        
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }

})

export const registerUser = createAsyncThunk(
    "api/auth/register",
    async (payload, thunkApi) => {
        try {
            let res = await axiosInstance.post("/api/auth/register", payload);
            // backend sets cookies and returns { message, user }
            return res.data.user;
        } catch (error) {
            return thunkApi.rejectWithValue(error.response?.data || error);
        }
    }
);

export const currentUser=createAsyncThunk("api/auth/me",async(_,thunkApi)=>{
     try {
          let res=await axiosInstance.get("/api/auth/me")
         return res.data.data
        
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || error)
    }
})

