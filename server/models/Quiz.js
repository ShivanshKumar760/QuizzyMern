import mongoose from "mongoose";
import quizSchema from "../schema/quizSchema.schema.js";


const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz 