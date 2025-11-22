import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuestions, evaluateAnswer } from '../api';
import Message from '../components/Message';
import CategorySelector from '../components/CategorySelector';

const ChatPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const [stage, setStage] = useState('INIT');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [careerPath, setCareerPath] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (storedUserInfo) {
            setUserInfo(storedUserInfo);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (stage === 'INIT' && userInfo) {
            addMessage('bot', `Hello ${userInfo.name}! I am your Placement Prep Bot. You can start with a round, select a specialization, or take the career counseling quiz.`);
            setTimeout(() => resetToCategorySelect(), 1000);
        }
    }, [stage, userInfo]);

    const addMessage = (sender, text, children = null) => {
        setMessages(prev => [...prev, { sender, text, children }]);
    };
    
    const handleCategorySelect = async (category) => {
        if (category === 'Career Counseling') {
            handleCounselingStart();
            return;
        }
        addMessage('user', null, <div className="text-sm font-semibold">{`Practice: ${category}`}</div>);
        setIsLoading(true);
        try {
            const { data: questions } = await fetchQuestions(category, careerPath);
            setIsLoading(false);
            if (!questions || questions.length === 0) {
                addMessage('bot', `Sorry, I couldn't find any ${careerPath ? careerPath + '-specific' : ''} questions for ${category}.`);
                resetToCategorySelect();
                return;
            }
            const question = questions[Math.floor(Math.random() * questions.length)];
            setCurrentQuestion(question);
            addMessage('bot', `${question.field ? `**[${question.field}]** ` : ''}${question.question_text}`);
            setStage('AWAITING_ANSWER');
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            addMessage('bot', "There was an error fetching questions.");
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        addMessage('user', userInput);
        setStage('EVALUATING');
        setUserInput('');
        setIsLoading(true);
        try {
            const { data } = await evaluateAnswer(currentQuestion.keywords, userInput);
            setIsLoading(false);
            addMessage('bot', `Your answer scores a **${data.score}/10**. Here's the model answer for comparison:\n\n${currentQuestion.answer_text}`);
            setStage('ANSWER_SHOWN');
            setTimeout(resetToCategorySelect, 4000);
        } catch(error) {
             console.error(error);
            setIsLoading(false);
            addMessage('bot', "There was an error evaluating your answer.");
        }
    };

    const handleCounselingStart = async () => {
        setCareerPath(null);
        addMessage('user', null, <div className="text-sm font-semibold">Start Career Counseling</div>);
        setStage('COUNSELING');
        const { data } = await fetchQuestions('Career Counseling');
        const firstQuestion = data.find(q => q.stage === 1);
        setCurrentQuestion(firstQuestion);
        addMessage('bot', firstQuestion.question_text);
    };

    const handleCounselingAnswer = async (optionKey, parentChoice) => {
        addMessage('user', `Choice: ${optionKey}`);
        if (currentQuestion.stage === 1) {
            const { data } = await fetchQuestions('Career Counseling');
            const nextQuestion = data.find(q => q.stage === 2 && q.parent === parentChoice);
            setCurrentQuestion(nextQuestion);
            addMessage('bot', nextQuestion.question_text);
        } else {
            setCareerPath(parentChoice);
            addMessage('bot', `Based on your answers, your profile aligns with **${parentChoice}**! Your session is now personalized.`);
            resetToCategorySelect();
        }
    };
            
    const handleFieldSelectDirectly = (field) => {
        addMessage('user', null, <div className="text-sm font-semibold">{`Set Specialization: ${field}`}</div>);
        setCareerPath(field);
        addMessage('bot', `Great! Your session is now personalized for **${field}**.`);
        resetToCategorySelect();
    };
            
    useEffect(() => {
        if (stage === 'SELECTING_FIELD') {
            const fields = ["Web Development", "AI/ML", "Cybersecurity", "Data Science", "Cloud Computing & DevOps", "Mobile App Development", "Blockchain Technology", "Game Development", "IoT", "AR/VR"];
            addMessage('bot', "Please choose your desired specialization:",
                <div className="grid grid-cols-2 gap-2 pt-2">
                    {fields.map(field => (
                        <button key={field} onClick={() => handleFieldSelectDirectly(field)} className="option-button bg-blue-500 justify-center">{field}</button>
                    ))}
                    <button onClick={resetToCategorySelect} className="option-button bg-slate-500 justify-center col-span-2">Back</button>
                </div>
            );
        }
    }, [stage]);

    const resetToCategorySelect = () => {
        setStage('CATEGORY_SELECT');
        setCurrentQuestion(null);
    };
    
    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen">
             <header className="bg-slate-800 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Placement Prep Bot</h1>
                {userInfo && <button onClick={handleLogout} className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold">Logout</button>}
            </header>
            <main className="flex-1 overflow-y-auto p-4">
                {messages.map((msg, i) => (<Message key={i} sender={msg.sender} text={msg.text}>{msg.children}</Message>))}
                {isLoading && <Message sender="bot" text="Thinking..." />}
                <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 bg-white border-t flex justify-center items-center">
                <div className="w-full max-w-lg">
                    {stage === 'CATEGORY_SELECT' && <CategorySelector onSelect={handleCategorySelect} onSetSpecialization={() => setStage('SELECTING_FIELD')} careerPath={careerPath} />}
                    {stage === 'AWAITING_ANSWER' && (
                        <form onSubmit={handleAnswerSubmit} className="flex items-center gap-3">
                            <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Type your answer here..." className="w-full px-4 py-3 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                            <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors disabled:bg-slate-400" disabled={!userInput.trim()}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </button>
                        </form>
                    )}
                    {stage === 'COUNSELING' && currentQuestion && (
                        <div className="flex flex-col items-center flex-wrap gap-2 w-full">
                            {Object.keys(currentQuestion.options).map(key => (
                                <button key={key} onClick={() => handleCounselingAnswer(key, currentQuestion.options[key])} className="w-full px-5 py-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition">
                                    {key}: {currentQuestion.question_text.split('\n').find(line => line.includes(`(${key})`))?.split(') ')[1]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default ChatPage;