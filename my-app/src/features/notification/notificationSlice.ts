import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type NotificationType = "info" | "success" | "error";

interface NotificationState {
  message: string | null;
  type: NotificationType;
  visible: boolean;
}

const initialState: NotificationState = {
  message: null,
  type: "info",
  visible: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{ message: string; type?: NotificationType }>,
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type ?? "info";
      state.visible = true;
    },
    hideNotification: (state) => {
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
