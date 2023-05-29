import { createReducer } from '@reduxjs/toolkit'
import axios from 'axios'
const initialState = { chatArr: [] };
export const chatReducer = createReducer(initialState, {
    pushChat: (state, action) => {
        state.chatArr.push(action.payload);
    },
    selectedChat: (state, action) => {
        state.selectedChat = action.payload;
    },
    allChats: (state, action) => {
        state.allChats = action.payload;
    },
    nullSelectedChat: (state, action) => {
        state.selectedChat = null;
    },
 
})