import mongoose from "mongoose";
import resultSchema from "../schema/resultSchema.schema.js";

const Result = mongoose.model('Result', resultSchema);

export default Result;