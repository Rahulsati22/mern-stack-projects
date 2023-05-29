import React, { useEffect } from 'react'
import { useState } from 'react'
import GroupChatModel from './GroupChatModel'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import { Box, useToast, Text, Button, VStack, StackDivider, chakra, Avatar } from '@chakra-ui/react'
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
const MyChats = ({ fetchAgain, setFetchAgain }) => {
    const { allChats: chatt } = useSelector((state) => state.chat);
    const { selectedChat } = useSelector((state) => state.chat);
    const [chat, setChat] = useState({});
    const [loggedUser, setLoggedUser] = useState("");
    // const [selectedChat, setSelectedChat] = useState();
    const toast = useToast();
    const dispatch = useDispatch();
    const fetchChats = async () => {
        try {
            const { data } = await axios.get('/api/chat/fetchchats');
            console.log("I am in")
            dispatch({
                type: "allChats",
                payload: data.allChats
            })
            return;
        } catch (error) {
            toast({
                title: "Failed to load the chat",
                description: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            })
        }
    }



    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    }, []);

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain])



    const handleSelectedChat = (elem) => {
        dispatch({
            type: "selectedChat",
            payload: elem
        })
        setChat(elem);
 
    }

    const getSender = (users, loggedUser) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    return (
        <Box display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir={'column'}
            width={{ base: "100%", md: '30%' }}
            borderRadius={'large'}
            borderWidth={'1px'}
            bg={'gray.300'}
            color={'black'}>
            <Box display={'flex'} justifyContent={'space-between'} padding={'4px'} marginBottom={'10px'} fontFamily={'Work Sans'} alignItems={'center'}>
                <Text>My Chats</Text>
                <GroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}>
                    <Button><AddIcon mx={'4px'} />Group Chat</Button>
                </GroupChatModel>
            </Box>
            <Box
                display={'flex'} flexDir={'column'} overflowY={'hidden'} p={3} bg={'#F8F8F8'} h='100%' borderRadius={'large'} w={{ base: selectedChat ? 'none' : '100vw', md: '100%' }}>
                {
                    chatt ? (<VStack spacing={4} align={'stretch'} overflowY={'scroll'} height='100%' w='100%'>
                        {

                            chatt?.map((elem) => {
                                return <Box
                                    key={elem._id}
                                    onClick={() => handleSelectedChat(elem)}
                                    cursor={'pointer'}
                                    bg={selectedChat && elem._id === selectedChat._id ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat && elem._id === selectedChat._id ? "white" : "dark"}
                                    px={3}
                                    py={2}
                                    borderRadius={'20px'}
                                    w='100%'
                                >
                                    <Box
                                        display='flex'
                                        flexDir={'row'}
                                        w='100%'
                                        justifyContent={'space-between'}
                                        alignItems={'center'}>
                                        <span>
                                            {
                                                elem.isGroupChat === false ? (
                                                    <Avatar src={getSender(elem.user, loggedUser).avatar.url} name={getSender(elem.user, loggedUser).name} />
                                                ) : (
                                                    <Avatar name={elem.chatName} />
                                                )
                                            }
                                        </span>
                                        <Text>
                                            {
                                                elem.isGroupChat === false ? (
                                                    getSender(elem.user, loggedUser).name
                                                ) : (
                                                    elem.chatName
                                                )
                                            }
                                        </Text>
                                    </Box>

                                </Box>
                            })
                        }
                    </VStack>) : (<ChatLoading />)
                }
            </Box>
        </Box>
    )
}

export default MyChats