import { createReducer } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {};
export const userReducer = createReducer(initialState, {
  LoginRequest: (state) => {
    state.loading = true;
  },

  LoginSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAutheticated = true;
  },

  LoginFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAutheticated = false;
  },

  RegisterRequest: (state) => {
    state.loading = true;
  },

  RegisterSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAutheticated = true;
  },

  RegisterFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  },

  LoadUserRequest: (state) => {
    state.loading = true;
  },

  LoadUserSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.isAuthenticated = true;
  },

  LoadUserFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
    state.isAuthenticated = false;
  },

  LogoutUserRequest: (state) => {
    state.loading = true;
  },

  LogoutUserSuccess: (state) => {
    state.loading = false;
    state.user = null;
    state.isAuthenticated = false;
  },

  LogoutUserFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
    state.loading = false;
  },
});

export const postOfFollowReducer = createReducer(initialState, {
  postOfFollowingRequest: (state) => {
    state.loading = true;
  },

  postOfFollowingSuccess: (state, action) => {
    state.loading = false;
    state.posts = action.payload;
  },

  postOfFollowingFailure: (state, action) => {
    state.loading = true;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});

export const allUsersReducer = createReducer(initialState, {
  allUsersRequest: (state) => {
    state.loading = true;
  },
  allUsersSuccess: (state, action) => {
    state.loading = false;
    state.users = action.payload;
  },
  allUsersFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});

export const userPostsReducer = createReducer(initialState, {
  userPostsRequest: (state) => {
    state.loading = true;
  },

  userPostsSuccess: (state, action) => {
    state.loading = false;
    state.posts = action.payload;
  },
  userPostsFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});

export const userProfileReducer = createReducer(initialState, {
  userProfileRequest: (state) => {
    state.loading = true;
  },

  userProfileSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
  },

  userProfileFailure: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },

  clearErrors : (state)=>{
    state.error = null;
  }
});
