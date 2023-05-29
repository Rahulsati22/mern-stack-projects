import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, TabList, TabPanels, TabPanel, Tab } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import Login from '../Components/Login'
import Signup from '../Components/Signup'
const Homepage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        if (user) {
            navigate('/chat');
        }
    }, [navigate])
    return (
        <Container maxWidth={'xl'} centerContent marginTop={'40px'}>
            <Box
                d='flex'
                justifyContent={'center'}
                p={3}
                bg="white"
                w="100%"
                textAlign={"center"}
                borderRadius={"lg"}
                borderWidth={"1px"}
                marginBottom={"10px"}
            >
                <Text color="black" fontSize={"2rem"} fontWeight={"500"}>
                    Rahul's Chat App
                </Text>
            </Box>
            <Box background={"white"}
                w="100%"
                padding={4}
                borderRadius={"lg"}
                borderWidth={"1px"}
                color="black">
                <Tabs>
                    <TabList>
                        <Tab w="50%">
                            Login
                        </Tab>
                        <Tab w="50%">
                            Sign Up
                        </Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <Signup />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Container>
    )
}

export default Homepage