const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");
// function to create the post
module.exports.createPost = async (request, response) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(request.body.url, {
      folder: "posts",
    });
    const newPostData = {
      caption: request.body.caption,
      imageUrl: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: request.user._id,
    };
    const post = await Post.create(newPostData);
    const user = await User.findById(request.user._id);
    user.post.unshift(post._id);
    await user.save();
    return response.status(201).json({
      success: true,
      message: "post uploaded successfully",
      data: post,
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// function to like and unlike the post
module.exports.likeAndUnlikePost = async (request, response) => {
  try {
    console.log(request.user.name);
    console.log(request.user._id);
    const post = await Post.findById(request.params.id);
    // console.log(request.user._id)
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "post not found",
      });
    }
    var contains = post.likes.some((elem) => {
      // console.log(JSON.stringify(request.user._id) === JSON.stringify(elem));
      return JSON.stringify(request.user._id ) === JSON.stringify(elem);
    });
    // }
    if (contains) {
      const indx = post.likes.indexOf(request.user._id);
      post.likes.splice(indx, 1);
      await post.save();
      return response.status(200).json({
        success: true,
        message: "post unliked",
      });
    } else {
      post.likes.push(request.user._id);
      await post.save();
      return response.status(200).json({
        success: true,
        message: "post liked",
      });
    }
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// function to delete the post
module.exports.deletePost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
    if (post.owner.toString() !== request.user._id.toString()) {
      return response.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }
    const postt = await Post.findById({ _id: post._id });
    await cloudinary.v2.uploader.destroy(post.imageUrl.public_id);
    await Post.findOneAndDelete({ _id: post._id });
    const UserOne = await User.findById(post.owner);
    if (!UserOne) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const deleted = await User.findByIdAndUpdate(
      request.user._id,
      {
        $pull: { post: request.params.id },
      },
      {
        new: true,
      }
    );

    response.status(200).json({
      success: true,
      message: "Successfully deleted the post",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getPostOfFollowing = async (request, response) => {
  try {
    console.log(request.user._id);
    const user = await User.findById(request.user._id);
    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
    })
      .populate({
        path: "owner",
      })
      .populate({
        path: "likes",
      })
      .populate({
        path: "comments.user",
      });
    response.status(200).json({
      success: true,
      posts: posts.reverse(),
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.updateCaption = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (!post) {
      response.status(400).json({
        success: false,
        message: "not able to find the post",
      });
    }

    if (post.owner.toString() !== request.user._id.toString()) {
      response.status(401).json({
        success: false,
        message: "unauthorized user",
      });
    }

    post.caption = request.body.caption;
    post.save();

    response.status(200).json({
      success: true,
      message: "successfully updated the caption",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// adding functionality to add comments
module.exports.addComment = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (!post) {
      response.status(404).json({
        success: false,
        status: "not found the post",
      });
    }
    let commentExists = false;
    let commentIndx = -1;
    post.comments.forEach((item, indx) => {
      if (item.user.toString() === request.user._id.toString()) {
        commentExists = true;
        commentIndx = indx;
      }
    });
    if (commentExists) {
      post.comments[commentIndx].comment = request.body.comment;
      await post.save();

      return response.status(200).json({
        success: true,
        message: "Comment updated successfully",
      });
    } else {
      post.comments.push({
        user: request.user._id,
        comment: request.body.comment,
      });
    }

    await post.save();
    return response.status(200).json({
      success: true,
      message: "successfully added the comment",
    });
  } catch (error) {
    response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// writing function to delete the comment
module.exports.deleteComment = async (request, response) => {
  // only user can delete its comment
  try {
    console.log(request.body.commentId, "i am commentId from backend");
    const post = await Post.findById(request.params.id);
    if (!post) {
      return response.status(404).json({
        success: false,
        message: "post not found",
      });
    }

    if (post.owner.toString() == request.user._id.toString()) {
      let indx = -1;

      if (!request.body.commentId) {
        return response.status(404).json({
          success: false,
          message: "enter the commentId to delete the comment",
        });
      }

      post.comments.forEach((elem, index) => {
        if (elem._id.toString() === request.body.commentId.toString()) {
          return (indx = index);
        }
      });
      post.comments.splice(indx, 1);
      await post.save();
      return response.status(200).json({
        success: true,
        message: "selected comment deleted successfully",
      });
    } else {
      let indx = -1;
      post.comments.forEach((elem, index) => {
        if (elem.user.toString() === request.user._id.toString()) {
          return (indx = index);
        }
      });
      post.comments.splice(indx, 1);
      await post.save();
      return response.status(200).json({
        success: true,
        message: "comment deleted successfully",
      });
    }
  } catch (error) {}
};
