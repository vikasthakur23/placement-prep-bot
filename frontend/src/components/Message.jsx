import React from 'react';

const Message = ({ sender, text, children }) => {
    const isBot = sender === 'bot';
    const BotIcon = () => (
        <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M12 12v.01"/></svg>
        </div>
    );
    const UserIcon = () => <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">U</div>;


    const renderText = (txt) => {
        if (!txt) return '';
        const parts = txt.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className={`flex items-start gap-3 my-4 animate-fade-in w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
            {isBot && <BotIcon />}
            <div className={`max-w-md p-4 rounded-2xl shadow-md ${isBot ? 'bg-white text-slate-800 rounded-tl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
                {text && <p className="text-sm whitespace-pre-wrap">{renderText(text)}</p>}
                {children}
            </div>
            {!isBot && <UserIcon />}
        </div>
    );
};

export default Message;