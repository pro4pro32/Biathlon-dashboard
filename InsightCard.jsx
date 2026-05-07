import React from 'react';

const InsightCard = ({ insight }) => {
    return (
        <div className="border-yellow-500 border-2 p-4 rounded-lg bg-surface">
            <h3 className="text-lg font-semibold text-text-primary">Performance Insight</h3>
            <p className="text-text-muted">{insight}</p>
        </div>
    );
};

export default InsightCard;