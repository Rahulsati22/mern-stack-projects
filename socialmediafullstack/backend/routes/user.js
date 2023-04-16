const express = require("express");
const router = express.Router();
const mw = require("../middleware/isAuthenticated");
const userController = require("../controllers/user");
router.route("/register").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/logout").get(mw.isAuth, userController.logout);
router.route("/follow/:id").get(mw.isAuth, userController.followUser);
router.route("/update/password").put(mw.isAuth, userController.updatePassword);
router.route("/update/profile").put(mw.isAuth, userController.updateProfile);
router.route("/delete/me").delete(mw.isAuth, userController.deleteMyProfile);
router.route("/myprofile").get(mw.isAuth, userController.myProfile);
router.get("/:id", mw.isAuth, userController.getUserProfile);
router.route("/").get(mw.isAuth, userController.findAllUser);
router.route("/my/posts").get(mw.isAuth, userController.findAllPost);
router.route("/userposts/:id").get(mw.isAuth, userController.getUserPosts);
router.route('/forgot/password').post(userController.forgotPassword);
router.route('/password/reset/:token').put(userController.resetPassword)
module.exports = router;
