import {
  Box,
  Tooltip,
  Button,
  Text,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Avatar,
  Input,
  AvatarBadge,
  AvatarGroup,
  Wrap,
  WrapItem,
  Drawer,
  useToast,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import ProfileModel from "./ProfileModel";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading";
import axios from "axios";
const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    loggedUser,
    setLoggedUser,
    notification,
    setNotification,
  } = ChatState();
  const toast = useToast();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [name, setName] = useState("");

  const updateName = (e) => {
    setName(e.target.value);
    console.log(name);
  };
  const sendName = async () => {
    if (!name) {
      toast({
        title: "Empty field",
        description: "Enter a name to search",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/users?search=${name}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {}
  };
  const getSender = (users, loggedUser) => {
    return users[0]._id == loggedUser._id ? users[1].name : users[0].name;
  };
  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const accessChat = async (id) => {
    try {
      console.log("my id is", id);
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId: id }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(data);
      setLoadingChat(false);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: "Not able to initialize the chat with the user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        color="black"
      >
        <Tooltip hasArrow label="Search Users to Chat" bg="gray.200">
          <Button variant="ghost" color="black" ref={btnRef} onClick={onOpen}>
            <i
              class="fa-solid fa-magnifying-glass"
              style={{ marginRight: "5px" }}
            ></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"3xl"} fontFamily={"Work Sans"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton
              as={Button}
              alignItems="center"
              rightIcon={<ChevronDownIcon />}
              padding="10px"
            >
              <Avatar
                name={user.name}
                src={user.pic}
                size={"sm"}
                marginLeft={"1"}
              />
            </MenuButton>
            <MenuList bg={"white"} color="black">
              <ProfileModel user={user}>
                <MenuItem bg={"white"} color={"black"}>
                  Profile
                </MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem color={"black"} bg={"white"} onClick={logoutUser}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} mb={"5px"}>
              <Input placeholder="Type here..." onChange={updateName} />
              <Button onClick={sendName} marginLeft={"4px"} isLoading={loading}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <Box
                  key={user._id}
                  display="flex"
                  bg={"#E8E8E8"}
                  color={"black"}
                  _hover={{
                    background: "green.100",
                    color: "white",
                  }}
                  mb={"8px"}
                  borderRadius={"15px"}
                  w="100%"
                  d="flex"
                  alignItems={"center"}
                  justifyContent={"space-around"}
                  padding={"5px"}
                  cursor={"pointer"}
                  onClick={() => accessChat(user._id)}
                >
                  <Avatar src={user.pic} name={user.name}></Avatar>
                  <Box textAlign={"center"}>
                    <Text fontSize={"1.5rem"} fontWeight={"200"}>
                      {user.name}
                    </Text>
                    <Text fontSize={"0.7rem"}>Email : {user.email}</Text>
                  </Box>
                </Box>
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
