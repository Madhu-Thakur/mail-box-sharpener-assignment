import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  inboxMails: [],
  sentMails: [],
};

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    setInboxMails(state, action) {
      state.inboxMails = action.payload;
    },

    setSentMails(state, action) {
      state.sentMails = action.payload;
    },

    markAsRead(state, action) {
      const mail = state.inboxMails.find(
        (item) => item.id === action.payload
      );

      if (mail) {
        mail.read = true;
      }
    },

    deleteInboxMail(state, action) {
      state.inboxMails = state.inboxMails.filter(
        (mail) => mail.id !== action.payload
      );
    },

    deleteSentMail(state, action) {
      state.sentMails = state.sentMails.filter(
        (mail) => mail.id !== action.payload
      );
    },
  },
});

export const {
  setInboxMails,
  setSentMails,
  markAsRead,
  deleteInboxMail,
  deleteSentMail,
} = mailSlice.actions;

export default mailSlice.reducer;