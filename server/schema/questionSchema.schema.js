import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
    text: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctAnswer: {
      type: Number,
      required: true
    }
});


export default questionSchema;
