import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import React from 'react'
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [user, setUser] = useState('')
  const [selectedChat, setSelectedChat] = useState('');
  const [chats, setChats] = useState([]);
  const [loggedUser, setLoggedUser] = useState('')
  const [notification, setNotification] = useState([])
  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, loggedUser, setLoggedUser, notification, setNotification }}>
      {children}
    </ChatContext.Provider>
  )
}
export const ChatState = () => {
  return useContext(ChatContext)
}

export default ChatProvider