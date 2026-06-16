import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  supportEmail: "support@cricketmanager.pro",
  supportPhone: "+1 (800) 123-4567",
  operatingHours: "Monday - Friday, 9:00 AM to 6:00 PM EST",
  faqLink: "https://docs.cricketmanager.pro/faq"
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSupportInfo: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { updateSupportInfo } = settingsSlice.actions;
export default settingsSlice.reducer;
