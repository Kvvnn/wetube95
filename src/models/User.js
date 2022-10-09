import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    avatarUrl: String,
    username: {type: String, required: true, unique: true},
    password: {type: String},
    email: {type: String, required: true},
    createdAt: {type: Date, default:Date.now()},
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 5);
    }
});

const userModel = mongoose.model("User",userSchema);
export default userModel;