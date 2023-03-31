import {React, useEffect, useState} from 'react'
import { ChatState } from '../Components/Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../Components/miscellaneous/SideDrawer'
import MyChats from '../Components/miscellaneous/MyChats'
import ChatBox from '../Components/miscellaneous/ChatBox'
import { useNavigate } from 'react-router-dom'
const ChatPage = () => {
  const { user, setUser } = ChatState()
  const navigate = useNavigate()
  const [fetchAgain, setFetchAgain] = useState(false)
  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo)
    if (!userInfo){
        navigate('/');
    }
    setFetchAgain(!fetchAgain) 
},[])
  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        display='flex'
        justifyContent='space-between'
        w='100%'
        h='91.5vh'
      >
        {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>

    </div>
  )
}

export default ChatPage