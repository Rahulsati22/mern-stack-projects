import React from 'react'
import { Box } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
const UserBadge = ({ person, handleFunction }) => {
    return (
        <Box
            px={2}
            py={2}
            borderRadius="20px"
            marginTop={"15px"}
            marginRight={"10px"}
            marginBottom={2}
            variant="solid"
            fontSize={12}
            color={'white'}
            cursor={'pointer'}
            onClick={handleFunction}
            backgroundColor="purple"
        >
            <span>{person.name}</span>
            <CloseIcon pl={1} />
        </Box>
    )
}

export default UserBadge