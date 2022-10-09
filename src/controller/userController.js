import Video from "../models/Video"
import User from "../models/User"
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    return res.render("./users/join",{pageTitle:"Join"})
}
export const postJoin = async(req, res) => {
    const { username,password,password2,email } = req.body;
    const pageTitle = "Join";

    if (password !== password2) {
      return res.status(400).render("./users/join", {
        pageTitle,
        errorMessage: "Password confirmation does not match",
      });
    }
    const exists = await User.exists({ username });
    if (exists) {
      return res.status(400).render("./users/join", {
        pageTitle,
        errorMessage: "This username is already taken",
      });
    }
    try{
        await User.create({
        username,
        password,
        email
        })
    }catch(error){
        return res.status(400).render("./users/join", {
            pageTitle,
            errorMessage: error._message
        })
    }
    return res.redirect("/login")
}
export const getLogin = (req, res) => {
  return res.render("./users/login",{pageTitle:"Log In"})
}

export const postLogin = async(req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({username});
  console.log(user);
  if (!user) {
    return res.status(400).render("./users/login", {
      pageTitle,
      errorMessage: "This username does not exist",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("./users/login", {
      pageTitle,
      errorMessage: "Wrong password",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
}

export const getEditProfile = (req, res) => {
    return res.render("./users/edit-profile",{pageTitle:"Edit profile"})
}

export const postEditProfile = async(req, res) => {
  const {
    session: {
      user: { _id, avatarUrl},
    },
    body: { email, username },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      email,
      username,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/");
};


export const getChangePassword = (req, res) => {
  return res.render("./users/change-password",{pageTitle:"Change Password"})
}

export const postChangePassword = async(req, res) => {
  const pageTitle = "Change Password";
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPassword2 },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("./users/change-password", {
      pageTitle,
      errorMessage: "The current password is incorrect",
    });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).render("./users/change-password", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
}

export const logout = (req,res) => {
  req.session.destroy();
  return res.redirect("/login");
}

export const myProfile = async(req, res) => {
  const { _id } = req.session.user;
  const user = await User.findById(_id);
  return res.render("./users/profile",{pageTitle : "Profile", user})
}