import Video from "../models/Video"
import User from "../models/User"

export const getHome = async(req,res) => {
    console.log(res.locals)
    const videos = await Video.find({}).sort({createdAt:"desc"})
    return res.render("home",{ pageTitle:"home" , videos });
}

export const watch = async(req,res) => {
    const { id } = req.params
    const video = await Video.findById(id).populate("owner");
    return res.render("./videos/watch", {pageTitle: video.title, video} );
}

export const getUpload = (req, res) => {
    return res.render("./videos/upload",{pageTitle:"Upload"});
}

export const postUpload = async(req, res) => {
    const {
        user: { _id },
      } = req.session;
    const { path: fileUrl } = req.file;
    const {title, description, hashtags} = req.body;
    // try{
        const newVideo = await Video.create({
        title,
        description,
        fileUrl,
        owner:_id,
        hashtags: Video.formatHashtags(hashtags)
        });

        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();

        return res.redirect("/")

    // } catch (error) {
    //     console.log(error._message)
    //     return res.status(400).render("./videos/upload", {
    //         pageTitle: "Upload",
    //         errorMessage: error._message,
    //     });
    // }
    
}

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    return res.render("./videos/edit-video",{pageTitle:"Edit Video",video})
} 

export const postEdit = async(req,res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const video = await Video.exists({_id:id});
    if(!video){
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
      });
    return res.redirect(`/videos/${id}`)
}

export const deleteVideo = async(req,res) => {
    const { id } = req.params;
    await Video.findByIdAndRemove(id);
    return res.redirect("/")
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
      videos = await Video.find({
        title: {
          $regex: new RegExp(`${keyword}`, "i"),
        },
      });
    }
    return res.render("./videos/search", { pageTitle: "Search", videos, keyword });
  };