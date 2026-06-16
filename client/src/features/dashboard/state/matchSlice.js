import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosInstance";

export const fetchMatches = createAsyncThunk(
  "match/fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/match");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch matches"
      );
    }
  }
);

export const createMatch = createAsyncThunk(
  "match/createMatch",
  async (matchData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/api/match", matchData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create match"
      );
    }
  }
);

const matchSlice = createSlice({
  name: "match",
  initialState: {
    matches: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createMatch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches.push(action.payload);
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default matchSlice.reducer;
