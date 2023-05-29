import React from 'react'
import { Skeleton, SkeletonCircle, SkeletonText, Stack} from '@chakra-ui/react'
const ChatLoading = () => {
  return (
    <Stack style={{marginTop:"20px"}}>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
        <Skeleton height={'40px'}></Skeleton>
    </Stack>
  )
}

export default ChatLoading