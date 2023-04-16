import React, { useEffect, useState } from "react";
import "./NewPost.css";
import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../../Actions/Post";
import { useAlert } from "react-alert";
import { LoadUser } from "../../Actions/User";
const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();
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
        setImage(Reader.result);
      }
    };
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createNewPost(caption, image));
    dispatch(LoadUser());
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
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
  }, [dispatch, error, alert, message]);
  return (
    <div className="newPost">
      <form action="" className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>
        {image && <img src={image} alt="post" />}
        <input
          type="file"
          name=""
          className="newFile"
          id=""
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
