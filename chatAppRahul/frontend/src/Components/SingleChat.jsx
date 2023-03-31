import React, { useEffect } from "react";
import { ChatState } from "./Context/ChatProvider";
import { Box, IconButton, Spinner, Text, useToast } from "@chakra-ui/react";
import ScrollableChat from "./miscellaneous/ScrollableChat";
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChat from "./miscellaneous/UpdateGroupChat";
import { useState } from "react";
import { FormControl, Input } from "@chakra-ui/react";
import axios from "axios";
import io from "socket.io-client";
const EndPoint = "http://localhost:8000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const toast = useToast();
  const getSender = (users, loggedUser) => {
    return users[0]._id == loggedUser._id ? users[1] : users[0];
  };
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    socket = io(EndPoint);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message/",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        setNewMessage("");
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
         if (!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
          console.log(notification)
         }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // Typing Indicator Logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timeLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timeLength);
  };

  const fetchMessage = async () => {
    if (selectedChat) {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    }
  };

  useEffect(() => {
    if (selectedChat) fetchMessage();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            color={"black"}
            fontFamily={"Work sans"}
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
            backgroundColor={"gray"}
            padding={"15px"}
            borderRadius={"20px"}
          >
            <IconButton
              padding={"10px"}
              borderRadius={"10px"}
              bgColor={"gray"}
              mx={"10px"}
              cursor={"pointer"}
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {selectedChat.isGroupChat ? (
              <span>{selectedChat.chatName.toUpperCase()}</span>
            ) : (
              <>
                <span>
                  {getSender(selectedChat.users, user).name.toUpperCase()}
                </span>
              </>
            )}
            {!selectedChat.isGroupChat && (
              <ProfileModel user={getSender(selectedChat.users, user)} />
            )}
            {selectedChat.isGroupChat && (
              <UpdateGroupChat
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessage={fetchMessage}
              />
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="75vh"
            borderRadius={"20px"}
            overflowY="hidden"
            marginTop={"10px"}
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf={"center"}
                margin="auto"
              />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div
                  style={{
                    display: "inline-block",
                    color: "black",
                    margin: "15px",
                    padding: "10px",
                    backgroundColor: "#D3D3D3",
                    borderRadius: "10px",
                  }}
                >
                  typing...
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                backgroundColor="#E0E0E0"
                color={"black"}
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          justifyContent="center"
          alignItems={"center"}
          h="100%"
        >
          <Text fontSize="3xl" color={"black"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
