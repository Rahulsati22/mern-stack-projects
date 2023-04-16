const middleware = require("../middleware/isAuthenticated");
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
router.route("/upload").post(middleware.isAuth, postController.createPost);
router
  .route("/:id")
  .get(middleware.isAuth, postController.likeAndUnlikePost)
  .delete(middleware.isAuth, postController.deletePost)
  .put(middleware.isAuth, postController.updateCaption);

router.route("/").get(middleware.isAuth, postController.getPostOfFollowing);
router
  .route("/comment/:id")
  .put(middleware.isAuth, postController.addComment)
  .delete(middleware.isAuth, postController.deleteComment);
module.exports = router;
