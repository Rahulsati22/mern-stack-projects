import React, { useEffect } from "react";
import { useState } from "react";
import { Typography, Avatar, Button } from "@mui/material";
import "./UpdateProfile.css";
import { Await, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoadUser, updateProfile, updateUser } from "../../Actions/User";
import { useAlert } from "react-alert";
import Loader from "../Loader/Loader";
const UpdateProfile = () => {
  const { loading, error, user } = useSelector((state) => state.user);
  const {
    loading: updateLoading,
    error: updateError,
    message,
  } = useSelector((state) => state.like);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(null);
  const [avatarPrev, setAvatarPrev] = useState(user.avatar.url);
  const dispatch = useDispatch();
  const alert = useAlert();
  const submitHandler = async (e) => {
    e.preventDefault();
    // dispatch(registerUser(name, email, password, avatar));
    dispatch(updateProfile(name, email, avatar)).then(() => {
      dispatch(LoadUser());
    });
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({
        type: "clearErrors",
      });
    }
    if (updateError) {
      alert.error(updateError);
      dispatch({
        type: "clearErrors",
      });
    }
    if (message) {
      alert.success(message);
      dispatch({
        type: "clearMessage",
      });
    }
  }, [dispatch, error, alert, updateError, message]);

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
        setAvatarPrev(Reader.result);
        setAvatar(Reader.result);
      }
    };
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error, dispatch, alert]);

  return loading ? (
    <Loader />
  ) : (
    <div className="updateProfile">
      <form className="updateProfileForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Social App
        </Typography>
        <Avatar
          src={avatarPrev}
          alt="User"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Name"
          required
          className="updateProfileInputs"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="updateProfileInputs"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button disabled={updateLoading} type="submit">
          Update
        </Button>
      </form>
    </div>
  );
};

export default UpdateProfile;
