import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { questions } from './data/questions.js';
import Question from './models/questionModel.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Question.deleteMany();
    console.log('Data Destroyed...');
    await Question.insertMany(questions);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Seeder Error: ${error}`);
    process.exit(1);
  }
};

importData();