import React, { useEffect } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { useState } from 'react';
import axios from 'axios'
import ChatLoading from './ChatLoading';
import { Box, useToast, Text, Button, VStack, StackDivider, chakra } from '@chakra-ui/react';
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';
import GroupChatModel from './GroupChatModel';
const MyChats = ({fetchAgain, setFetchAgain}) => {
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats, loggedUser, setLoggedUser } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const congif = {
        headers: {
          authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get('/api/chat/fetchChats', congif);
      setChats(data);
      return;
    } catch (error) {
      toast({
        title: 'Failed to load the chat',
        description: "Enter a name to search",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-left'
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain])

  const getSender = (users, loggedUser) => {
    return users[0]._id == loggedUser._id ? users[1].name : users[0].name;
  }
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      width={{ base: "100%", md: "30%" }}
      borderRadius={"large"}
      borderWidth={"1px"}
      bg={'gray.300'}
      color={'black'}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        padding={"4px"}
        marginBottom={"10px"}
        fontFamily={"Work Sans"}
        alignItems={"center"}
      >
        <Text fontSize={'2rem'}>My Chats</Text>
        {/* this is the button to add group chats */}
        <GroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
          <Button><AddIcon mx={'4px'} />Group Chat</Button>
        </GroupChatModel>
      </Box>
      <Box display={"flex"}
        flexDir={'column'}
        overflowY={'hidden'}
        p={3}
        bg={'#F8F8F8'}
        w={'100%'}
        h={'100%'}
        borderRadius={'large'}
      >
        {chats ? (<VStack
          spacing={4}
          align='stretch'
          overflowY={'scroll'}
          height={'100%'}
        >
          {chats?.map((chat) => (
            <Box
              onClick={() => setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat == chat ? "#38B2AC" : "#E8E8E8"}
              color={selectedChat == chat ? "white" : "dark"}
              px={3}
              py={2}
              borderRadius={'20px'}
              key={chat._id}
            >
              <Text>
                {chat.isGroupChat === false ? (
                  getSender(chat.users, loggedUser)
                ) : (
                  chat.chatName
                )}
              </Text>
            </Box>
          ))}
        </VStack>) : (<ChatLoading />)}
      </Box>
    </Box>

  )
}

export default MyChats