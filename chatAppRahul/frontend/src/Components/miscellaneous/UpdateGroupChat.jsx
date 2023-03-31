import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    Box,
    Spinner
} from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../Context/ChatProvider';
import { FormControl, Input, Avatar, Text } from '@chakra-ui/react';
import UserBadge from './UserBadge';
import axios from 'axios'
const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [renameLoading, setRenameLoading] = useState(false);
    // const [searchLoading, setSearchLoading] = useState(false)
    const toast = useToast();
    const handleRemove = async (delUser) => {
        if (selectedChat.groupAdmin._id !== user._id && user._id != delUser._id) {
            toast({
                title: "only admin can add or remove",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/groupremove', { chatId: selectedChat._id, userId: delUser._id }, config)
            delUser._id == user._id ? setSelectedChat() : setSelectedChat(data);
            setLoading(false);
            setFetchAgain(!fetchAgain)
            fetchMessage();
        } catch (error) {

        }
    }
    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => user1._id === u._id)) {
            toast({
                title: "User already exists",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "only admin can add or remove",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chat/groupadd', {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "cannot add user to group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }

    }
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.put('/api/chat/rename', { chatId: selectedChat._id, chatName: groupChatName }, config);
            setSelectedChat(data);
            setRenameLoading(false);
            setFetchAgain(!fetchAgain);

        } catch (error) {
            toast({
                title: "Error occurred",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameLoading(false);
        }
    }
    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers: {
                    authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/user/users?search=${search}`, config);
            setLoading(false)
            setSearchResult(data);
            return;
        } catch (error) {
            toast({
                title: "Error occurred",
                description: "Failed to load the search results",
                status: "error",
                duration: 500,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader alignSelf={"center"} fontSize={"2rem"}>{selectedChat.chatName.toUpperCase()}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={"flex"} flexWrap={"wrap"} >
                            {
                                selectedChat.users.map((u) => {
                                    return (<UserBadge key={u._id} person={u} handleFunction={() => handleRemove(u)} />)
                                })
                            }
                        </Box>
                        <FormControl display="flex">
                            <Input placeholder='chatName'
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button variant="solid" colorScheme={"teal"} ml={1} isLoading={renameLoading} onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add User to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (<Spinner size={"lg"} ml={"50%"} mt={"20px"} />) : (
                            searchResult?.map(user => {
                                return (<Box key={user._id} display="flex" bg={"#E8E8E8"} color={'black'}
                                    _hover={{
                                        background: "green.100",
                                        color: "white"
                                    }}
                                    onClick={() => handleAddUser(user)}
                                    mt={'8px'}
                                    mb={'8px'}
                                    borderRadius={'15px'}
                                    w="100%"
                                    d="flex"
                                    alignItems={"center"}
                                    justifyContent={"space-around"}
                                    padding={"5px"}
                                    cursor={'pointer'}
                                >
                                    <Avatar src={user.pic} name={user.name}></Avatar>
                                    <Box textAlign={"center"}>
                                        <Text fontSize={'1.5rem'} fontWeight={'200'}>
                                            {user.name}
                                        </Text>
                                        <Text fontSize={'0.7rem'}>Email : {user.email}</Text>
                                    </Box>
                                </Box>)
                            })
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme="red">
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChat