import express from "express";
import { watch,getUpload,postUpload,getEdit,postEdit,deleteVideo,search } from "../controller/videoController"
import { videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/search",search);
videoRouter.route("/upload").get(getUpload).post(videoUpload.single("video"),postUpload);
videoRouter.get("/:id",watch);
videoRouter.route("/:id/edit").get(getEdit).post(postEdit);
videoRouter.get("/:id/delete",deleteVideo);

export default videoRouter;