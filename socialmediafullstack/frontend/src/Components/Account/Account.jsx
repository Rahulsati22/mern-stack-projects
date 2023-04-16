import React from "react";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import react, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import "./Account.css";
import { deleteMyProfile, getMyPosts, logoutUser } from "../../Actions/User";
const Account = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { user, loading: userLoading } = useSelector((state) => state.user);
  const { loading, posts, error } = useSelector((state) => state.allPost);
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const navigate = useNavigate();
  const {
    error: likeError,
    message,
    loading: deleteLoading,
  } = useSelector((state) => state.like);

  const logoutHandler = () => {
    dispatch(logoutUser());
    alert.success("Logged out successfully");
  };

  const deleteProfileHandler = () => {
    dispatch(deleteMyProfile()).then(()=>{
      dispatch(logoutUser());
    });
  };

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch, message]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (likeError) {
      alert.error(likeError);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, message, likeError, dispatch]);

  useEffect(() => {
    dispatch(getMyPosts());
  }, [dispatch]);
  return loading || userLoading ? (
    <Loader />
  ) : (
    <>
      <div className="account" style={{ height: "91vh" }}>
        <div className="accountleft">
          {posts && posts.length > 0 ? (
            posts.map((post) => {
              return (
                <Post
                  postId={post._id}
                  postImage={post.imageUrl.url}
                  key={post._id}
                  caption={post.caption}
                  likes={post.likes}
                  comments={post.comments}
                  ownerImage={post.owner.avatar.url}
                  ownerName={post.owner.name}
                  ownerId={post.owner._id}
                  isAccount={true}
                  isDelete={true}
                />
              );
            })
          ) : (
            <Typography variant="h6">No posts to show</Typography>
          )}
        </div>
        <div className="accountright">
          <Avatar
            style={{ height: "8vmax", width: "8vmax" }}
            src={user.avatar.url}
          />

          <Typography variant="h5" style={{ color: "black" }}>
            {user.name}
          </Typography>

          <div>
            <Button onClick={() => setFollowersToggle(!followersToggle)}>
              <Typography>Followers</Typography>
            </Button>
            <Typography>
              {user && user.followers ? user.followers.length : 0}
            </Typography>
          </div>

          <div>
            <Button>
              <Typography onClick={() => setFollowingToggle(!followingToggle)}>
                Following
              </Typography>
            </Button>
            <Typography>
              {user && user.following ? user.following.length : 0}
            </Typography>
          </div>

          <div>
            <Button>
              <Typography>Post</Typography>
            </Button>
            <Typography>{user && user.post ? user.post.length : 0}</Typography>
          </div>

          <Button variant="contained" onClick={logoutHandler}>
            Logout
          </Button>

          <Link to="/update/profile">Edit Profile</Link>
          <Link to="/update/password">Change Password</Link>
          <Button
            variant="text"
            style={{ color: "red", margin: "2vmax" }}
            onClick={deleteProfileHandler}
            disabled={deleteLoading}
          >
            Delete My Profile
          </Button>

          <Dialog
            open={followersToggle}
            onClose={() => setFollowersToggle(!followersToggle)}
          >
            <div className="DialogBox">
              <Typography variant="h4">Followers</Typography>
              {user && user.followers && user.followers.length > 0 ? (
                user.followers.map((follower) => {
                  return (
                    <User
                      key={follower._id}
                      userId={follower._id}
                      name={follower.name}
                      avatar={follower.avatar.url}
                    />
                  );
                })
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You have no followers
                </Typography>
              )}
            </div>
          </Dialog>

          <Dialog
            open={followingToggle}
            onClose={() => setFollowingToggle(!followingToggle)}
          >
            <div className="DialogBox">
              <Typography variant="h4">Following</Typography>
              {user && user.following && user.following.length > 0 ? (
                user.following.map((foling) => {
                  return (
                    <User
                      key={foling._id}
                      userId={foling._id}
                      name={foling.name}
                      avatar={foling.avatar.url}
                    />
                  );
                })
              ) : (
                <Typography style={{ margin: "2vmax" }}>
                  You are not following anyone
                </Typography>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default Account;
