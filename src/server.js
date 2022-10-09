import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import {localsMiddleware} from "./middlewares"
import globalrouter from "./router/globalrouter"
import userRouter from "./router/userRouter"
import videoRouter from "./router/videoRouter"

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug")
app.set("views", process.cwd()+"/src/views")
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    })
);
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads"));
app.use("/",globalrouter);
app.use("/videos",videoRouter);
app.use("/users",userRouter);

export default app;