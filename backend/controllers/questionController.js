import Question from '../models/questionModel.js';

const getQuestions = async (req, res) => {
  const { category, field } = req.query;
  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }
  try {
    if (field && category !== 'Aptitude' && category !== 'Career Counseling') {
      const fieldSpecificQuestions = await Question.find({ category, field });
      const genericQuestions = await Question.find({ category, field: { $exists: false } });
      const questions = [...fieldSpecificQuestions, ...genericQuestions];
      if (questions.length === 0) {
        return res.json(await Question.find({ category, field: { $exists: false } }));
      }
      return res.json(questions);
    }
    const questions = await Question.find({ category });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

const evaluateAnswer = async (req, res) => {
  const { keywords, userAnswer } = req.body;
  try {
    const userWords = new Set(userAnswer.toLowerCase().split(/\s+/));
    const matchedKeywords = keywords.filter(kw => userWords.has(kw.toLowerCase()));
    let score = 0;
    if (keywords.length > 0) {
      score = Math.round((matchedKeywords.length / keywords.length) * 10);
    }
    res.json({ score: Math.max(score, 1) });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { getQuestions, evaluateAnswer };