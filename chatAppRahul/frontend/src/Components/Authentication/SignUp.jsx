import { React, useState } from 'react'
import {useNavigate} from 'react-router-dom'
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
const SignUp = () => {
  const [show, setShow] = useState(true)
  const [name, setName] = useState()
  const [email, setEmail] = useState()
  const [confirmPassword, setconfirmPassword] = useState()
  const [password, setPassword] = useState()
  const [pic, setPic] = useState()
  const [loading, setLoading] = useState(false)
  const history = useNavigate()
  const submitHandler = async () => {
    setLoading(true)
    if (!name || !password || !confirmPassword || !email){
      toast({
        title: 'please enter all the fields',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return;
    }
    if (password !== confirmPassword){
      toast({
        title: 'password and confirm password are not equal',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });

    }

    try{
      const config = {
        headers : {
          "content-type" : "application/json",
        }
      }

      const {data} = await axios.post("/api/user/registration", {name, email, password, pic}, config)
      toast({
        title : 'registration successfull',
        status : 'success',
        duration : '3000',
        isClosable: true
        });
        localStorage.setItem('userInfo', JSON.stringify(data))
        setLoading(false)
        history('/chat')
    }catch(error){
      
    }

  }
  const toast = useToast()
  const postDetail = (pics) => {
    setLoading(true)
    if (pics === undefined) {
      toast({
        title: 'Please select an image',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat_app_mern_stackl")
      data.append("cloud_name", "rahulsati")
      fetch("https://api.cloudinary.com/v1_1/rahulsati/image/upload", {
        method: "post",
        body: data
      }).then(dataNew => {
        setPic(dataNew.url.toString());
        console.log(dataNew.url.toString());
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        setLoading(false)
      })
    }
  }
  return (
    <VStack spacing={'5px'}>

      <FormControl isRequired color={'black'}>
        <FormLabel>Name</FormLabel>
        <Input type='text' onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl isRequired color={'black'}>
        <FormLabel>Email</FormLabel>
        <Input type='email' onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl isRequired color={'black'}>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input type={show ? 'password' : "text"} onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width={"4.5rem"} size="sm">
            <Button onClick={() => show ? setShow(false) : setShow(true)}>
              {show ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired color={'black'}>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input type={show ? 'password' : "text"} onChange={(e) => setconfirmPassword(e.target.value)} />
          <InputRightElement width={"4.5rem"} size="sm">
            <Button onClick={() => show ? setShow(false) : setShow(true)}>
              {show ? "Show" : "Hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic'>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input type={'file'}
          accept='/img/*'
          onChange={(e) => postDetail(e.target.files[0])}
        />
      </FormControl>
      <Button colorScheme='teal' size='md' w={'100%'} onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>

    </VStack>
  )
}

export default SignUp