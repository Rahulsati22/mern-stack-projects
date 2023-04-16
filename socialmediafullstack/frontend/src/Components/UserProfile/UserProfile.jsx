import React from "react";
import { Avatar, Button, Dialog, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
import {
  LoadUser,
  followAndUnfollowUser,
  getFollowingPost,
  getMyPosts,
  getUserPosts,
  getUserProfile,
} from "../../Actions/User";
const UserProfile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const {
    user,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.userProfile);

  const { user: me } = useSelector((state) => state.user);

  const { loading, error, posts } = useSelector((state) => state.userPosts);

  const {
    error: followError,
    message,
    loading: followLoading,
  } = useSelector((state) => state.like);

  const params = useParams();
  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState(false);

  const followHandler = () => {
    setFollowing(!following);
    dispatch(followAndUnfollowUser(user._id)).then(() => {
      dispatch(getUserProfile(params.id)).then(() => {
        dispatch(LoadUser()).then(() => {
          dispatch(getFollowingPost());
        });
      });
    });
  };

  useEffect(() => {
    dispatch(getUserPosts(params.id)).then(() => {
      dispatch(getUserProfile(params.id));
    });
  }, [dispatch, params.id]);

  useEffect(() => {
    if (me._id === params.id) {
      setMyProfile(true);
    }

    if (user) {
      user.followers.forEach((item) => {
        if (item._id === me._id) {
          setFollowing(true);
        } else {
          setFollowing(false);
        }
      });
    }
  }, [user, me._id, params.id]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (followError) {
      alert.error(followError);
      dispatch({ type: "clearErrors" });
    }

    if (userError) {
      alert.error(userError);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [alert, error, message, followError, userError, dispatch]);
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
                  ownerId={post && post.owner._id}
                  userProf={true}
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
            src={user && user.avatar.url}
          />

          <Typography variant="h5" style={{ color: "black" }}>
            {user && user.name}
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

          {myProfile ? null : (
            <Button
              variant="contained"
              onClick={followHandler}
              style={{ background: following ? "red" : "blue" }}
              disabled={followLoading}
            >
              {following ? "Unfollow" : "Follow"}
            </Button>
          )}

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
export default UserProfile;
