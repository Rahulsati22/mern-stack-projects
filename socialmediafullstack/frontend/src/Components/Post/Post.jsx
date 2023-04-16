import React, { useEffect } from "react";
import "./Post.css";
import { Link } from "react-router-dom";
import { Avatar, Typography, Button, Dialog } from "@mui/material";
import { useState } from "react";
import User from "../User/User";
import { deletePost } from "../../Actions/Post";
import {
  MoreVert,
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  DeleteOutline,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { commentPost, likePost, updatePost } from "../../Actions/Post";
import {
  LoadUser,
  getFollowingPost,
  getMyPosts,
  getUserPosts,
} from "../../Actions/User";
import { getUserProfile } from "../../Actions/logic";
import CommentCard from "../CommentCard/CommentCard";
const Post = ({
  postId,
  caption,
  postImage,
  likes = [],
  comments = [],
  ownerImage,
  ownerName,
  ownerId,
  isDelete = false,
  isAccount = false,
  userProf = false,
}) => {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [allLike, setAllLike] = useState(false);
  const [commentValue, setCommentValue] = useState("");
  const [commentToggle, setCommentToggle] = useState("");
  const [captionValue, setCaptionValue] = useState(caption);
  const [captionToggle, setCaptionToggle] = useState("");
  const { user } = useSelector((state) => state.user);
  console.log(user, "i am user");

  /*this will handle the likes means when any post is likes it will fetch all the likes */
  const handlelike = async () => {
    setLiked(!liked);
    dispatch(likePost(postId)).then(() => {
      if (!userProf) {
        if (!isAccount) {
          dispatch(getFollowingPost());
        } else {
          dispatch(getMyPosts());
        }
      } else {
        dispatch(getUserPosts(ownerId));
      }
    });
  };

  const addCommentHandler = async (e) => {
    e.preventDefault();
    console.log(postId);
    dispatch(commentPost(postId, commentValue)).then(() => {
      if (!userProf) {
        if (isAccount) {
          dispatch(getMyPosts());
        } else {
          dispatch(getFollowingPost());
        }
      } else {
        dispatch(getUserPosts(ownerId));
      }
    });
  };

  /* if the post is liked already it will put that post as liked */
  useEffect(() => {
    console.log(user._id);
    likes.forEach((item) => {
      if (item._id === user._id) {
        setLiked(true);
      }
    });
  }, [likes, user._id]);

  /*if it is true it will open the modal of the likes otherwise it will close it*/
  const handleLikess = () => {
    setAllLike(!allLike);
  };

  /* it will remount all the components when we want to see all the likes on a post */


  /* this will add the message to the comment state and print commented successfully */

  const updateCaptionHandler = (e) => {
    e.preventDefault();
    dispatch(updatePost(captionValue, postId));
    dispatch(getMyPosts());
  };

  const deletePostHandler = (e) => {
    dispatch(deletePost(postId));
    dispatch(getMyPosts());
    dispatch(LoadUser());
  };

  return (
    <>
      <div className="post">
        {/* this is our post header start */}
        <div className="postHeader">
          {isAccount ? (
            <Button onClick={() => setCaptionToggle(!captionToggle)}>
              <MoreVert />
            </Button>
          ) : null}
        </div>
        {/* this is our post header end */}

        {/* this is our post image and caption of the post start */}
        <img src={postImage} alt="Post" />
        <div className="postDetails">
          <Avatar
            src={ownerImage}
            alt="User"
            sx={{
              height: "3vmax",
              width: "3vmax",
            }}
          />

          <Link to={`user/${ownerId}`}>
            <Typography fontWeight={700}>{ownerName}</Typography>
          </Link>

          <Typography
            fontWeight={100}
            color="rgba(0,0,0,0.582)"
            style={{ alignSelf: "center" }}
          >
            {caption}
          </Typography>
        </div>
        {/* this is our post image and caption of the post end */}

        {/* button if we click we can see all the likes start */}
        <button
          style={{
            border: "none",
            backgroundColor: "white",
            cursor: "pointer",
            margin: "1vmax 2vmax",
          }}
          disabled={likes.length === 0}
          onClick={handleLikess}
        >
          <Typography>{likes.length} likes</Typography>
        </button>
        {/* button if we click we can see all the likes end*/}

        {/* this is all the buttons for like comment and delete start*/}
        <div className="postFooter">
          <Button onClick={handlelike}>
            {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
          </Button>

          <Button onClick={() => setCommentToggle(!commentToggle)}>
            <ChatBubbleOutline />
          </Button>

          {isDelete && (
            <Button onClick={deletePostHandler}>
              <DeleteOutline />
            </Button>
          )}
        </div>
        {/* this is all buttons for like comment and delete end*/}

        {/* this is likes dialogue start */}
        <Dialog open={allLike} onClose={() => setAllLike(!allLike)}>
          <div className="DialogBox">
            <Typography variant="h4">Liked By</Typography>
            {likes.map((like) => {
              return (
                <User
                  key={like._id}
                  userId={like._id}
                  name={like.name}
                  avatar={like.avatar.url}
                />
              );
            })}
          </div>
        </Dialog>
        {/* this is likes dialogue end */}

        {/* this is comment dialogue start */}
        <Dialog
          open={commentToggle}
          onClose={() => setCommentToggle(!commentToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Comments</Typography>

            <form className="commentForm" onSubmit={addCommentHandler}>
              <input
                type="text"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                placeholder="Comment here..."
                required
              />
              <Button type="submit" variant="contained">
                Add
              </Button>
            </form>
            {comments.length > 0 ? (
              comments.map((element) => {
                console.log(element);
                return (
                  <CommentCard
                    key={element._id}
                    name={element.user.name}
                    avatar={element.user.avatar.url}
                    comment={element.comment}
                    commentId={element._id}
                    postId={postId}
                    isAccount={isAccount}
                    userId={element.user._id}
                    userProf={userProf}
                    ownerId={ownerId}
                  />
                );
              })
            ) : (
              <Typography>No comments yet</Typography>
            )}
          </div>
        </Dialog>

        {/* this is comment dialogue end */}

        {/* this is updateCaption dialogue start */}
        <Dialog
          open={captionToggle}
          onClose={() => setCaptionToggle(!captionToggle)}
        >
          <div className="DialogBox">
            <Typography variant="h4">Update Caption</Typography>

            <form className="commentForm" onSubmit={updateCaptionHandler}>
              <input
                type="text"
                value={captionValue}
                onChange={(e) => setCaptionValue(e.target.value)}
                placeholder="Caption here..."
                required
              />
              <Button type="submit" variant="contained">
                Add
              </Button>
            </form>
          </div>
        </Dialog>

        {/* this is updateCaption dialogue end */}
      </div>
    </>
  );
};

export default Post;
