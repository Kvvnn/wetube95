import express from "express";
import { getEditProfile, postEditProfile, logout,getChangePassword,postChangePassword, myProfile} from "../controller/userController"
import { avatarUpload } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout",logout)
userRouter.get("/:id",myProfile);
userRouter.route("/:id/edit").get(getEditProfile).post(avatarUpload.single("avatar"),postEditProfile);
userRouter.route("/:id/change-password").get(getChangePassword).post(postChangePassword);

export default userRouter;