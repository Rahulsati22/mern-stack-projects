import React, { useState, useEffect } from 'react'
import { Modal, ModalOverlay, ModalHeader, ModalContent, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, useToast, Box, Spinner } from '@chakra-ui/react'
import { IconButton } from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { FormControl, Input, Avatar, Text } from '@chakra-ui/react'
import UserBadge from './UserBadge'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const { selectedChat } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.userAdmin);
    const [renameLoading, setRenameLoading] = useState(false);
    const toast = useToast();
    const dispatch = useDispatch();

    // this function will remove the user from the group
    const handleRemove = async (delUser) => {
        if (selectedChat.groupAdmin._id !== user._id && user._id !== delUser._id) {
            toast({
                title: "Only admins can add or remove",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }
        try {
            setLoading(true);
            const { data } = await axios.put('/api/chat/delete', { chatId: selectedChat._id, userId: delUser._id })
            delUser._id === user._id ? dispatch({
                type: "selectedChat",
                payload: {}
            }) : dispatch({
                type: "selectedChat",
                payload: data.deleted
            })
            setLoading(false);
            setFetchAgain(!fetchAgain);
            fetchMessages();

        } catch (error) {
            toast({
                title: "Not able to delete the user",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        }
    };


    // this function will add the user to the group
    const handleAddUser = async (user1) => {
        if (selectedChat.user.find((u) => user1._id === u._id)) {
            toast({
                title: "User already exists",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: 'bottom'
            })
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admin can add or remove",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.put('/api/chat/add', { chatId: selectedChat._id, userId: user1._id });
            dispatch({
                type: "selectedChat",
                payload: data.chat
            })
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "User cannot add to the group",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setLoading(false);
        }

    };

    // this function will help us to rename the group
    const handleRename = async () => {
        if (!groupChatName) {
            return;
        }
        try {
            setRenameLoading(true);
            const { data } = await axios.put('/api/chat/rename', { chatId: selectedChat._id, chatName: groupChatName })
            dispatch({
                type: "selectedChat",
                payload: data.updateChat
            })
            setRenameLoading(false);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast({
                title: "Error occurred in renaming the group",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
            setRenameLoading(false);
        }
    };

    // this function will help us to search the user we want to add to our group
    const handleSearch = async (query) => {
        if (!query) {
            return;
        }
        setSearch(query);
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/user/users?name=${search}`);
            setLoading(false);
            setSearchResult(data.users);
            return;
        } catch (error) {
            toast({
                title: "Not able to fetch the users",
                status: 'warning',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    };

    return (
        <>
            <IconButton display={{ base: 'flex' }} flexWrap={'wrap'} onClick={onOpen} icon={<ViewIcon />} />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader alignSelf={"center"} fontSize={'2rem'} >
                        {selectedChat && selectedChat.chatName.toUpperCase()}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={"flex"} flexWrap={'wrap'}>
                            {
                                selectedChat && selectedChat.user.map((elem) => {
                                    return <UserBadge key={elem._id} person={elem} handleFunction={() => handleRemove(elem)} />
                                })
                            }
                        </Box>
                        <FormControl mb={3}>
                            <Input placeholder='Chat Name' mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                            <Button variant={'solid'} colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input placeholder='Add User to Group' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        {
                            loading ? (<Spinner size={'large'} ml={'50%'} mt={'20px'} />) : (
                                searchResult?.map(user => {
                                    return (<Box key={user._id} display={'flex'} bg={'#E8E8E8'} color={'black'} _hover={{
                                        background: "green.100",
                                        color: "white"
                                    }}
                                        onClick={() => handleAddUser(user)}
                                        mt='8px'
                                        mb='8px'
                                        borderRadius='15px'
                                        w='100%'
                                        d='flex'
                                        alignItems={'center'}
                                        justifyContent={'space-around'}
                                        padding={'5px'}
                                        cursor={'pointer'}
                                    >
                                        <Avatar src={user.pic} name={user.name} />
                                        <Box textAlign={'center'}>
                                            <Text fontSize={'1.5rem'} fontWeight={'200'}>
                                                {user.name}
                                            </Text>
                                            <Text fontSize={'0.7rem'}>
                                                Email : {user.email}
                                            </Text>
                                        </Box>
                                    </Box>)
                                })
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} colorScheme='red'>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChat