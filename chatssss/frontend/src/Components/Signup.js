import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import {
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    useToast
} from '@chakra-ui/react'
const Signup = () => {
    const [show1, setShow1] = useState(true);
    const [show2, setShow2] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();
    const submitHandler = async () => {
        setLoading(true);
        if (!name || !password || !confirmPassword || !email || !pic) {
            toast({
                title: 'please enter all the fields',
                status: 'warning',
                duration: 3000,
                isClosable: true
            })
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: 'passwords should be equal',
                status: 'warning',
                duration: 3000,
                isClosable: true
            })
        }

        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const { data } = await axios.post('/api/user/register', { name, email, password, pic }, config)
             toast({
                title: "Registered Successfully",
                status: 'success',
                duration: 3000,
                isClosable: true
            })
            localStorage.setItem('userInfo', JSON.stringify(data.user));
            setLoading(false);
            navigate('/chat')
        } catch (error) {
            toast({
                title: error.response.data.message,
                status: 'warning',
                duration: 3000,
                isClosable: true
            })
            setLoading(false)
        }
    }
    const handleImageChange = (e)=>{
        const file = e.target.files[0];
        const Reader = new FileReader();
        Reader.readAsDataURL(file);
        Reader.onload = (e)=>{
            if (Reader.readyState === 2){
                setPic(Reader.result);
             }
        }
    }
    return (
        <VStack spacing={'5px'}>
            <FormControl isRequired color='black'>
                <FormLabel>Name</FormLabel>
                <Input type='text' onChange={(e) => setName(e.target.value)} />
            </FormControl>


            <FormControl isRequired color='black'>
                <FormLabel>Email</FormLabel>
                <Input type='text' onChange={(e) => setEmail(e.target.value)} />
            </FormControl>


            <FormControl isRequired color='black'>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show1 ? 'password' : 'text'} onChange={(e) => setPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"} size="sm">
                        <Button onClick={() => show1 ? setShow1(false) : setShow1(true)}>
                            {show1 ? "Show" : "Hide"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <FormControl isRequired color='black'>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={show2 ? 'password' : 'text'} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <InputRightElement width={"4.5rem"} size="sm">
                        <Button onClick={() => show2 ? setShow2(false) : setShow2(true)}>
                            {show2 ? "Show" : "Hide"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>


            <FormControl isRequired color='black'>
                <FormLabel>Upload Your Picture</FormLabel>
                <Input type='file' accept='image/*' onChange={handleImageChange}/>
            </FormControl>

            <Button colorScheme='teal' size='md' w="100%" onClick={submitHandler} isLoading={loading}>Sign Up</Button>
        </VStack>
    )
}

export default Signup