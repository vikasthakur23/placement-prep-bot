import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  category: String,
  field: String,
  stage: Number,
  parent: String,
  question_text: { type: String, required: true },
  answer_text: String,
  options: Object,
  keywords: [String]
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
