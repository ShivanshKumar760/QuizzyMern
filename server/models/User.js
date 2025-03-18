import mongoose from "mongoose";
import userSchema from "../schema/userSchema.schema.js";
const User = mongoose.model("User", userSchema);

export default User;