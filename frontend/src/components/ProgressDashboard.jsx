import React from 'react';

const ProgressDashboard = ({ onBack }) => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Progress Dashboard</h1>
            <p className="my-4">This section is under development and can be built out to track user scores.</p>
            <button onClick={onBack} className="bg-slate-700 text-white p-2 rounded-lg">Back to Chat</button>
        </div>
    );
};

export default ProgressDashboard;