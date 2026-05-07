import React from 'react';

const StatCard = ({ title, value, unit }) => {
    return (
        <div className="bg-surface p-4 rounded-lg shadow-md">
            <h3 className="text-text-primary text-lg font-semibold">{title}</h3>
            <p className="text-2xl text-text-primary">
                {value} {unit}
            </p>
        </div>
    );
};

export default StatCard;