import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setMails(state, action) {
      state.mails = action.payload;
    },

    markAsRead(state, action) {
      const mail = state.mails.find(
        (item) => item.id === action.payload
      );

      if (mail) {
        mail.read = true;
      }
    },
  },
});

export const { setMails, markAsRead } = mailSlice.actions;

export default mailSlice.reducer;