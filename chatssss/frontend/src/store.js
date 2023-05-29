import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './Reducers/userReducer';
import { chatReducer } from './Reducers/chatReducer';
import { notificationReducer } from './Reducers/notificationReducer';
const Store = configureStore({
    reducer: {
        userAdmin: userReducer,
        chat : chatReducer,
        notify : notificationReducer
    }
})
export default Store;