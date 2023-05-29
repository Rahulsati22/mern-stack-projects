import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
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
const Login = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const submitHandler = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      }
      const { data } = await axios.post('/api/user/login', { email, password }, config);
      toast({
        title: "User LoggedIn Successfully",
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      setLoading(false);
      navigate('/chat')
    } catch (error) {
      toast({
        title: error.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setLoading(false);
    }

  }
  return (
    <VStack spacing={'5px'}>
      <FormControl isRequired color={'black'}>
        <FormLabel>Email</FormLabel>
        <Input type='email' onChange={(e) => setEmail(e.target.value)} />
      </FormControl>


      <FormControl isRequired color={'black'}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show ? 'password' : 'text'} onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width={"4.5rem"} size="sm">
            <Button onClick={() => show ? setShow(false) : setShow(true)}>
              {show ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button colorScheme='teal' size='md' w='100%' onClick={submitHandler} isLoading={loading}>Sign In</Button>
    </VStack>
  )
}

export default Login