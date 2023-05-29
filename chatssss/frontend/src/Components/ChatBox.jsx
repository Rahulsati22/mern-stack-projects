import React from 'react'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'
import { useSelector } from 'react-redux'
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = useSelector((state) => state.chat);
  return (
    <Box d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems={'center'}
      flexDir={'column'}
      p={3}
      bg='white'
      w={{ base: "100%", md: "68%" }}
      borderRadius={'large'}
      borderWidth={'1px'}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  )
}

export default ChatBox