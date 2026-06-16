import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosInstance";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, thunkApi) => {
    try {
      let res = await axiosInstance.get("/api/users");
      return res.data.users;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response?.data || error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
