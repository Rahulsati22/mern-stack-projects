import React, { useState } from 'react'
import { Box, IconButton, Spinner, Text, useToast } from '@chakra-ui/react'
import ScrollableChat from './ScrollableChat'
import { ArrowBackIcon } from '@chakra-ui/icons'
import ProfileModel from './ProfileModel'
import UpdateGroupChat from './UpdateGroupChat'
import { useEffect } from 'react'
import { FormControl, Input } from '@chakra-ui/react'
import axios from 'axios'
import animationData from './typing.json'
import Lottie from 'react-lottie'
import './styles.css'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
const ENDPOINT = 'http://localhost:8000';
var socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    let defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [val, setVal] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false);
    const { selectedChat } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.userAdmin);
    const dispatch = useDispatch()
    const toast = useToast();
     


    useEffect(() => {
        socket = io(ENDPOINT)
        if (user)
            socket.emit('setup', user);
        socket.on('connected', () => {
            setSocketConnected(true);
        })

        socket.on('typing', () => setIsTyping(true));
        socket.on('stop typing', () => setIsTyping(false));
    }, [])


    useEffect(() => {
        fetchMessages();
        if (messages) {
            setMessages(messages);
        }
        console.log(selectedChat);
        
    }, [selectedChat, dispatch])

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
                if (selectedChat._id === newMessageReceived.chat._id){
                setMessages([...messages, newMessageReceived]);
                setFetchAgain(!fetchAgain);
                }
        })
    })




    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit('stop typing', getSender(selectedChat.user, user)._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                const { data } = await axios.post('/api/message/', {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config)
                setNewMessage("");
                socket.emit('new message', data.message)
                setMessages([...messages, data.message]);
                setFetchAgain(!fetchAgain)
            } catch (error) {
                toast({
                    title: "Not able to send the chat",
                    status: 'error',
                    duration: 3000,
                    position: 'bottom-left',
                    isClosable: true
                })
            }
        }
    }
    const typingHandler = async (e) => {
        if (!socketConnected) {
            return;
        }

        if (!typing) {
            setTyping(true);
            socket.emit('typing', getSender(selectedChat.user, user)._id)
        }
        // Typing indicator logic
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;

        setTimeout(() => {
            var currTime = new Date().getTime();

            var timeLen = currTime - lastTypingTime;

            if (timeLen >= timerLength && typing) {
                socket.emit('stop typing', getSender(selectedChat.user, user)._id);
                setTyping(false);
            }
        }, timerLength)
        setNewMessage(e.target.value);
    }
    const handleClick = () => {
        dispatch(
            {
                type: "selectedChat",
                payload: null
            }
        )
        setVal(true);
    }
    const getSender = (users, loggedUser) => {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }
    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }
        try {
            setVal(false);
            setLoading(true);
            const { data } = await axios.get(`/api/message/allmessage/${selectedChat._id}`);
            setMessages(data.messages);
            console.log(data.messages, "I am messages from");
            setLoading(false);
            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            toast({
                title: "Not able to fetch the chats",
                duration: 3000,
                status: 'error',
                isClosable: true,
                position: 'bottom-left'
            })
            setLoading(false);
        }
    }



    return (
        <>
            <Text
                fontSize={{ base: "28px", md: '30px' }}
                pb={3}
                px={2}
                w='100%'
                color='black'
                fontFamily={'Work Sans'}
                display={'flex'}
                justifyContent={{ base: 'space-between' }}
                alignItems={'center'}
                backgroundColor={'gray'}
                padding={'15px'}
                borderRadius={'20px'}>
                <IconButton padding={'10px'} borderRadius={'10px'} bgColor={'gray'} mx={'10px'}
                    cursor={'pointer'}
                    icon={<ArrowBackIcon />}
                    onClick={handleClick}
                />
                {
                    selectedChat && selectedChat.isGroupChat ? (
                        <></>
                    ) : (
                        <span>
                            {user && selectedChat && selectedChat.user && getSender(selectedChat.user, user).name.toUpperCase()}
                        </span>
                    )
                }
                {
                    selectedChat && selectedChat.isGroupChat && (
                        <UpdateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                    )
                }
            </Text>

            {
                loading ?
                    (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', width: '55vw' }}>
                            <Spinner size={'xl'} />
                        </div>

                    ) :
                    (
                        <div className='messages' style={{ 'height': isTyping ? '64vh' : '70vh' }}>
                            <ScrollableChat messages={messages} />
                        </div>
                    )
            }

            <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                {isTyping ? <div><Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} /></div> : <></>}
                <Input type='text' isRequired variant={'filled'} bg='#E0E0E0' placeholder='Enter a message' onChange={typingHandler} value={newMessage} />
            </FormControl>
        </>
    )
}
export default SingleChat
