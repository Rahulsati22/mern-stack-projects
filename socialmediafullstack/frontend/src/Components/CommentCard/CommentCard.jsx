import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../Actions/logic";
import "./CommentCard.css";
import { Link } from "react-router-dom";
import { DeleteOutline } from "@mui/icons-material";
import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { deleteCommentPost } from "../../Actions/Post";
import { getFollowingPost, getUserPosts } from "../../Actions/User";
const CommentCard = ({
  userId,
  name,
  avatar,
  comment,
  commentId,
  postId,
  ownerId,
  isAccount,
  userProf = false,
}) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const deleteCommentHandle = () => {
    console.log(commentId, "i am comment id");
    console.log(postId, "i am postId");
    dispatch(deleteCommentPost(postId, commentId)).then(() => {
      if (!userProf) {
        if (isAccount) {
          console.log("this is my account");
        } else {
          dispatch(getFollowingPost());
        }
      } else {
        dispatch(getUserPosts(ownerId));
      }
    });
  };
  return (
    <div className="commentUser">
      <Link to={`/user/${userId}`}>
        <img src={avatar} alt={name} />
        <Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
      </Link>
      <Typography>{comment}</Typography>

      {isAccount ? (
        <Button onClick={deleteCommentHandle}>
          <DeleteOutline />
        </Button>
      ) : userId === user._id ? (
        <Button onClick={deleteCommentHandle}>
          <DeleteOutline />
        </Button>
      ) : null}
    </div>
  );
};

export default CommentCard;
