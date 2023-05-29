import React, { useEffect, useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, FormControl, ModalBody, ModalCloseButton, Button, useDisclosure, Avatar, Spinner, useToast, Input, Box, Text } from '@chakra-ui/react'
import axios from 'axios'
import UserBadge from './UserBadge'
import { useSelector } from 'react-redux'
import { color } from 'framer-motion'
const GroupChatModel = ({ children, fetchAgain, setFetchAgain }) => {
    const { isOpen, onOpen, onClose } = useDisclosure('');
    const [groupChatName, setGroupChatName] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const toast = useToast();
    const { user } = useSelector((state) => state.userAdmin);
    const { allChats } = useSelector((state) => state.chat);
    const handleSearch = async (query) => {
        try {
            setSearch(query);
            const { data } = await axios.get(`/api/user/users?name=${search}`);
            setSearchLoading(false);
            setSearchResult(data.users);
            return;
        } catch (error) {
            toast({
                title: 'Error Occurred',
                description: 'Failed to load the search results',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUser || selectedUser.length < 2) {
            toast({
                title: "Please fill all the fields and select more than 2 users",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            })
            return;
        }
        try {
            const { data } = await axios.post('/api/chat/group', { users: JSON.stringify(selectedUser.map((u) => u._id)), chatName: groupChatName })
            setFetchAgain(!fetchAgain)
            onClose();
            toast({
                title: "new group chat created",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        } catch (error) {
            toast({
                title: "error in creating group chat",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'bottom'
            })
        }
    }
    const handleGroup = (userToAdd) => {
        if (selectedUser.includes(userToAdd)) {
            return;
        }
        else {
            setSelectedUser([...selectedUser, userToAdd]);
            return;
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUser(selectedUser.filter((elem) => elem._id !== delUser._id))
        return;
    }
    return (
        <>
            <span onClick={onOpen}>
                {children}
            </span>

            <Modal isOpen={isOpen} onClose={onClose} overflow='scroll' color='black'>
                <ModalOverlay />
                <ModalContent height={'80vh'} overflowY={'scroll'}>
                    <ModalHeader fontSize={'35px'} display={'flex'} justifyContent={'center'}>
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}>
                        <FormControl>
                            <Input placeholder='Chat Name' color={'black'} my='20px' onChange={(e) => setGroupChatName(e.target.value)} />
                        </FormControl>


                        <FormControl>
                            <Input placeholder='Add Users e.g. Rahul, Ayush, Akshay' color={'black'} my='20px' onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>

                        <Box
                            width={'100%'}
                            display={'flex'}
                            flexWrap={'wrap'}>
                            {
                                selectedUser.map(
                                    (u) => {
                                        return <UserBadge key={u._id} person={u} handleFunction={() => handleDelete(u)} />
                                    }
                                )
                            }
                        </Box>

                        {
                            searchLoading ? (<div>Loading....</div>) : (
                                searchResult.map((user) => {
                                    return (
                                        <Box
                                            key={user._id}
                                            display={'flex'}
                                            bg={'#E8E8E8'}
                                            color={'black'}
                                            _hover={{
                                                background: 'green.100',
                                                color: 'white'
                                            }}
                                            onClick={() => handleGroup(user)}
                                            mt='8px'
                                            mb='8px'
                                            borderRadius={'15px'}
                                            w='100%'
                                            d='flex'
                                            alignItems='center'
                                            justifyContent={'space-around'}
                                            padding={'5px'}
                                            cursor={'pointer'}
                                        >
                                            <Avatar src={user.avatar.url} name={user.name} />
                                            <Box>
                                                <Text fontSize={'1.5rem'} fontWeight={'200'}>
                                                    {user.name}
                                                </Text>
                                                <Text fontSize={'0.7rem'}>
                                                    Email : {user.email}
                                                </Text>
                                            </Box>
                                        </Box>
                                    )
                                })
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleSubmit} colorScheme='red'>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModel