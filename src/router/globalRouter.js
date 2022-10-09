import express from "express";
import { getHome } from "../controller/videoController";
import { getJoin, postJoin, getLogin, postLogin } from "../controller/UserController";

const globalRouter = express.Router();

globalRouter.get("/",getHome);
globalRouter.route("/login").get(getLogin).post(postLogin);
globalRouter.route("/join").get(getJoin).post(postJoin);


export default globalRouter;