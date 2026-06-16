import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosInstance";

export const fetchSeries = createAsyncThunk(
  "series/fetchSeries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/series");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch series"
      );
    }
  }
);

const seriesSlice = createSlice({
  name: "series",
  initialState: {
    series: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSeries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.series = action.payload;
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default seriesSlice.reducer;
