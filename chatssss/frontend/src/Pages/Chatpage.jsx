import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../Components/SideDrawer'
import { useNavigate } from 'react-router-dom'
import ChatBox from '../Components/ChatBox'
import MyChats from '../Components/MyChats'
import Display from '../Components/Display'
const Chatpage = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [fetchAgain, setFetchAgain] = useState(false);
    const [myUser, setMyUser] = useState({});
    const { selectedChat } = useSelector((state) => state.chat);
    useEffect(() => {
        setFetchAgain(!fetchAgain);
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo) {
            navigate('/')
        }
        dispatch({
            type: "setUser",
            payload: userInfo
        })
        setMyUser(userInfo);
    }, [])


    return (
        <div style={{ width: "100%" }}>
            {myUser._id && <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            <Box display={'flex'} justifyContent={'space-between'} w='100%' h='91.5vh'>
                {myUser._id && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {myUser._id && selectedChat && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {myUser._id && !selectedChat && <Display />}
            </Box>
        </div>
    )
}

export default Chatpage