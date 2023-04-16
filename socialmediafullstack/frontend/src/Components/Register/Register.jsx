import React, { useEffect } from "react";
import { useState } from "react";
import { Typography, Avatar, Button } from "@mui/material";
import "./Register.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Actions/User";
import {useAlert} from 'react-alert'
const Register = () => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const dispatch = useDispatch();
  const alert = useAlert();
  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(registerUser(name, email, password, avatar)).then(()=>{
       window.location.reload();
    });
  };

  const {loading, error} = useSelector((state)=>state.user);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    // firstly using this function to read the file
    const Reader = new FileReader();
    // putting the file inside the read as data url function
    Reader.readAsDataURL(file);

    // function when the file will be load
    Reader.onload = (e) => {
      // when the file is completely uploaded
      if (Reader.readyState === 2) {
        setAvatar(Reader.result);
      }
    };
  };

  useEffect(()=>{
    if (error){
        alert.error(error);
        dispatch({type:"clearErrors"})
    }
  },[error, dispatch, alert])


  return (
    <div className="register">
      <form className="registerForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <Avatar
          src={avatar}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Name"
          required
          className="registerInputs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="registerInputs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="registerInputs"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/">Already Signed Up? Login Now</Link>
        <Button disabled={loading} type="submit">Register</Button>
      </form>
    </div>
  );
};

export default Register;
