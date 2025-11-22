import mongoose from "mongoose";
import dotenv from "dotenv";
import { questions } from "./data/questions.js";
import Question from "./models/questionModel.js";

dotenv.config();

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected!");

    console.log("Clearing old questions...");
    await Question.deleteMany();

    console.log("Inserting new questions...");
    await Question.insertMany(questions);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
};

seedData();
