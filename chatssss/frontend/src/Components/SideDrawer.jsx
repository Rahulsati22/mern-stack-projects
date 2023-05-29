import React, { useEffect } from 'react'
import { Box, Tooltip, Button, Text, Flex, Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider, Avatar, Input, AvatarBadge, AvatarGroup, Wrap, WrapItem, Drawer, useToast, DrawerBody, DrawerFooter, DrawerOverlay, DrawerHeader, DrawerContent, DrawerCloseButton, useDisclosure, VStack, Spinner } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import ProfileModel from './ProfileModel'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnref = React.useRef();
    const user = useSelector((state) => state.userAdmin);
    const toast = useToast();
    const [searchResult, setSearchResult] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [userr, setUserr] = useState({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let chat = useSelector((state) => state.chat);
    let arr = chat.chatArr;
    const logoutUser = () => {
        localStorage.removeItem("userInfo");
        navigate('/');
    };

    useEffect(() => {
        setUserr(JSON.parse(localStorage.getItem("userInfo")));
    }, [])




    const getSender = (users, loggedUser) => {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    }
    const updateName = (e) => {
        setName(e.target.value);
    }
    const sendName = async () => {
        if (!name) {
            toast({
                title: "Empty Field",
                description: "Enter a name to search",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            })
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user/users?name=${name}`);
            setLoading(false);
            setSearchResult(data.users);
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            })
        }
    }
    const accessChat = async (id) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            const { data } = await axios.post('/api/chat', { userId: id }, config);
            if (arr && !arr.find((c) => c._id === data.isChat._id)) {
                dispatch({
                    type: "pushChat",
                    payload: data.isChat._id
                })
            }
            setLoadingChat(false);
            dispatch({
                type: "selectedChat",
                payload: data.isChat
            })
            setFetchAgain(!fetchAgain)
            onClose();

        } catch (error) {
            toast({
                title: error.response.data.message,
                description: "Not able to fetch the chat due to some reasons",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-left'
            })
        }
    }
    return (
        <>
            {userr._id && <><Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                bg={"white"}
                w="100%"
                p='5px 10px 5px 10px'
                borderWidth={'5px'}
                color={'black'}
            >
                <Tooltip hasArrow label="Search Users To Chat" bg="gray.200">
                    <Button variant={'ghost'} color='black' ref={btnref} onClick={onOpen}>
                        <i className='fa-solid fa-magnifying-glass' style={{ marginRight: "5px" }}></i>
                        <Text display={{ base: 'none', md: 'flex' }} px='4'>
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
                            alignItems={'center'}
                            rightIcon={<ChevronDownIcon />}
                            padding={'10px'}>
                            <Avatar
                                name={userr && userr.name}
                                src={userr && userr.avatar && userr.avatar.url}
                                size="sm"
                                marginLeft={'1'}
                            />
                        </MenuButton>
                        <MenuList bg={"white"}>
                            {user && userr && userr._id && <ProfileModel user={userr}>
                                <MenuItem bg="white" color="black">
                                    Profile
                                </MenuItem>
                            </ProfileModel>}
                            <MenuDivider />
                            <MenuItem color={'black'} bg={'white'} onClick={logoutUser}>
                                Logout
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

                <Drawer isOpen={isOpen} placement='left' onClose={onClose} finalFocusRef={btnref}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Search User</DrawerHeader>
                        <DrawerBody>
                            <Box display={'flex'}>
                                <Input placeholder='Type Here...' onChange={updateName} />
                                <Button onClick={sendName} marginLeft={'5px'} isLoading={loading}>
                                    Go
                                </Button>
                            </Box>

                            {loading ? <ChatLoading /> : (
                                searchResult.map((elem) => {
                                    return <Box
                                        key={user._id}
                                        display={'flex'}
                                        bg={'#E8E8E8'}
                                        color='black'
                                        _hover={{
                                            background: "green.100",
                                            color: "white"
                                        }}
                                        mb="8px"
                                        mt='8px'
                                        borderRadius={'15px'}
                                        w='100%'
                                        d='flex'
                                        alignItems={'center'}
                                        justifyContent={'space-around'}
                                        padding={'5px'}
                                        cursor='pointer'
                                        onClick={() => accessChat(elem._id)}
                                    >
                                        <Avatar src={elem.avatar.url} name={elem.name}></Avatar>
                                        <Box textAlign={'center'}>
                                            <Text fontSize={'1.5rem'} fontWeight={'200'}>
                                                {elem.name}
                                            </Text>
                                            <Text fontSize={'0.7rem'}>Email : {elem.email}</Text>
                                        </Box>
                                    </Box>
                                })
                            )}
                            {loadingChat && <Spinner ml='auto' d='flex' />}
                        </DrawerBody>
                        <DrawerFooter>
                            <Button variant={'outline'} mr={3} onClick={onClose}>
                                Cancel
                            </Button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </>
            }

        </>
    )
}

export default SideDrawer