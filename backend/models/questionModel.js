import mongoose from 'mongoose';

const questionSchema = mongoose.Schema({
  category: { type: String, required: true },
  difficulty: { type: String },
  field: { type: String },
  question_text: { type: String, required: true },
  answer_text: { type: String, required: true },
  keywords: { type: [String] },
  solution: { type: String },
  stage: { type: Number },
  parent: { type: String },
  options: { type: Map, of: String },
});

const Question = mongoose.model('Question', questionSchema);
export default Question;