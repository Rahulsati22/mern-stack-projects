import {createReducer} from '@reduxjs/toolkit';
import axios from 'axios'
const initialState = {};
export const userReducer = createReducer(initialState,{
    setUser : (state, action)=>{
        state.user = action.payload
    }
}) 