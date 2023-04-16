import {configureStore} from "@reduxjs/toolkit"
import { allUsersReducer, postOfFollowReducer, userPostsReducer, userProfileReducer, userReducer } from "./Reducers/User"
import {likeReducer, myPostReducer} from './Reducers/Post'

const store = configureStore({
    reducer : {
        user : userReducer,
        postOfFollowing : postOfFollowReducer,
        allUser : allUsersReducer,
        like : likeReducer,
        allPost : myPostReducer,
        userProfile : userProfileReducer,
        userPosts : userPostsReducer
    }
})

export default store 