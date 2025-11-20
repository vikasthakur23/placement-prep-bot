import React from 'react';

const CategorySelector = ({ onSelect, onSetSpecialization, careerPath }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full animate-fade-in">
            {careerPath && (
                <div className="text-center mb-3 p-2 bg-blue-100 border-l-4 border-blue-500 text-blue-800 text-sm rounded-r-lg">
                    <p>Specialization set to: <strong>{careerPath}</strong></p>
                </div>
            )}
            <div className="grid grid-cols-3 gap-3">
                <button onClick={() => onSelect('HR')} className="option-button bg-rose-500">HR</button>
                <button onClick={() => onSelect('Technical')} className="option-button bg-indigo-500">Technical</button>
                <button onClick={() => onSelect('Aptitude')} className="option-button bg-amber-500">Aptitude</button>
                <button onClick={() => onSelect('Company-Specific')} className="option-button bg-emerald-500 col-span-3">Company</button>
            </div>
            <hr className="my-3" />
            <div className="grid grid-cols-2 gap-3">
                <button onClick={onSetSpecialization} className="option-button bg-slate-700">{careerPath ? 'Change' : 'Select'} Specialization</button>
                <button onClick={() => onSelect('Career Counseling')} className="option-button bg-cyan-500">Career Counseling</button>
            </div>
        </div>
    );
};

export default CategorySelector;