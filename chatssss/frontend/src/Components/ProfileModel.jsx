import React from 'react'
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    IconButton,
    Image,
    Avatar,
    Box
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? <span onClick={onOpen} fontWeight="450" marginLeft={"-15px"}>{children}</span> : <IconButton d={{ base: "flex" }} icon={<ViewIcon color="black" />} onClick={onOpen} color={"black"} fontSize={"2xl"} />}
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
                height={"210px"}
            >
                <ModalOverlay />
                <ModalContent bg='white' display="flex" justifyContent={'center'} alignItems={'center'}>
                    <ModalHeader fontSize={'5xl'}>{user && (user.name).toUpperCase()}</ModalHeader>
                    <ModalBody>
                        <Box boxSize={'sm'} display={'flex'} justifyContent={'center'}>
                            {user && user.avatar ? <Image src={user.avatar.url} alt='Dan Abramov' borderRadius={'full'} /> : <Avatar src={user && user.avatar && user.avatar.url} name={user.name} size={'2xl'} />}
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>


    )
}
export default ProfileModel