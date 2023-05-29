import { createReducer } from '@reduxjs/toolkit'
const initialState = {};
export const notificationReducer = createReducer(initialState, {
    updateNotification: (state, action) => {
        state.noti = action.payload;
    },
})